"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, viewport } from "./motion";

const capabilities = [
  {
    title: "Drag-and-drop uploads",
    copy: "Drop in as many files as you like and watch a live queue track every upload, resumable if your connection drops.",
  },
  {
    title: "Password-protected links",
    copy: "Lock any share link with a password so only the person you sent it to can open it.",
  },
  {
    title: "Direct email delivery",
    copy: "Send a file straight to an inbox. No downloading, attaching, and re-uploading somewhere else.",
  },
  {
    title: "Storage insights",
    copy: "A clear breakdown of what's using space, by file type, always visible on your dashboard.",
  },
  {
    title: "Favorites & quick filters",
    copy: "Star what matters and jump straight to Documents, Images, Design, Audio, or Video.",
  },
  {
    title: "Works on any screen",
    copy: "The same fast, legible dashboard on a phone, a tablet, or a widescreen monitor.",
  },
];

function Features() {
  return (
    <section id="features" className="bg-[#111827] py-24 sm:py-32">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="max-w-lg"
        >
          <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#5056FD]">
            The essentials
          </span>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight text-white sm:text-5xl">
            Built for how you
            <br />
            actually work.
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-16 divide-y divide-white/10 border-t border-white/10"
        >
          {capabilities.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              variants={fadeUp}
              className="group grid grid-cols-1 gap-3 py-7 transition-colors sm:grid-cols-[5rem_1fr_1fr] sm:items-baseline sm:gap-8"
            >
              <span className="font-serif text-lg text-white/25 transition-colors group-hover:text-[#5056FD]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg md:text-xl font-medium text-white transition-transform group-hover:translate-x-1">
                {item.title}
              </h3>
              <p className="text-sm md:text-[15px] leading-relaxed text-gray-400">
                {item.copy}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;
