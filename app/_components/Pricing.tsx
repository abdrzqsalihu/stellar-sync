"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { fadeUp, viewport } from "./motion";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/forever",
    features: ["1GB of storage", "Email support", "Help center access"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    features: [
      "10GB of storage",
      "Priority email support",
      "Phone support",
      "Help center access",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto max-w-xl text-center"
        >
          <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#5056FD]">
            Pricing
          </span>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight text-[#111827] sm:text-5xl">
            Simple, honest pricing.
          </h2>
          <p className="mt-5 text-base md:text-lg text-gray-500">
            Start free. Upgrade only when you actually need the room.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          custom={1}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-1 divide-y divide-black/[0.06] sm:grid-cols-2 sm:divide-x sm:divide-y-0"
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`px-8 py-10 sm:px-12 ${
                plan.highlight ? "bg-[#5056FD]/[0.03]" : ""
              }`}
            >
              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400">
                {plan.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="font-serif text-5xl tracking-tight text-[#111827]">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-400">{plan.period}</span>
              </p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-gray-600"
                  >
                    <Check
                      size={16}
                      className="text-[#5056FD]"
                      strokeWidth={2.25}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard"
                className={`mt-9 block rounded-full px-6 py-3 text-center text-sm font-medium transition-colors ${
                  plan.highlight
                    ? "bg-[#111827] text-white hover:bg-[#5056FD]"
                    : "border border-black/10 text-[#111827] hover:border-[#111827]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Pricing;
