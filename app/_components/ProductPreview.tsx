"use client";

import { motion } from "framer-motion";
import {
  FileText,
  ImageIcon,
  Video,
  Home,
  Files,
  Share2,
  HardDrive,
  Link as LinkIcon,
} from "lucide-react";
import { stagger, viewport } from "./motion";

const rows = [
  {
    name: "brand-guidelines.pdf",
    size: "4.2 MB",
    bg: "#5056FD",
    Icon: FileText,
    shared: true,
  },
  {
    name: "campaign-hero.png",
    size: "8.1 MB",
    bg: "#4ECDC4",
    Icon: ImageIcon,
    shared: false,
  },
  {
    name: "walkthrough.mp4",
    size: "128 MB",
    bg: "#a855f7",
    Icon: Video,
    shared: true,
  },
];

const rowVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function ProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full min-w-0 max-w-[480px]"
    >
      {/* soft brand glow behind the window, no blobs, just depth */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[#5056FD]/[0.06] blur-2xl" />

      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04),0_24px_48px_-16px_rgba(17,24,39,0.16)]">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#FAFAF8] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
          <div className="ml-3 min-w-0 flex-1 truncate rounded-md bg-black/[0.04] px-3 py-1 text-center text-[11px] text-gray-400">
            stellarsync.app/dashboard
          </div>
        </div>

        <div className="flex">
          {/* icon rail */}
          <div className="flex w-14 flex-col items-center gap-3 border-r border-black/[0.06] bg-[#111827] py-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5056FD]">
              <Home className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
              <Files className="h-4 w-4 text-white/60" strokeWidth={2} />
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
              <Share2 className="h-4 w-4 text-white/60" strokeWidth={2} />
            </div>
          </div>

          {/* content */}
          <div className="min-w-0 flex-1 p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <span className="shrink-0 text-[13px] font-medium text-gray-900">
                Recent files
              </span>
              <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#5056FD]/10 px-2 py-1 text-[11px] font-medium text-[#5056FD]">
                <HardDrive className="h-3 w-3" />
                2.4 / 10 GB
              </div>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="space-y-2"
            >
              {rows.map((row) => (
                <motion.div
                  key={row.name}
                  variants={rowVariants}
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-3 rounded-xl border border-black/[0.05] bg-white p-2.5 transition-colors hover:bg-[#FAFAF8]"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: row.bg }}
                  >
                    <row.Icon className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-gray-900">
                      {row.name}
                    </p>
                    <p className="text-[11px] text-gray-400">{row.size}</p>
                  </div>
                  {row.shared && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#5056FD]/10 px-2 py-1 text-[10px] font-medium text-[#5056FD]">
                      <LinkIcon className="h-2.5 w-2.5" />
                      Shared
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-[11px] text-gray-400">
                <span>Storage</span>
                <span>24%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "24%" }}
                  viewport={viewport}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-[#5056FD]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
