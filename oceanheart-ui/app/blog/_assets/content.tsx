import type { JSX } from "react";
import Image, { StaticImageData } from "next/image";
import kaiImg from "@/app/blog/_assets/images/authors/blog_avatar.jpeg";
import introducingOceanheartAiImg from "@/public/blog/introducing-oceanheart-ai/header.png";
import composableAgentSystemsImg from "@/public/blog/composable-agent-systems-1/header.png";
import iterativeVerificationImg from "@/public/blog/iterative-verification/header.jpeg";
import singleFileAgentsImg from "@/public/blog/single-file-agents/header.png";
import scalableAgentSystemsImg from "@/public/blog/scaling-agent-compute/header.jpg";
// ==================================================================================================================================================================
// BLOG CATEGORIES 🏷️
// ==================================================================================================================================================================

export type categoryType = {
  slug: string;
  title: string;
  titleShort?: string;
  description: string;
  descriptionShort?: string;
};

// These slugs are used to generate pages in the /blog/category/[categoryI].js. It's a way to group articles by category.
const categorySlugs: { [key: string]: string } = {
  feature: "feature",
  tutorials: "tutorials",
  updates: "updates",
  community: "community",
  research: "research",
  ai: "ai",
  therapy: "therapy",
  psychology: "psychology",
};

// All the blog categories data display in the /blog/category/[categoryI].js pages.
export const categories: categoryType[] = [
  {
    // The slug to use in the URL, from the categorySlugs object above.
    slug: categorySlugs.feature,
    // The title to display the category title (h1), the category badge, the category filter, and more. Less than 60 characters.
    title: "New Features",
    // A short version of the title above, display in small components like badges. 1 or 2 words
    titleShort: "Features",
    // The description of the category to display in the category page. Up to 160 characters.
    description:
      "The latest features added to oceanheart.ai. I work tirelessly to bring you the latest and greatest in AI tooling.",
    // A short version of the description above, only displayed in the <Header /> on mobile. Up to 60 characters.
    descriptionShort: "Latest features added to oceanheart.ai",
  },
  {
    slug: categorySlugs.tutorials,
    title: "How Tos & Tutorials",
    titleShort: "Tutorials",
    description:
      "Learn how to use oceneaheart.ai with these step-by-step tutorials. I'll show you how to use them to create powerful, time saving, therapy enhancing workflows",
    descriptionShort:
      "Learn how to use oceanheart.ai with these step-by-step tutorials.",
  },
  {
    slug: categorySlugs.updates,
    title: "Updates",
    titleShort: "Updates",
    description:
      "Roadmap changes, feature requests, and other updates.",
    descriptionShort: "Roadmap changes, feature requests, and other updates.",
  },
  {
    slug: categorySlugs.community,
    title: "Community",
    titleShort: "Community",
    description:
      "User feedback, networking, and other community updates.",
    descriptionShort: "User feedback, networking, and other community updates.",
  },
  {
    slug: categorySlugs.research,
    title: "Research",
    titleShort: "Research",
    description:
      "Research, studies, and other relevant content.",
    descriptionShort: "Research, studies, and other relevant content.",
  },
  {
    slug: categorySlugs.ai,
    title: "AI",
    titleShort: "AI",
    description:
      "What's hot in AI?",
    descriptionShort: "What's hot in AI?",
  },
  {
    slug: categorySlugs.therapy,
    title: "Therapy",
    titleShort: "Therapy",
    description:
      "Therapy, counseling, and other relevant content.",
    descriptionShort: "Therapy, counseling, and other relevant content.",
  },
  {
    slug: categorySlugs.psychology,
    title: "Psychology",
    titleShort: "Psychology",
    description:
      "Psychology, counseling, and other relevant content.",
    descriptionShort: "Psychology, counseling, and other relevant content.",
  },
  {
    slug: categorySlugs.learning,
    title: "Learning",
    titleShort: "Learning",
    description:
      "Reflections on my learning journey with AI, psychotherapy and software engineering.",
    descriptionShort: "Reflections on my learning journey with AI, psychotherapy and software engineering.",
  },
];

// ==================================================================================================================================================================
// BLOG AUTHORS 📝
// ==================================================================================================================================================================

export type authorType = {
  slug: string;
  name: string;
  job: string;
  description: string;
  avatar: StaticImageData | string;
  socials?: {
    name: string;
    icon: JSX.Element;
    url: string;
  }[];
};

