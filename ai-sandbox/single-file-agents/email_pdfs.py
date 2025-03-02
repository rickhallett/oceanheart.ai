#!/usr/bin/env python3
"""
PDF Email Sender

This script scans a specified directory for PDF files and emails them to a specified
email address. It provides console reporting and comprehensive error handling.

re_a2MtJxLD_GZBWRqQCHthFSRGfQ6V1DktD
"""

"""
import os
import resend

resend.api_key = os.environ["RESEND_API_KEY"]

params: resend.Emails.SendParams = {
    "from": "Acme <onboarding@resend.dev>",
    "to": ["delivered@resend.dev"],
    "subject": "hello world",
    "html": "<strong>it works!</strong>",
}

email = resend.Emails.send(params)
print(email)
"""

import os
import sys
import argparse
import logging
import smtplib
import time
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import List, Optional, Tuple


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


class PDFEmailer:
    """Class to handle finding and emailing PDF files."""

    def __init__(
        self,
        pdf_dir: str,
        recipient_email: str,
        sender_email: str,
        smtp_server: str,
        smtp_port: int = 587,
        username: Optional[str] = None,
        password: Optional[str] = None,
        use_tls: bool = True,
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
            smtp_server: SMTP server address
            smtp_port: SMTP server port (default: 587)
            username: SMTP username (default: None, uses sender_email if not provided)
            password: SMTP password (default: None)
            use_tls: Whether to use TLS (default: True)
            subject_prefix: Prefix for email subject lines (default: "PDF Document: ")
            batch_size: Number of emails to send in a batch before pausing (default: 5)
            delay_between_batches: Seconds to wait between batches (default: 30)
        """
        self.pdf_dir = Path(pdf_dir)
        self.recipient_email = recipient_email
        self.sender_email = sender_email
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.username = username or sender_email
        self.password = password
        self.use_tls = use_tls
        self.subject_prefix = subject_prefix
        self.batch_size = batch_size
        self.delay_between_batches = delay_between_batches

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

    def create_email_message(self, pdf_path: Path) -> MIMEMultipart:
        """
        Create an email message with the PDF attached.

        Args:
            pdf_path: Path to the PDF file

        Returns:
            Email message with PDF attached
        """
        # Create message container
        message = MIMEMultipart()
        message["From"] = self.sender_email
        message["To"] = self.recipient_email
        message["Subject"] = f"{self.subject_prefix}{pdf_path.name}"

        # Add body text
        body = f"Please find attached the PDF document: {pdf_path.name}"
        message.attach(MIMEText(body, "plain"))

        # Attach the PDF
        try:
            with open(pdf_path, "rb") as attachment:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(attachment.read())

            # Encode file in ASCII characters to send by email
            encoders.encode_base64(part)

            # Add header as key/value pair to attachment part
            part.add_header(
                "Content-Disposition",
                f"attachment; filename= {pdf_path.name}",
            )

            # Attach the attachment to the message
            message.attach(part)
            return message
        except Exception as e:
            logger.error(f"Error creating email for {pdf_path.name}: {str(e)}")
            raise

    def send_email(self, message: MIMEMultipart) -> bool:
        """
        Send an email message.

        Args:
            message: Email message to send

        Returns:
            True if successful, False otherwise
        """
        try:
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                if self.use_tls:
                    server.starttls()

                if self.password:
                    server.login(self.username, self.password)

                server.send_message(message)
                return True
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
                message = self.create_email_message(pdf_path)
                if self.send_email(message):
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
    parser = argparse.ArgumentParser(description="Email PDF files from a directory")

    parser.add_argument("pdf_dir", help="Directory containing PDF files")
    parser.add_argument("recipient_email", help="Email address to send PDFs to")
    parser.add_argument(
        "--sender-email", required=True, help="Email address to send from"
    )
    parser.add_argument(
        "--smtp-server",
        required=True,
        default="smtp.resend.com",
        help="SMTP server address",
    )
    parser.add_argument(
        "--smtp-port", type=int, default=465, help="SMTP server port (default: 465)"
    )
    parser.add_argument(
        "--username", default="resend", help="SMTP username (default: resend)"
    )
    parser.add_argument("--password", help="SMTP password")
    parser.add_argument("--no-tls", action="store_true", help="Disable TLS")
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
            smtp_server=args.smtp_server,
            smtp_port=args.smtp_port,
            username=args.username,
            password=args.password,
            use_tls=not args.no_tls,
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
