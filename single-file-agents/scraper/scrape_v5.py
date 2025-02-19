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

# --- RENAMED GLOBALS ---
# Use generic names since we now handle multiple file types.
file_queue = queue.Queue()
queued_files = set()
downloaded_files = set()
download_lock = threading.Lock()

# Event to signal that crawling is complete.
spider_finished_event = threading.Event()

# Allowed file extensions
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
        # Yield URL for sitemap.xml creation.
        yield {"url": response.url}

        # Check Content-Type before processing; skip non-HTML responses.
        content_type = response.headers.get("Content-Type", b"").decode("utf-8")
        if "text/html" not in content_type:
            return

        try:
            # Attempt to locate the downloads section.
            downloads_section = response.css("section.downloads")
        except Exception as e:
            print(f"Error processing downloads section for {response.url}: {e}")
            return

        if downloads_section:
            # Extract all links with the 'a.button' selector.
            links = downloads_section.css("a.button::attr(href)").getall()
            for link in links:
                # Resolve the absolute URL.
                absolute_link = response.urljoin(link)
                # Extract the file extension from the URL.
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
            # End of processing downloads_section


class SitemapPipeline:
    def __init__(self):
        self.urls = set()

    def process_item(self, item, spider):
        self.urls.add(item["url"])
        return item

    def close_spider(self, spider):
        # Create sitemap.xml from the collected URLs.
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
        # Determine the file extension.
        ext = os.path.splitext(urlparse(url).path)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            return  # Skip unsupported file types.

        # Determine the subfolder based on the extension.
        subfolder = ext[1:]  # e.g., "pdf", "epub", "mobi"
        folder = os.path.join("ebooks", subfolder)
        os.makedirs(folder, exist_ok=True)
        filename = os.path.join(folder, os.path.basename(urlparse(url).path))

        # --- NEW CHECK: Verify file existence in the target directory ---
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
    # Semaphore limits concurrent downloads to 5.
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
            await asyncio.sleep(1)  # Wait before checking again.


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
