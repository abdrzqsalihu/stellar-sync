"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductPreview from "./ProductPreview";

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-[13px] font-medium uppercase tracking-[0.14em] text-[#5056FD]"
          >
            File storage, rebuilt calmly
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[2.75rem] leading-[1.05] tracking-tight text-[#111827] sm:text-6xl lg:text-[4.25rem]"
          >
            Your files.
            <br />
            <span className="italic text-[#5056FD]">Always</span> within
            reach.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-gray-500"
          >
            A fast, uncluttered home for your files. Drop anything in,
            watch it organize itself, and hand a link to anyone — no
            account required on their end.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-full bg-[#111827] px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#5056FD]"
            >
              Get started free
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="#organize"
              className="text-sm font-medium text-gray-500 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-[#111827]"
            >
              See how it works
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-xs text-gray-400"
          >
            1GB free forever. No credit card needed.
          </motion.p>
        </div>

        <ProductPreview />
      </div>
    </section>
  );
}

export default Hero;
