# /// script
# dependencies = [
#   "aiohttp",
#   "requests<3",
#   "rich",
#   "scrapy",
# ]
# ///

# https://docs.astral.sh/uv/guides/scripts/#declaring-script-dependencies

import os
import argparse
import asyncio
import aiohttp
import scrapy
import threading
import queue
import xml.etree.ElementTree as ET
from urllib.parse import urlparse
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapy.crawler import CrawlerProcess

# --- GLOBALS FOR TRACKING AND QUEUING ---
# Set to track all discovered URLs (for sitemap/stats).
discovered_urls_set = set()

# For downloaded files, we track the URLs.
downloaded_files = set()

# Thread-safe queue and sets for files to download.
file_queue = queue.Queue()
queued_files = set()
download_lock = threading.Lock()

# Global dictionary for descriptions.
# Key: full download URL (as queued), Value: description text
descriptions = {}

# Event to signal that crawling is complete.
spider_finished_event = threading.Event()

# Allowed file extensions.
ALLOWED_EXTENSIONS = [".pdf", ".epub", ".mobi"]


class SitemapSpider(CrawlSpider):
    name = "sitemap_spider"
    allowed_domains = ["globalgreyebooks.com"]
    start_urls = ["https://www.globalgreyebooks.com/"]

    rules = (
        Rule(
            LinkExtractor(allow_domains=allowed_domains),
            callback="parse_item",
            follow=True,
        ),
    )

    def parse_item(self, response):
        url = response.url
        # Add URL to global discovered set for stats and sitemap.
        discovered_urls_set.add(url)
        yield {"url": url}

        # --- CHECK FOR HTML CONTENT ---
        content_type = response.headers.get("Content-Type", b"").decode("utf-8")
        if "text/html" not in content_type:
            return

        # --- EXTRACT DESCRIPTION SECTION (if present) ---
        description_text = ""
        desc_section = response.css("section.description")
        if desc_section:
            # Join all text from the description section.
            description_text = " ".join(desc_section.css("*::text").getall()).strip()

        # --- EXTRACT DOWNLOADS SECTION (if present) ---
        try:
            downloads_section = response.css("section.downloads")
        except Exception as e:
            print(f"Error processing downloads section for {url}: {e}")
            return

        if downloads_section:
            # Extract all download links (for pdf, epub, mobi)
            links = downloads_section.css("a.button::attr(href)").getall()
            for link in links:
                absolute_link = response.urljoin(link)
                ext = os.path.splitext(urlparse(absolute_link).path)[1].lower()
                if ext in ALLOWED_EXTENSIONS:
                    with download_lock:
                        # Queue the file if not already queued or downloaded.
                        if (
                            absolute_link not in downloaded_files
                            and absolute_link not in queued_files
                        ):
                            queued_files.add(absolute_link)
                            file_queue.put(absolute_link)
                            print(f"Queued {ext} file: {absolute_link}")
                            # If a description was found on this page, store it keyed by the file URL.
                            if description_text:
                                descriptions[absolute_link] = description_text
        # End of parse_item


