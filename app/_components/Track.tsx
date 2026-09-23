"use client";

import { motion } from "framer-motion";
import { fadeUp, viewport } from "./motion";
import ChapterMark from "./ChapterMark";

const breakdown = [
  { label: "Documents", value: 38, color: "#5056FD" },
  { label: "Images", value: 29, color: "#22c55e" },
  { label: "Videos", value: 22, color: "#eab308" },
  { label: "Other", value: 11, color: "#6b7280" },
];

function Track() {
  return (
    <section id="track" className="bg-[#FBFAF7] py-24 sm:py-32">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <ChapterMark index={3} label="Track" />
          <h2 className="font-serif text-4xl leading-[1.1] tracking-tight text-[#111827] sm:text-5xl">
            Know exactly
            <br />
            what&apos;s where.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-500">
            A clear read on your storage, broken down by file type, not
            buried in a settings page, so you always know what&apos;s
            taking up space before you run out of it.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          custom={1}
          className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_20px_40px_-20px_rgba(17,24,39,0.14)]"
        >
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-[#111827]">
              Storage used
            </span>
            <span className="text-sm text-gray-400">2.4 GB of 10 GB</span>
          </div>

          <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-black/[0.05]">
            {breakdown.map((seg, i) => (
              <motion.div
                key={seg.label}
                initial={{ width: 0 }}
                whileInView={{ width: `${seg.value}%` }}
                viewport={viewport}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{ backgroundColor: seg.color }}
              />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
            {breakdown.map((seg) => (
              <div key={seg.label} className="flex items-center gap-2 text-sm">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-gray-500">{seg.label}</span>
                <span className="ml-auto font-medium text-[#111827]">
                  {seg.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Track;
