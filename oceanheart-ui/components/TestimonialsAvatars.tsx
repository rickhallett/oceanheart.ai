import { ReactNode } from "react";
import { FaRegFaceGrin } from "react-icons/fa6";
import { FaRegFaceGrinBeam } from "react-icons/fa6";
import { FaRegFaceGrinHearts } from "react-icons/fa6";
import { FaRegFaceGrinStars } from "react-icons/fa6";
import { FaRegFaceGrinWide } from "react-icons/fa6";
import { FaRegFaceSmile } from "react-icons/fa6";
import { FaRegFaceGrinSquintTears } from "react-icons/fa6";

const avatars: {
  icon: ReactNode;
}[] = [
    {
      icon: <FaRegFaceGrin />
    },
    {
      icon: <FaRegFaceGrinBeam />
    },
    {
      icon: <FaRegFaceGrinHearts />
    },
    {
      icon: <FaRegFaceGrinStars />
    },
    {
      icon: <FaRegFaceGrinWide />
    },
    {
      icon: <FaRegFaceSmile />
    },
    {
      icon: <FaRegFaceGrinSquintTears />
    },
  ];

const testimonials = new Array(12).fill(true);
const getRandomAvatar = () => {
  return avatars[Math.floor(Math.random() * avatars.length)];
};

const TestimonialsAvatars = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-3">
      {/* TESTIMONIALS */}
      <div className={`flex justify-start flex-wrap max-w-32`}>
        {testimonials.map((_, i) => (
          <div className="w-5 h-5 hover:scale-110 hover:text-secondary transition-all duration-300" key={i}>
            <a href="https://uk.trustpilot.com/review/richardhallett.net" target="_blank" rel="noopener noreferrer">
              {getRandomAvatar().icon}
            </a>
          </div>
        ))}
      </div>

      {/* RATING */}
      <div className="flex flex-col justify-center items-center md:items-start gap-1">
        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-yellow-500"
              key={i}
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
          ))}
        </div>

        <div className="text-base text-base-content/80">
          <span className="font-semibold text-base-content">
            {testimonials.length}
          </span>{" "}
          happy people{" "}
          <a
            href="https://uk.trustpilot.com/review/richardhallett.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-content underline"
          >
            have used oceanheart.ai
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsAvatars;
