import Image from "next/image";
import config from "@/config";

export default function AboutPage() {
  return (
    <main className="bg-base-100">
      {/* Intro Section */}
      <section className="pt-20 px-8 max-w-7xl mx-auto text-center">
        <h1 className="font-extrabold text-4xl md:text-6xl tracking-tight mb-6">
          About Me
        </h1>
        <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto mb-0 md:mb-12">
          Welcome! I'm <a className="underline text-primary" href="https://www.linkedin.com/in/richardhallett86/" target="_blank" rel="noopener noreferrer">Richard (Kai)</a>, the founder behind {config.appName}. I am passionate about leveraging technology to empower therapists and transform care.
        </p>
      </section>

      {/* Profile & Story Section */}
      <section className="flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto px-8 py-16">
        <div className="md:w-1/2">
          <Image
            src="/images/about_me_profile_2.jpeg"
            alt="Profile picture of Richard (Kai)"
            width={400}
            height={400}
            className="rounded-full mx-auto"
          />
        </div>
        <div className="md:w-1/2 space-y-6">
          <article>
            <h2 className="font-bold text-2xl mb-4">My Journey</h2>
            <p className="text-base">
              I'm a psychologist and software engineer with a passion for building tools that help people. I've always been interested in the intersection of technology and psychology, and I'm excited to see how AI can transform the way we approach mental health.
            </p>
            <br />
            <p className="text-base">
              Find out more about me <a className="underline text-primary" href="https://www.oceanheart.online/about" target="_blank" rel="noopener noreferrer">here</a>.
            </p>
          </article>
          <article>
            <h2 className="font-bold text-2xl mb-4">Our Vision</h2>
            <p className="text-base">
              I've worked in the mental health space for 15 years, so I've seen firsthand the challenges that therapists face.
            </p>
            <br />
            <p className="text-base">
              I've been thoroughly nerding out on AI tools for a while in my own practice - I am continually amazed by what is possible and I want make it easier for both therapists and their clients to experience the difference.
            </p>
          </article>
          <article>
            <h2 className="font-bold text-2xl mb-4">Private Consulting</h2>
            <p className="text-base">
              I offer private consulting services to therapists and their teams. Want help with AI tools? Good chance I have used it. I've got you covered. Don't waste time reinventing the wheel or figuring things out from the ground up.
            </p>
            <br />
            <p className="text-base">
              I specialise in Acceptance and Commitment Therapy (ACT); if you are looking for something different to CBT, <a className="underline text-primary" href="https://www.oceanheart.online/pricing" target="_blank" rel="noopener noreferrer">I'm here to help</a>.
            </p>
          </article>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-neutral text-neutral-content py-20 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-bold text-3xl md:text-4xl mb-6">Get in Touch</h2>
          <p className="mb-8">
            Have questions or want to collaborate? Reach out via email or follow me on social media.
          </p>
          <a href="mailto:kai@oceanheart.ai" className="btn btn-primary btn-wide">
            Contact Me
          </a>
        </div>
      </section>
    </main>
  );
}
