"use client";

import { useState, useRef } from "react";
import type { JSX } from "react";
import Image from "next/image";
import { FaBook, FaBrain, FaChartLine, FaCloud, FaFile, FaLock } from "react-icons/fa"

interface Feature {
  title: string;
  description: string;
  type?: "video" | "image" | "svg";
  path?: string;
  format?: string;
  alt?: string;
  svg?: JSX.Element;
}

const features = [
  {
    title: "AI-Powered Insights",
    description:
      "Automate note analysis, formulation, and treatment suggestions to enhance therapeutic effectiveness.",
    svg: <FaBrain />,
    type: "image",
    format: "webp",
    path: "/images/keyboard.webp"
  },
  {
    title: "Therapy Blueprint Cloud Service",
    description:
      "Long gone are the days when precious insights were lost on scraps of paper. Our cloud service ensures your therapy blueprints are safe and accessible from anywhere, so your clients can continue to grow after their final session.",
    svg: <FaCloud />,
    type: "image",
    format: "avif",
    path: "/images/noid.avif"
  },
  {
    title: "Session Documentation",
    description:
      "Effortlessly create, organize, and access session notes, treatment plans, and progress tracking. Convert recordings into notes and notes into clinical grade documents.",
    svg: <FaFile />,
    type: "image",
    format: "jpg",
    path: "/images/handshake.jpg"
  },
  {
    title: "Secure Client Management",
    description:
      "Protect client data with industry-standard encryption and secure cloud storage.",
    svg: <FaLock />,
    type: "image",
    format: "webp",
    path: "/images/phonelock.webp"
  },
  {
    title: "Progress Visualization",
    description:
      "Visualize therapeutic progress through clean, intuitive data visualizations. Share these with your clients make therapy more tangible",
    svg: <FaChartLine />,
    type: "image",
    format: "avif",
    path: "/images/mind-cloud.avif"
  },
  {
    title: "Resource Library",
    description:
      "Access and share a rich collection of therapeutic resources, exercises, and metaphors, automaticallycustomised for each individual",
    svg: <FaBook />,
    type: "image",
    format: "jpg",
    path: "/images/universe.jpg"
  },


] as Feature[];


// An SEO-friendly accordion component including the title and a description (when clicked.)
const Item = ({
  feature,
  isOpen,
  setFeatureSelected,
}: {
  index: number;
  feature: Feature;
  isOpen: boolean;
  setFeatureSelected: () => void;
}) => {
  const accordion = useRef(null);
  const { title, description, svg } = feature;

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-medium text-left md:text-lg"
        onClick={(e) => {
          e.preventDefault();
          setFeatureSelected();
        }}
        aria-expanded={isOpen}
      >
        <span className={`duration-100 ${isOpen ? "text-primary" : ""}`}>
          {svg}
        </span>
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-primary font-semibold" : ""
            }`}
        >
          <h3 className="inline">{title}</h3>
        </span>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out text-base-content-secondary overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{description}</div>
      </div>
    </li>
  );
};

// A component to display the media (video or image) of the feature. If the type is not specified, it will display an empty div.
// Video are set to autoplay for best UX.
const Media = ({ feature }: { feature: Feature }) => {
  const { type, path, format, alt } = feature;
  const style = "rounded-2xl aspect-square w-full sm:w-[26rem]";
  const size = {
    width: 500,
    height: 500,
  };

  if (type === "video") {
    return (
      <video
        className={style}
        autoPlay
        muted
        loop
        playsInline
        controls
        width={size.width}
        height={size.height}
      >
        <source src={path} type={format} />
      </video>
    );
  } else if (type === "image") {
    return (
      <Image
        src={path}
        alt={alt}
        className={`${style} object-cover object-center`}
        width={size.width}
        height={size.height}
      />
    );
  } else if (type === "svg") {
    return <div className={`${style} !border-none`}><FaBrain /></div>;
  } else {
    return <div className={`${style} !border-none`}></div>;
  }
};

// A component to display 2 to 5 features in an accordion.
// By default, the first feature is selected. When a feature is clicked, the others are closed.
const FeaturesAccordion = () => {
  const [featureSelected, setFeatureSelected] = useState<number>(0);

  return (
    <section
      className="py-24 md:py-32 space-y-24 md:space-y-32 max-w-7xl mx-auto bg-base-100 "
      id="features"
    >
      <div className="px-8">
        <h2 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-12 md:mb-24">
          Using the technology of <span className="text-blue-400">tomorrow</span> to give
          <span className="bg-neutral text-neutral-content px-2 md:px-4 ml-1 md:ml-1.5 leading-relaxed">
            you back your time <span className="text-blue-400">today</span>
          </span>
        </h2>
        <div className=" flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="grid grid-cols-1 items-stretch gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
            <ul className="w-full">
              {features.map((feature, i) => (
                <Item
                  key={feature.title}
                  index={i}
                  feature={feature}
                  isOpen={featureSelected === i}
                  setFeatureSelected={() => setFeatureSelected(i)}
                />
              ))}
            </ul>

            <Media feature={features[featureSelected]} key={featureSelected} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesAccordion;
