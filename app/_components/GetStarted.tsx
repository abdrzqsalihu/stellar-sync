"use client";

import { motion } from "framer-motion";
import { FileText, ImageIcon, Shapes, AudioLines, Film } from "lucide-react";
import { fadeUp, stagger, viewport } from "./motion";
import ChapterMark from "./ChapterMark";

const categories = [
  { label: "Documents", count: 128, Icon: FileText, bg: "#5056FD" },
  { label: "Images", count: 342, Icon: ImageIcon, bg: "#4ECDC4" },
  { label: "Design files", count: 46, Icon: Shapes, bg: "#f97316" },
  { label: "Audio", count: 19, Icon: AudioLines, bg: "#eab308" },
  { label: "Video", count: 27, Icon: Film, bg: "#a855f7" },
];

function GetStarted() {
  return (
    <section id="organize" className="bg-[#FBFAF7] py-24 sm:py-32">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <ChapterMark index={1} label="Organize" />
          <h2 className="font-serif text-4xl leading-[1.1] tracking-tight text-[#111827] sm:text-5xl">
            Everything finds its place.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-500">
            No folders to build, no rules to configure. Every upload is
            sorted by type the moment it lands, so your library stays
            legible whether you have ten files or ten thousand.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="space-y-2.5"
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              custom={i}
              variants={fadeUp}
              whileHover={{ x: 6 }}
              className="flex items-center gap-4 rounded-2xl border border-black/[0.05] bg-white p-4 shadow-[0_1px_2px_rgba(17,24,39,0.04)] transition-colors hover:border-[#5056FD]/25 hover:bg-[#5056FD]/[0.025]"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${cat.bg}1A` }}
              >
                <cat.Icon className="h-5 w-5" style={{ color: cat.bg }} strokeWidth={1.75} />
              </div>
              <span className="flex-1 text-[15px] font-medium text-[#111827]">
                {cat.label}
              </span>
              <span className="text-sm text-gray-400">{cat.count} files</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default GetStarted;
