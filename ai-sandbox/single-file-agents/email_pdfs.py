#!/usr/bin/env python3
"""
PDF Email Sender

This script scans a specified directory for PDF files and emails them to a specified
email address using the Resend API. It provides console reporting and comprehensive error handling.

re_a2MtJxLD_GZBWRqQCHthFSRGfQ6V1DktD
"""

import os
import sys
import argparse
import logging
import time
import base64
import resend
from pathlib import Path
from typing import List, Optional, Tuple, Dict, Any


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


class PDFEmailer:
    """Class to handle finding and emailing PDF files using Resend API."""

    def __init__(
        self,
        pdf_dir: str,
        recipient_email: str,
        sender_email: str,
        api_key: Optional[str] = None,
        subject_prefix: str = "PDF Document: ",
        batch_size: int = 5,
        delay_between_batches: int = 30,
    ):
        """
        Initialize the PDF emailer.

        Args:
            pdf_dir: Directory containing PDF files
            recipient_email: Email address to send PDFs to
            sender_email: Email address to send from
            api_key: Resend API key (default: None, uses RESEND_API_KEY env var if not provided)
            subject_prefix: Prefix for email subject lines (default: "PDF Document: ")
            batch_size: Number of emails to send in a batch before pausing (default: 5)
            delay_between_batches: Seconds to wait between batches (default: 30)
        """
        self.pdf_dir = Path(pdf_dir)
        self.recipient_email = recipient_email
        self.sender_email = sender_email
        self.subject_prefix = subject_prefix
        self.batch_size = batch_size
        self.delay_between_batches = delay_between_batches
        
        # Set up Resend API
        resend.api_key = api_key or os.environ.get("RESEND_API_KEY")
        if not resend.api_key:
            raise ValueError("Resend API key is required. Set RESEND_API_KEY environment variable or pass api_key parameter.")

        # Validate the PDF directory
        if not self.pdf_dir.exists():
            raise FileNotFoundError(f"Directory not found: {pdf_dir}")
        if not self.pdf_dir.is_dir():
            raise NotADirectoryError(f"Not a directory: {pdf_dir}")

    def find_pdf_files(self) -> List[Path]:
        """
        Find all PDF files in the specified directory.

        Returns:
            List of Path objects for PDF files
        """
        logger.info(f"Searching for PDF files in {self.pdf_dir}")
        pdf_files = list(self.pdf_dir.glob("**/*.pdf"))

        if not pdf_files:
            logger.warning(f"No PDF files found in {self.pdf_dir}")
        else:
            logger.info(f"Found {len(pdf_files)} PDF files")

        return pdf_files

    def create_email_params(self, pdf_path: Path) -> Dict[str, Any]:
        """
        Create email parameters for Resend API with the PDF attached.

        Args:
            pdf_path: Path to the PDF file

        Returns:
            Dictionary of email parameters for Resend API
        """
        try:
            # Read the PDF file and encode it as base64
            with open(pdf_path, "rb") as file:
                pdf_content = file.read()
                pdf_base64 = base64.b64encode(pdf_content).decode("utf-8")

            # Create email parameters
            params = {
                "from": self.sender_email,
                "to": [self.recipient_email],
                "subject": f"{self.subject_prefix}{pdf_path.name}",
                "html": f"<p>Please find attached the PDF document: {pdf_path.name}</p>",
                "attachments": [
                    {
                        "filename": pdf_path.name,
                        "content": pdf_base64,
                        "content_type": "application/pdf",
                    }
                ],
            }
            return params
        except Exception as e:
            logger.error(f"Error creating email for {pdf_path.name}: {str(e)}")
            raise

    def send_email(self, params: Dict[str, Any]) -> bool:
        """
        Send an email using Resend API.

        Args:
            params: Email parameters for Resend API

        Returns:
            True if successful, False otherwise
        """
        try:
            response = resend.Emails.send(params)
            if response and "id" in response:
                logger.debug(f"Email sent successfully with ID: {response['id']}")
                return True
            else:
                logger.error(f"Failed to send email: {response}")
                return False
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return False

    def process_pdfs(self) -> Tuple[int, int]:
        """
        Process all PDF files in the directory.

        Returns:
            Tuple of (success_count, failure_count)
        """
        pdf_files = self.find_pdf_files()
        if not pdf_files:
            return 0, 0

        success_count = 0
        failure_count = 0

        logger.info(f"Starting to process {len(pdf_files)} PDF files")

        for i, pdf_path in enumerate(pdf_files, 1):
            try:
                logger.info(f"Processing file {i}/{len(pdf_files)}: {pdf_path.name}")

                # Create and send the email
                params = self.create_email_params(pdf_path)
                if self.send_email(params):
                    logger.info(f"Successfully sent email with {pdf_path.name}")
                    success_count += 1
                else:
                    logger.error(f"Failed to send email with {pdf_path.name}")
                    failure_count += 1

                # Pause between batches to avoid triggering spam filters
                if i % self.batch_size == 0 and i < len(pdf_files):
                    logger.info(
                        f"Pausing for {self.delay_between_batches} seconds after sending {self.batch_size} emails"
                    )
                    time.sleep(self.delay_between_batches)

            except Exception as e:
                logger.error(f"Error processing {pdf_path.name}: {str(e)}")
                failure_count += 1

        return success_count, failure_count


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Email PDF files from a directory using Resend API")

    parser.add_argument("pdf_dir", help="Directory containing PDF files")
    parser.add_argument("recipient_email", help="Email address to send PDFs to")
    parser.add_argument(
        "--sender-email", required=True, help="Email address to send from"
    )
    parser.add_argument(
        "--api-key", help="Resend API key (defaults to RESEND_API_KEY environment variable)"
    )
    parser.add_argument(
        "--subject-prefix",
        default="PDF Document: ",
        help="Prefix for email subject lines",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=5,
        help="Number of emails to send before pausing",
    )
    parser.add_argument(
        "--delay", type=int, default=30, help="Seconds to wait between batches"
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true", help="Enable verbose logging"
    )

    return parser.parse_args()


def main():
    """Main entry point for the script."""
    args = parse_arguments()

    # Set logging level based on verbose flag
    if args.verbose:
        logger.setLevel(logging.DEBUG)

    try:
        # Create and run the PDF emailer
        emailer = PDFEmailer(
            pdf_dir=args.pdf_dir,
            recipient_email=args.recipient_email,
            sender_email=args.sender_email,
            api_key=args.api_key,
            subject_prefix=args.subject_prefix,
            batch_size=args.batch_size,
            delay_between_batches=args.delay,
        )

        # Process the PDFs
        success_count, failure_count = emailer.process_pdfs()

        # Report results
        total = success_count + failure_count
        if total > 0:
            success_rate = (success_count / total) * 100
            logger.info(f"Completed processing {total} PDF files")
            logger.info(f"Success: {success_count} ({success_rate:.1f}%)")
            logger.info(f"Failures: {failure_count}")

            if failure_count > 0:
                sys.exit(1)
        else:
            logger.info("No PDF files were processed")

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