// Social icons used in the author's bio.
const socialIcons: {
  [key: string]: {
    name: string;
    svg: JSX.Element;
  };
} = {
  twitter: {
    name: "Twitter",
    svg: (
      <svg
        version="1.1"
        id="svg5"
        x="0px"
        y="0px"
        viewBox="0 0 1668.56 1221.19"
        className="w-9 h-9"
      // Using a dark theme? ->  className="w-9 h-9 fill-white"
      >
        <g id="layer1" transform="translate(52.390088,-25.058597)">
          <path
            id="path1009"
            d="M283.94,167.31l386.39,516.64L281.5,1104h87.51l340.42-367.76L984.48,1104h297.8L874.15,558.3l361.92-390.99   h-87.51l-313.51,338.7l-253.31-338.7H283.94z M412.63,231.77h136.81l604.13,807.76h-136.81L412.63,231.77z"
          />
        </g>
      </svg>
    ),
  },
  linkedin: {
    name: "LinkedIn",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        // Using a dark theme? ->  className="w-6 h-6 fill-white"
        viewBox="0 0 24 24"
      >
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
      </svg>
    ),
  },
  github: {
    name: "GitHub",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        // Using a dark theme? ->  className="w-6 h-6 fill-white"
        viewBox="0 0 24 24"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
};

// These slugs are used to generate pages in the /blog/author/[authorId].js. It's a way to show all articles from an author.
const authorSlugs: {
  [key: string]: string;
} = {
  kai: "kai",
  marc: "marc",
};

// All the blog authors data display in the /blog/author/[authorId].js pages.
export const authors: authorType[] = [
  {
    // The slug to use in the URL, from the authorSlugs object above.
    slug: authorSlugs.kai,
    // The name to display in the author's bio. Up to 60 characters.
    name: "Kai",
    // The job to display in the author's bio. Up to 60 characters.
    job: "Psychologist, engineer and founder of oceanheart.ai",
    // The description of the author to display in the author's bio. Up to 160 characters.
    description:
      "Kai has 15 years of experience in solutions-focused, mindfulness-centric psychotherapeutics. A self-taught software engineer, he has worked primarily in the big data sector, with notable roles at Brandwatch and EDITED. Seeing a growing need for psychotherapeutic tools in a rapidly evolving world, he founded oceanheart.ai to bridge the gap. When he couldn’t find a solution that met his needs, he leveraged a year of AI exploration to enhance his private practice — now extending those innovations to therapists everywhere.",
    // The avatar of the author to display in the author's bio and avatar badge. It's better to use a local image, but you can also use an external image (https://...)
    avatar: kaiImg,
    // A list of social links to display in the author's bio.
    socials: [
      {
        name: socialIcons.twitter.name,
        icon: socialIcons.twitter.svg,
        url: "https://x.com/oceanheart_ai",
      },
      {
        name: socialIcons.linkedin.name,
        icon: socialIcons.linkedin.svg,
        url: "https://www.linkedin.com/in/richardhallett86/",
      },
      {
        name: socialIcons.github.name,
        icon: socialIcons.github.svg,
        url: "https://github.com/rickhallett",
      },
    ],
  },
];

// ==================================================================================================================================================================
// BLOG ARTICLES 📚
// ==================================================================================================================================================================

export type articleType = {
  slug: string;
  title: string;
  description: string;
  categories: categoryType[];
  author: authorType;
  publishedAt: string;
  image: {
    src?: StaticImageData;
    urlRelative: string;
    alt: string;
  };
  content: JSX.Element;
};

// These styles are used in the content of the articles. When you update them, all articles will be updated.
const styles: {
  [key: string]: string;
} = {
  h2: "text-2xl lg:text-4xl font-bold tracking-tight mb-4 text-base-content",
  h3: "text-xl lg:text-2xl font-bold tracking-tight mb-2 text-base-content",
  p: "text-base-content/90 leading-relaxed",
  ul: "list-inside list-disc text-base-content/90 leading-relaxed",
  li: "list-item",
  // Altnernatively, you can use the library react-syntax-highlighter to display code snippets.
  code: "text-sm font-mono bg-neutral text-neutral-content p-6 rounded-box my-4 overflow-x-scroll select-all",
  codeInline:
    "text-sm font-mono bg-base-300 px-1 py-0.5 rounded-box select-all",
};

