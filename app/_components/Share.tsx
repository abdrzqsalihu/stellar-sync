"use client";

import { motion } from "framer-motion";
import { Copy, Lock, FileText, Link as LinkIcon } from "lucide-react";
import { fadeUp, viewport } from "./motion";
import ChapterMark from "./ChapterMark";

function Share() {
  return (
    <section id="share" className="bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="order-2 lg:order-1"
        >
          <div className="mx-auto max-w-sm rounded-2xl border border-black/[0.06] bg-[#FBFAF7] p-5 shadow-[0_1px_2px_rgba(17,24,39,0.04),0_20px_40px_-20px_rgba(17,24,39,0.18)]">
            <div className="flex items-center gap-3 rounded-xl border border-black/[0.05] bg-white p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#5056FD]">
                <FileText className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[#111827]">
                  Q3-brand-guidelines.pdf
                </p>
                <p className="text-[11px] text-gray-400">4.2 MB</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-3 flex items-center gap-2 rounded-lg border border-black/[0.06] bg-white px-3 py-2.5"
            >
              <LinkIcon className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="flex-1 truncate text-[12px] text-gray-500">
                stellarsync.app/preview/8h2k
              </span>
              <Copy className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-2.5 flex items-center justify-between rounded-lg bg-[#5056FD]/[0.07] px-3 py-2.5"
            >
              <span className="flex items-center gap-2 text-[12px] font-medium text-[#111827]">
                <Lock className="h-3.5 w-3.5 text-[#5056FD]" />
                Password protected
              </span>
              <span className="h-4 w-7 rounded-full bg-[#5056FD] p-0.5">
                <span className="block h-3 w-3 translate-x-3 rounded-full bg-white" />
              </span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="order-1 lg:order-2"
        >
          <ChapterMark index={2} label="Share" />
          <h2 className="font-serif text-4xl leading-[1.1] tracking-tight text-[#111827] sm:text-5xl">
            One link.
            <br />
            Zero friction.
          </h2>
          <p className="mt-6 max-w-md text-base md:text-lg leading-relaxed text-gray-500">
            Turn any file into a link in one click. Add a password when it
            matters, or send it straight to an inbox. The recipient doesn&apos;t
            need an account, just the link.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default Share;
