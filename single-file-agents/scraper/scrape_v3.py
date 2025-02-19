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

# Thread-safe queue and sets to track PDF URLs.
pdf_queue = queue.Queue()
queued_pdfs = set()
downloaded_pdfs = set()
download_lock = threading.Lock()

# Event to signal that crawling is complete.
spider_finished_event = threading.Event()


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
        # Always yield the URL for sitemap creation.
        yield {"url": response.url}

        # --- CHANGE 1: Check response content type before parsing ---
        # Many binary files (like PDFs or e-book formats) may have a content type that
        # is not text/html. Even if the header says text/html, the content might still
        # be non-text. Therefore, we wrap the CSS parsing in a try/except block.
        content_type = response.headers.get("Content-Type", b"").decode("utf-8")
        if "text/html" not in content_type:
            # Skip non-HTML responses.
            return

        try:
            # Attempt to extract the downloads section.
            downloads_section = response.css("section.downloads")
        except Exception as e:
            # If the response cannot be parsed as text (despite header claims), log and skip.
            print(f"Error processing downloads section for {response.url}: {e}")
            return

        # --- CHANGE 2: Only process pages that have the downloads section ---
        if downloads_section:
            # Extract all links within the downloads section.
            links = downloads_section.css("a.button::attr(href)").getall()
            for link in links:
                # Check if the link points to a PDF.
                if ".pdf" in link.lower():
                    absolute_link = response.urljoin(link)
                    with download_lock:
                        # Avoid re-queuing duplicates.
                        if (
                            absolute_link not in downloaded_pdfs
                            and absolute_link not in queued_pdfs
                        ):
                            queued_pdfs.add(absolute_link)
                            pdf_queue.put(absolute_link)
                            print(f"Queued PDF: {absolute_link}")
                    # Process only one PDF link per downloads section.
                    break


class SitemapPipeline:
    def __init__(self):
        self.urls = set()

    def process_item(self, item, spider):
        self.urls.add(item["url"])
        return item

    def close_spider(self, spider):
        # Build and write the sitemap.xml file.
        urlset = ET.Element(
            "urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        )
        for url in sorted(self.urls):
            url_el = ET.SubElement(urlset, "url")
            loc = ET.SubElement(url_el, "loc")
            loc.text = url
        tree = ET.ElementTree(urlset)
        tree.write("sitemap.xml", encoding="utf-8", xml_declaration=True)


async def download_pdf(url, session, semaphore):
    # Download a single PDF using a semaphore to limit concurrency.
    async with semaphore:
        try:
            async with session.get(url) as response:
                if response.status == 200:
                    pdf_data = await response.read()
                    os.makedirs("ebooks", exist_ok=True)
                    filename = os.path.join(
                        "ebooks", os.path.basename(urlparse(url).path)
                    )
                    with open(filename, "wb") as f:
                        f.write(pdf_data)
                    print(f"Downloaded PDF: {url}")
                    with download_lock:
                        downloaded_pdfs.add(url)
                else:
                    print(f"Failed to download {url}: status {response.status}")
        except Exception as e:
            print(f"Error downloading {url}: {e}")


async def pdf_downloader_daemon():
    # Asynchronous daemon to download PDFs in batches of 5.
    semaphore = asyncio.Semaphore(5)
    async with aiohttp.ClientSession() as session:
        while True:
            tasks = []
            # Drain current items from the pdf_queue.
            while True:
                try:
                    url = pdf_queue.get_nowait()
                    tasks.append(
                        asyncio.create_task(download_pdf(url, session, semaphore))
                    )
                except queue.Empty:
                    break
            if tasks:
                await asyncio.gather(*tasks)
            # Exit loop if crawling is finished and queue is empty.
            if spider_finished_event.is_set() and pdf_queue.empty():
                break
            await asyncio.sleep(1)


def start_pdf_downloader():
    asyncio.run(pdf_downloader_daemon())


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--max-pages",
        type=int,
        default=0,
        help="Maximum number of pages to crawl (0 for unlimited)",
    )
    args = parser.parse_args()

    # Start the PDF downloader in a separate daemon thread.
    downloader_thread = threading.Thread(target=start_pdf_downloader, daemon=True)
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

    # Signal the downloader that no new PDFs will be queued.
    spider_finished_event.set()
    downloader_thread.join()
