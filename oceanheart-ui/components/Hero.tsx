import Image from "next/image";
import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        {/* <a
          href="https://www.producthunt.com/posts/shipfast-2?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-shipfast&#0045;2"
          target="_blank"
          className=" -mb-4 md:-mb-6 group"
          title="Product Hunt link"
        >
          <img src="/Transparent Logo.png" alt="Logo" className="w-32 md:w-36 fill-base-content/80 group-hover:fill-base-content" />
        </a> */}

        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4">
          Welcome to therapy <span className="text-blue-400">2.0</span>
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          oceanheart.ai helps therapists do more of what they love most: <span className="italic text-blue-400">helping people</span>
        </p>
        <button className="btn btn-primary btn-wide">
          Get <span className="lowercase">{config.appName}</span>
        </button>

        <TestimonialsAvatars />
      </div>
      <div className="lg:w-3/4">
        <Image
          src="/images/Transparent Logo.png"
          alt="Product Demo"
          className="w-full"
          priority={true}
          width={150}
          height={150}
        />
      </div>
    </section>
  );
};

export default Hero;