class SitemapPipeline:
    def __init__(self):
        self.urls = set()

    def process_item(self, item, spider):
        self.urls.add(item["url"])
        return item

    def close_spider(self, spider):
        # Build sitemap.xml from discovered URLs.
        urlset = ET.Element(
            "urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        )
        for url in sorted(self.urls):
            url_el = ET.SubElement(urlset, "url")
            loc = ET.SubElement(url_el, "loc")
            loc.text = url
        tree = ET.ElementTree(urlset)
        tree.write("sitemap.xml", encoding="utf-8", xml_declaration=True)


async def download_file(url, session, semaphore):
    async with semaphore:
        ext = os.path.splitext(urlparse(url).path)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            return  # Skip unsupported file types

        # Determine the target subfolder based on the extension.
        subfolder = ext[1:]  # "pdf", "epub", or "mobi"
        folder = os.path.join("ebooks", subfolder)
        os.makedirs(folder, exist_ok=True)
        filename = os.path.join(folder, os.path.basename(urlparse(url).path))

        # --- CHECK: Skip download if file already exists ---
        if os.path.exists(filename):
            print(f"File already exists, skipping download: {url}")
            with download_lock:
                downloaded_files.add(url)
            return

        try:
            async with session.get(url) as response:
                if response.status == 200:
                    file_data = await response.read()
                    with open(filename, "wb") as f:
                        f.write(file_data)
                    print(f"Downloaded {ext} file: {url}")
                    with download_lock:
                        downloaded_files.add(url)
                else:
                    print(f"Failed to download {url}: status {response.status}")
        except Exception as e:
            print(f"Error downloading {url}: {e}")


async def file_downloader_daemon():
    semaphore = asyncio.Semaphore(5)  # Limit concurrent downloads to 5
    async with aiohttp.ClientSession() as session:
        while True:
            tasks = []
            # Drain the file queue.
            while True:
                try:
                    url = file_queue.get_nowait()
                    tasks.append(
                        asyncio.create_task(download_file(url, session, semaphore))
                    )
                except queue.Empty:
                    break
            if tasks:
                await asyncio.gather(*tasks)
            # Exit loop if crawling finished and queue is empty.
            if spider_finished_event.is_set() and file_queue.empty():
                break
            await asyncio.sleep(1)


def start_file_downloader():
    asyncio.run(file_downloader_daemon())


def write_descriptions_to_files():
    """
    Write each description text to a .txt file in the appropriate subfolder.
    The text file will have the same base name as the downloaded file.
    """
    # Process in a first-in-last-out order (simulate LIFO by reversing the order)
    for file_url, desc in reversed(list(descriptions.items())):
        ext = os.path.splitext(urlparse(file_url).path)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            continue
        subfolder = ext[1:]  # e.g., "pdf", "epub", or "mobi"
        base_name = os.path.splitext(os.path.basename(urlparse(file_url).path))[0]
        # Construct the target description file path with .txt extension.
        desc_filename = os.path.join("ebooks", subfolder, base_name + ".txt")
        try:
            with open(desc_filename, "w", encoding="utf-8") as f:
                f.write(desc)
            print(f"Wrote description to: {desc_filename}")
        except Exception as e:
            print(f"Error writing description for {file_url}: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--max-pages",
        type=int,
        default=0,
        help="Maximum number of pages to crawl (0 for unlimited)",
    )
    args = parser.parse_args()

    # Start the file downloader daemon in a separate thread.
    downloader_thread = threading.Thread(target=start_file_downloader, daemon=True)
    downloader_thread.start()

    settings = {
        "ITEM_PIPELINES": {"__main__.SitemapPipeline": 300},
        "LOG_LEVEL": "INFO",
    }
    if args.max_pages > 0:
        settings["CLOSESPIDER_PAGECOUNT"] = args.max_pages

    process = CrawlerProcess(settings=settings)
    process.crawl(SitemapSpider)
    process.start()  # Blocks until crawling is complete.

    # Signal that crawling is done.
    spider_finished_event.set()
    downloader_thread.join()

    # --- STATS CALCULATION ---
    num_urls_discovered = len(discovered_urls_set)
    pdf_downloaded = sum(1 for url in downloaded_files if url.lower().endswith(".pdf"))
    epub_downloaded = sum(
        1 for url in downloaded_files if url.lower().endswith(".epub")
    )
    mobi_downloaded = sum(
        1 for url in downloaded_files if url.lower().endswith(".mobi")
    )

    print("\n--- Execution Stats ---")
    print(f"Number of URLs discovered: {num_urls_discovered}")
    print(f"PDFs downloaded: {pdf_downloaded}")
    print(f"EPUBs downloaded: {epub_downloaded}")
    print(f"MOBIs downloaded: {mobi_downloaded}")

    # --- WRITE DESCRIPTIONS TO FILES ---
    write_descriptions_to_files()
