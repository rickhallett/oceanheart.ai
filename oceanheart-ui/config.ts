import themes from "daisyui/src/theming/themes";
import { ConfigProps } from "./types/config";

const config = {
  // REQUIRED
  appName: "oceanheart.ai",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription: "Welcome to Therapy 2.0",
  // REQUIRED (no https://, not trailing slash at the end, just the naked domain)
  domainName: "oceanheart.ai",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1QtHiIRVLr5O3VREAZkhQyuH"
            : "price_1Qu12HRVLr5O3VRE4uM5HmP6",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "First Movers",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Enhance your clinical practice with AI",
        // The price you want to display, the one user will be charged on Stripe.
        price: 8,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: 14,
        features: [
          { name: "Smart session note analysis & formatting" },
          { name: "Intelligent Resource Library" },
          { name: "Automated Research Tools" },
          { name: "Data Privacy and Security" },
          // { name: "Bolt on additional modules individually for $59" }
        ],
        isFeatured: true,
        availableFrom: "2025-03-31",
        limitedTo: 100,
        remaining: 93,
      },
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Niyy5AxyNprDp7iZIqEyD2h"
            : "price_456",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Power Users",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "More knowledge, more power",
        // The price you want to display, the one user will be charged on Stripe.
        price: 24,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        // priceAnchor: 499,
        features: [
          { name: "All First Movers features" },
          { name: "AI Formulation Builder" },
          { name: "Patient Education Resources" },
          { name: "Secure Client Portal" },
          { name: "Analytics and Reporting" },
          { name: "Discord Community Access" },
          // { name: "Bolt on additional modules individually for $49" }
        ],
        availableFrom: "2025-05-31",
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw"
            : "price_456",
        name: "Edge Psychotherapy",
        description: "Becoming limitless",
        price: 39,
        // priceAnchor: 999,
        features: [
          { name: "All Power Users features" },
          { name: "Thera - Your personalised assistant" },
          { name: "Advanced Analytics and Reporting" },
          { name: "Automated spectrum psychometrics" },
          { name: "Homework monitoring" },
          { name: "Whiteboard & Shared Workspaces" },
          { name: "Therapy Blueprint Cloud Service" },
          { name: "Priority Support" },
          // { name: "Bolt on additional modules individually for $29" }
        ],
        availableFrom: "2025-11-30",
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `oceanheart <noreply@oceanheart.ai>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    // fromAdmin: `Kai at oceanheart <kai@oceanheart.ai>`,
    fromAdmin: `updates@oceanheart.ai`,
    // Email shown to customer if they need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "kai@oceanheart.ai",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you use any theme other than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "cyberpunk",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: themes["light"]["primary"],
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/signin",
    // REQUIRED — the path you want to redirect users to after a successful login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
} as ConfigProps;

export default config;
