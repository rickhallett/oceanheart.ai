"use client";

import { useState, useEffect } from "react";

export default function MailingListForm() {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Call the lead API route
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to subscribe");
      }

      setNotification("Subscription successful!");
      setFadeOut(false);
      setEmail("");
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes("already subscribed")) {
        setNotification("Email already subscribed");
      } else {
        setNotification("Subscription failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (notification === "Subscription successful!") {
      const timer1 = setTimeout(() => setFadeOut(true), 5000);
      const timer2 = setTimeout(() => {
        setNotification("");
        setFadeOut(false);
      }, 6000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [notification]);

  return (
    <section className="bg-neutral text-neutral-content py-20 px-8 mt-12">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="font-bold text-3xl md:text-4xl mb-6">Join Our Mailing List</h2>
        <p className="mb-8">
          Stay updated with our latest news, special offers, and announcements.
        </p>
        <form className="flex justify-center flex-col items-center" onSubmit={handleSubmit}>
          <div className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary ml-2">
              Subscribe
            </button>
          </div>
          {notification && (
            <p
              className={`mt-4 text-sm transition-opacity duration-1000 ${
                fadeOut ? "opacity-0" : "opacity-100"
              }`}
            >
              {notification}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
