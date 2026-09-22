"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fadeUp, viewport } from "./motion";

function Cta() {
  return (
    <section className="bg-[#5056FD] py-24 sm:py-32">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mx-auto max-w-screen-xl px-5 text-center sm:px-8"
      >
        <h2 className="font-serif text-4xl leading-[1.1] tracking-tight text-white sm:text-6xl">
          Start free. Stay in sync.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg text-white/80">
          1GB of storage, no credit card, set up in under a minute.
        </p>
        <Link
          href="/dashboard"
          className="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-[#111827] transition-transform hover:scale-[1.03]"
        >
          Get started
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </motion.div>
    </section>
  );
}

export default Cta;