// All the blog articles data display in the /blog/[articleId].js pages.
export const articles: articleType[] = [
  {
    // The unique slug to use in the URL. It's also used to generate the canonical URL.
    slug: "introducing-oceanheart-ai",
    // The title to display in the article page (h1). Less than 60 characters. It's also used to generate the meta title.
    title: "Introducing oceanheart.ai",
    // The description of the article to display in the article page. Up to 160 characters. It's also used to generate the meta description.
    description:
      "oceanheart.ai is a new AI-powered therapy platform combining a unique toolset to enhance your effectiveness and efficiency as a clinician",
    // An array of categories of the article. It's used to generate the category badges, the category filter, and more.
    categories: [
      categories.find((category) => category.slug === categorySlugs.feature),
    ],
    // The author of the article. It's used to generate a link to the author's bio page.
    author: authors.find((author) => author.slug === authorSlugs.kai),
    // The date of the article. It's used to generate the meta date.
    publishedAt: "2025-02-18",
    image: {
      // The image to display in <CardArticle /> components.
      src: introducingOceanheartAiImg,
      // The relative URL of the same image to use in the Open Graph meta tags & the Schema Markup JSON-LD. It should be the same image as the src above.
      urlRelative: "/blog/introducing-oceanheart-ai/header.jpg",
      alt: "oceanheart.ai logo",
    },
    // The actual content of the article that will be shown under the <h1> title in the article page.
    content: (
      <>
        <Image
          src={introducingOceanheartAiImg}
          alt="oceanheart.ai logo"
          width={700}
          height={500}
          priority={true}
          className="rounded-box"
          placeholder="blur"
        />
        <section>
          <h2 className={styles.h2}>Introduction</h2>
          <p className={styles.p}>
            oceanheart.ai is a new AI-powered therapy platform combining a unique toolset to enhance your effectiveness and efficiency as a clinician
          </p>
        </section>

        <section>
          <h3 className={styles.h3}>1. Create an oceanheart.ai account</h3>
          <p className={styles.p}>
            First, go to{" "}
            <a href="https://oceanheart.ai/signup" className="link link-primary">
              oceanheart.ai
            </a>{" "}
            and create an account. The first 100 users will get access to release 1 for just $6/mnth, which frankly is rediculous.
            <br />
            <br />
            Take a look around and check the <a href="/blog/category/tutorials" className="link link-secondary">tutorials</a> to get started.
          </p>
        </section>

        <section>

        </section>
      </>
    ),
  },
  {
    // The unique slug to use in the URL
    slug: "composable-agent-systems-1",
    // The title to display in the article page (h1)
    title: "Composable Agent Systems: Lessons Learned",
    // The description of the article
    description:
      "Reflections on keeping overhead low and agility high when designing agent systems.",
    // Example category usage (replace with valid references if needed)
    categories: [
      categories.find((category) => category.slug === categorySlugs.learning),
    ],
    // Example author usage (replace with valid references if needed)
    author: authors.find((author) => author.slug === authorSlugs.kai),
    // Publish date
    publishedAt: "2025-02-19",
    // Image metadata
    image: {
      // Replace with a valid import or reference to your own image
      src: composableAgentSystemsImg,
      urlRelative: "/blog/composable-agent-systems-1/header.jpg",
      alt: "composable agent systems cover image",
    },
    // The article content
    content: (
      <>
        <Image
          src={composableAgentSystemsImg}
          alt="composable agent systems cover image"
          width={700}
          height={500}
          priority={true}
        />
        <h2 className={styles.h2}>Why Simple, Composable Designs Work</h2>
        <p className={styles.p}>
          Over time, I’ve noticed that the most successful agent systems often emerge from simple, composable designs rather than sprawling frameworks. Early on, I made the mistake of trying to stitch together complex chains of tools and prompts, hoping that more moving parts would give me more robust results. In practice, it just made my code harder to maintain and debug.
        </p>
        <p className={styles.p}>
          A lean, single-file approach taught me to focus on clear tool definitions, straightforward loops, and minimal overhead. Each agent can stay tightly scoped to one responsibility: for instance, handling a database query or executing a code transformation. By composing small, purpose-driven scripts, I can quickly pivot if a certain idea doesn’t pan out. That flexibility proved invaluable when deadlines were tight or when new project requirements popped up unexpectedly.
        </p>
        <p className={styles.p}>
          The essence of this approach is to provide just enough capabilities—like retrieval, memory, or step-by-step prompts—to achieve the task at hand. Without the baggage of excess tools or overly fancy frameworks, it’s easier to see where an agent adds value and where a single prompt might suffice. In short, a direct and simple structure provides clarity, reduces hidden complexity, and keeps the path from input to output transparent at every step.
        </p>
      </>
    ),
  },
  {
    // The unique slug to use in the URL
    slug: "iterative-verification",
    // The title to display in the article page (h1)
    title: "Iterative Verification in Agent Loops",
    // The description of the article
    description:
      "Reflections on adding a quick test step before final outputs to ensure accuracy and save time.",
    // Example category usage (replace with valid references if needed)
    categories: [
      categories.find((category) => category.slug === categorySlugs.learning),
    ],
    // Example author usage (replace with valid references if needed)
    author: authors.find((author) => author.slug === authorSlugs.kai),
    // Publish date
    publishedAt: "2025-02-19",
    // Image metadata
    image: {
      // Replace with a valid import or reference to your own image
      src: iterativeVerificationImg,
      urlRelative: "/blog/iterative-verification/header.jpg",
      alt: "iterative verification image",
    },
    // The article content
    content: (
      <>
        <Image
          src={iterativeVerificationImg}
          alt="iterative verification image"
          width={700}
          height={500}
          priority={true}
        />
        <h2 className={styles.h2}>Adding a Quick Test Step</h2>
        <p className={styles.p}>
          I’ve learned that giving an agent a way to test partial results before finalizing them is a game-changer. At first, I would just run a single pass—hand the model some instructions, watch it produce an outcome, and hope for the best. But inevitably, small errors crept in: malformed queries, incomplete code blocks, or confusing logic.
        </p>
        <p className={styles.p}>
          The simple fix was to add a lightweight “trial run” step in the middle of the loop. For instance, if the agent needs to craft a database query, it first attempts a test version, collects feedback about errors or table schemas, and only then produces the final query. In other words, it actively checks its own work.
        </p>
        <p className={styles.p}>
          What I found most effective is to keep the verification step as short and clear as possible. If it returns too much noise or tries to do half a dozen different checks, the original problem just gets buried. But with a focused test, the agent can refine its approach and avoid repeated dead ends. This little tweak not only tightened reliability but also cut down on wasted compute and time.
        </p>
      </>
    ),
  },
  {
    // The unique slug to use in the URL
    slug: "single-file-agents",
    // The title to display in the article page (h1)
    title: "Single-File Agent Architecture",
    // The description of the article
    description:
      "How embedding an agent’s logic, prompts, and dependencies into a single script can streamline development.",
    // Example category usage (replace with valid references if needed)
    categories: [
      categories.find((category) => category.slug === categorySlugs.feature),
    ],
    // Example author usage (replace with valid references if needed)
    author: authors.find((author) => author.slug === authorSlugs.kai),
    // Publish date
    publishedAt: "2025-02-19",
    // Image metadata
    image: {
      // Replace with a valid import or reference to your own image
      src: singleFileAgentsImg,
      urlRelative: "/blog/single-file-agents/header.jpg",
      alt: "single file agents image",
    },
    // The article content
    content: (
      <>
        <Image
          src={singleFileAgentsImg}
          alt="single file agents image"
          width={700}
          height={500}
          priority={true}
        />
        <h2 className={styles.h2}>Embracing the Single-File Approach</h2>
        <p className={styles.p}>
          Over time, I discovered that packing an entire agent—its logic, prompt handling, and dependencies—into a single script can be surprisingly powerful. Having everything in one place makes it easier to see exactly what’s happening at each step. It also means I can drop the file into a fresh environment, run it, and get immediate results without fussing over separate config files or environment mismatches.
        </p>
        <p className={styles.p}>
          To pull this off, I rely on an approach that <a href="https://docs.astral.sh/uv/guides/scripts/#declaring-script-dependencies" className="link link-primary">embeds dependencies right in the file</a> and organizes each tool through a simple interface. The tools themselves are just small functions or classes with clear parameters. Each loop of the agent is straightforward too: parse arguments, pick a tool, return the result, and repeat. It’s a no-frills way to stay transparent about what’s being called and why.
        </p>
        <p className={styles.p}>
          Going single-file helped me move faster because I could quickly clone or tweak agents for different tasks: swap out one database library for another, or replace a single prompt step without tearing apart a big codebase. It feels modular despite being self-contained. The key is to keep tools minimal, keep prompts well-scoped, and treat your main loop like a conversation with bite-sized steps. The end result is a system that’s easy to grasp, fast to iterate on, and surprisingly robust.
        </p>
        <p className={styles.p}>
          As Big Tech continues to scale up their AI tooling, every developer focusing on agentic systems faces the threat of their custom code being crushed overnight. By keeping systems modular and - more crucially - composable, we can reduce our exposure to technical risk. The uber models will provide an ever more capable orchestration layer that we can use to play our single file systems like a well-tuned orchestra.
        </p>
        <p className={styles.p}>
          Credit to <a href="https://www.anthropic.com/research/building-effective-agents" className="link link-primary">Anthropic's "Building Effective Agents"</a> for one of the clearest sources of guidance on this devilishly difficult topic.
        </p>
        <p className={styles.p}>
          Many of these reflections are built upon the contributions of <a href="https://www.youtube.com/@indydevdan" className="link link-primary">IndyDevDan</a>; a source of true signal (and sanity) in a world of hype, FUD and noise. One of the first movers in this space, he has been building with agents for years and has a wealth of knowledge to share. Rather than jumping on every new tool or framework, Dan is focused on the fundamentals of building effective agents and distilling them into a set of principles that is language, toolchain and framework agnostic. I would <span className="font-bold">strongly</span> recommend you check out his course <a
            href="https://agenticengineer.com/principled-ai-coding?ref=oceanheart.ai"
            className="link link-primary font-bold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Principled AI Coding
          </a>.

        </p>
        <p className={styles.p}>
          It's a game changer.
        </p>
      </>
    ),
  },
  {
    // The unique slug to use in the URL
    slug: "scaling-agent-compute",
    // The title to display in the article page (h1)
    title: "Scaling Agent Compute Through Multi-Step Reasoning",
    // The description of the article
    description:
      "Reflections on how multiple loops of context gathering let agents refine their output while controlling cost.",
    // Example category usage (replace with valid references if needed)
    categories: [
      categories.find((category) => category.slug === categorySlugs.feature),
    ],
    // Example author usage (replace with valid references if needed)
    author: authors.find((author) => author.slug === authorSlugs.kai),
    // Publish date
    publishedAt: "2025-02-19",
    // Image metadata
    image: {
      // Replace with a valid import or reference to your own image
      src: scalableAgentSystemsImg,
      urlRelative: "/blog/scaling-agent-compute/header.jpg",
      alt: "scaling agent compute image",
    },
    // The article content
    content: (
      <>
        <Image
          src={scalableAgentSystemsImg}
          alt="scaling agent compute image"
          width={700}
          height={500}
          priority={true}
        />
        <h2 className={styles.h2}>Reasoning Over Multiple Steps</h2>
        <p className={styles.p}>
          When I realized that chaining multiple steps of reasoning together could unlock more advanced outcomes, it changed how I thought about compute usage. Instead of a single-pass approach, I started letting the agent run through multiple loops—each one gathering new information, refining context, and deciding on the next tool to call. This multi-step pattern didn’t just give better results; it let me dial in exactly how much “thinking time” to invest.
        </p>
        <p className={styles.p}>
          By capping the number of loops, I could keep costs in check, while still allowing for deeper logic. If a problem was simple, I’d limit iterations to keep it quick. If it was complex, I’d give the agent more room to explore. On top of that, I can easily switch out the LLM model to use; whilst it is tempting to hit o1 for everything, you take a financial and performance hit. Gemini Flash 2, or it's equivalent cousins from the other mega corps is a fraction of the cost and yet still very capable for well defined tasks. This fine-grained control became invaluable, since I could balance performance against the budget for each task.
        </p>
        <p className={styles.p}>
          An added benefit was the clarity: with each step explicitly logged or stored, debugging felt more like watching a conversation unfold than sifting through an opaque black box. In the end, I found that scaling compute gradually, tied to clear intermediate steps, gave me a more intelligent system without blowing up my runtime costs. It’s a natural way to refine solutions: each extra turn in the loop can mean one more shot at getting things right.
        </p>
        <p className={styles.p}>
          Credit to <a href="https://www.youtube.com/@indydevdan" className="link link-primary">IndyDevDan</a> for laying out clear groundwork for this approach; see his Github <a href="https://github.com/disler/single-file-agents" className="link link-primary">here</a>.
        </p>
        <p className={styles.p}>
          Many of these reflections are built upon the contributions of <a href="https://www.youtube.com/@indydevdan" className="link link-primary">IndyDevDan</a>; a source of true signal (and sanity) in a world of hype, FUD and noise. One of the first movers in this space, he has been building with agents for years and has a wealth of knowledge to share. Rather than jumping on every new tool or framework, Dan is focused on the fundamentals of building effective agents and distilling them into a set of principles that is language, toolchain and framework agnostic. If you are serious about building agents and future proofing your work, I would <span className="font-bold">strongly</span> recommend you check out his course <a
            href="https://agenticengineer.com/principled-ai-coding?ref=oceanheart.ai"
            className="link link-primary font-bold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Principled AI Coding
          </a>.
        </p>
      </>
    ),
  }




];
