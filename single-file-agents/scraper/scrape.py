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

# Thread‐safe queue and sets to track PDF URLs.
pdf_queue = queue.Queue()
queued_pdfs = set()
downloaded_pdfs = set()
download_lock = threading.Lock()

# Event to signal that crawling is complete.
spider_finished_event = threading.Event()


class SitemapSpider(CrawlSpider):
    name = "sitemap_spider"
    allowed_domains = ["globalgreyebooks.com"]  # Change to target domain.
    start_urls = ["https://www.globalgreyebooks.com"]  # Change to target URL.

    rules = (
        Rule(
            LinkExtractor(allow_domains=allowed_domains),
            callback="parse_item",
            follow=True,
        ),
    )

    def parse_item(self, response):
        # Yield sitemap item.
        yield {"url": response.url}

        # If the page has the downloads section, extract PDF link.
        downloads_section = response.css("section.downloads")
        if downloads_section:
            links = downloads_section.css("a.button::attr(href)").getall()
            for link in links:
                # Check that the link appears to be a PDF.
                if ".pdf" in link.lower():
                    absolute_link = response.urljoin(link)
                    with download_lock:
                        if (
                            absolute_link not in downloaded_pdfs
                            and absolute_link not in queued_pdfs
                        ):
                            queued_pdfs.add(absolute_link)
                            pdf_queue.put(absolute_link)
                            print(f"Queued PDF: {absolute_link}")
                    break  # Only queue one PDF per downloads section.


class SitemapPipeline:
    def __init__(self):
        self.urls = set()

    def process_item(self, item, spider):
        self.urls.add(item["url"])
        return item

    def close_spider(self, spider):
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
    semaphore = asyncio.Semaphore(5)
    async with aiohttp.ClientSession() as session:
        while True:
            tasks = []
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

    # Start PDF downloader in a separate daemon thread.
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

    spider_finished_event.set()  # Signal the downloader that no new PDFs will be queued.
    downloader_thread.join()
