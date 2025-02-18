import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`
Effective Date: February 18, 2025

1. Introduction

oceanheart.ai ("we," "our," or "us") values your privacy. This Privacy Policy explains how we collect, use, and protect your information when you visit our website (https://www.oceanheart.ai) and use our services.

2. Information We Collect

Personal Data: We collect your name, email, and payment information for order processing. Within the app, users are required to store client details under pseudonyms and remove any personally identifiable data (PID), including dates of birth and addresses. 

It is the responsibility of each user to ensure they gain appropriate levels of consent from their clients before storing their data. Clients must understand that their any and all of their data will be stored on our servers and regularly used for training our AI models, or sent to third parties for analysis, extraction and transformation.

Non-Personal Data: We use cookies to improve website functionality and user experience.

3. How We Use Your Data

We collect and use your data solely for order processing and to provide our services effectively.

4. Data Sharing

We do not share your personal data with any third parties.

5. Updates to This Privacy Policy

We may update this Privacy Policy from time to time. Users will be notified of any changes via email.

6. Contact Us

If you have any questions about this Privacy Policy, please contact us at kai@oceanheart.ai.

By using our services, you agree to the terms of this Privacy Policy.
`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
