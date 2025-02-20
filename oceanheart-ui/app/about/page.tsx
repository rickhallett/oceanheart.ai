import Image from "next/image";
import config from "@/config";

export default function AboutPage() {
  return (
    <main className="bg-base-100">
      {/* Intro Section */}
      <section className="py-20 px-8 max-w-7xl mx-auto text-center">
        <h1 className="font-extrabold text-4xl md:text-6xl tracking-tight mb-6">
          About Me
        </h1>
        <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto mb-12">
          Welcome! I'm [Your Name], the founder behind {config.appName}. I am passionate about leveraging technology to empower therapists and transform care.
        </p>
      </section>

      {/* Profile & Story Section */}
      <section className="flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto px-8 py-16">
        <div className="md:w-1/2">
          <Image
            src="/images/profile.jpg" // <-- replace with your profile photo path
            alt="Profile picture of [Your Name]"
            width={500}
            height={500}
            className="rounded-full mx-auto"
          />
        </div>
        <div className="md:w-1/2 space-y-6">
          <article>
            <h2 className="font-bold text-2xl mb-4">My Journey</h2>
            <p className="text-base">
              [Edit this text: Describe your background, what motivated you to start your journey, and key milestones along the way.]
            </p>
          </article>
          <article>
            <h2 className="font-bold text-2xl mb-4">Our Vision</h2>
            <p className="text-base">
              [Edit this text: Explain the vision behind {config.appName} – its mission, values, and how it aims to help therapists and their clients.]
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
