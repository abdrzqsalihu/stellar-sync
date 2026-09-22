import Image from "next/image";
import Link from "next/link";
import { Github, Instagram, Twitter } from "lucide-react";
import { navLinks } from "../constants/ContentConstants";

function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-white">
      <div className="mx-auto max-w-screen-xl px-5 py-14 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
          <div>
            <Image
              src="/logo.png"
              width={120}
              height={28}
              style={{ width: "auto", height: "22px" }}
              alt="StellarSync"
            />
            <p className="mt-3 max-w-xs text-sm text-gray-400">
              A fast, uncluttered home for your files.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.id}
                className="text-sm text-gray-500 transition-colors hover:text-[#111827]"
              >
                {link.title}
              </Link>
            ))}
            <Link
              href="/policies"
              className="text-sm text-gray-500 transition-colors hover:text-[#111827]"
            >
              Terms & Policies
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://x.com/abdrzqsalihu"
              rel="noreferrer"
              target="_blank"
              aria-label="Twitter"
              className="text-gray-400 transition-colors hover:text-[#111827]"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://www.instagram.com/abdrzq.dev/"
              rel="noreferrer"
              target="_blank"
              aria-label="Instagram"
              className="text-gray-400 transition-colors hover:text-[#111827]"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://github.com/abdrzqsalihu/stellar-sync"
              rel="noreferrer"
              target="_blank"
              aria-label="GitHub"
              className="text-gray-400 transition-colors hover:text-[#111827]"
            >
              <Github size={18} />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-black/[0.06] pt-8 text-xs text-gray-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} StellarSync.</p>
          <p>
            Built with{" "}
            <a
              href="https://abdrzqsalihu.vercel.app/"
              rel="noreferrer"
              target="_blank"
              className="font-medium text-gray-500 underline underline-offset-2 hover:text-[#111827]"
            >
              Abdulrazaq Salihu
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
