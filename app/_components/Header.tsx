"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { navLinks } from "../constants/ContentConstants";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 z-50 w-full border-b border-black/[0.06] bg-[#FBFAF7]/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            width={132}
            height={30}
            style={{ width: "auto", height: "24px" }}
            alt="StellarSync"
            priority
          />
        </Link>

        <nav aria-label="Global" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.id}
                  className="text-[13px] font-medium tracking-wide text-gray-500 transition-colors hover:text-[#111827]"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden text-[13px] font-medium text-gray-600 transition-colors hover:text-[#111827] md:block"
          >
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="hidden rounded-full bg-[#111827] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#5056FD] md:block"
          >
            Get started
          </Link>

          <button
            className="rounded-md p-2 text-[#111827] md:hidden"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="border-t border-black/[0.06] bg-[#FBFAF7] px-5 py-4 md:hidden"
        >
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.id}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm font-medium text-gray-600"
                >
                  {link.title}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-full bg-[#111827] px-5 py-2.5 text-center text-sm font-medium text-white"
              >
                Get started
              </Link>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}

export default Header;
