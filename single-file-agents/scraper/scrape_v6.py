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

# Global variables for tracking stats.
discovered_urls_set = set()  # All URLs discovered by the spider.
# For files, we track the URLs of successfully downloaded files.
downloaded_files = set()
# Thread-safe queue and sets for files to download.
file_queue = queue.Queue()
queued_files = set()
download_lock = threading.Lock()

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
        # Always yield the URL for sitemap creation and add to global stats.
        url = response.url
        discovered_urls_set.add(url)
        yield {"url": url}

        # Check response content type before parsing.
        content_type = response.headers.get("Content-Type", b"").decode("utf-8")
        if "text/html" not in content_type:
            return

        try:
            # Extract the downloads section.
            downloads_section = response.css("section.downloads")
        except Exception as e:
            print(f"Error processing downloads section for {url}: {e}")
            return

        if downloads_section:
            # Extract all links within the downloads section.
            links = downloads_section.css("a.button::attr(href)").getall()
            for link in links:
                absolute_link = response.urljoin(link)
                ext = os.path.splitext(urlparse(absolute_link).path)[1].lower()
                if ext in ALLOWED_EXTENSIONS:
                    with download_lock:
                        if (
                            absolute_link not in downloaded_files
                            and absolute_link not in queued_files
                        ):
                            queued_files.add(absolute_link)
                            file_queue.put(absolute_link)
                            print(f"Queued {ext} file: {absolute_link}")
            # End processing downloads section.


class SitemapPipeline:
    def __init__(self):
        self.urls = set()

    def process_item(self, item, spider):
        self.urls.add(item["url"])
        return item

    def close_spider(self, spider):
        # Write the sitemap.xml using the discovered URLs.
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
            return  # Skip unsupported file types.

        # Determine the target subfolder based on the extension.
        subfolder = ext[1:]  # e.g., "pdf", "epub", "mobi"
        folder = os.path.join("ebooks", subfolder)
        os.makedirs(folder, exist_ok=True)
        filename = os.path.join(folder, os.path.basename(urlparse(url).path))

        # Check if the file already exists.
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
    semaphore = asyncio.Semaphore(5)
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
            # Exit if crawling is finished and queue is empty.
            if spider_finished_event.is_set() and file_queue.empty():
                break
            await asyncio.sleep(1)


def start_file_downloader():
    asyncio.run(file_downloader_daemon())


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

    # Compute stats after execution.
    num_urls_discovered = len(discovered_urls_set)
    pdf_downloaded = sum(1 for url in downloaded_files if url.lower().endswith(".pdf"))
    epub_downloaded = sum(
        1 for url in downloaded_files if url.lower().endswith(".epub")
    )
    mobi_downloaded = sum(
        1 for url in downloaded_files if url.lower().endswith(".mobi")
    )

    # Print stats.
    print("\n--- Execution Stats ---")
    print(f"Number of URLs discovered: {num_urls_discovered}")
    print(f"PDFs downloaded: {pdf_downloaded}")
    print(f"EPUBs downloaded: {epub_downloaded}")
    print(f"MOBIs downloaded: {mobi_downloaded}")
