import React from "react";
import { navLinks } from "../constants/ContentConstants";
import Link from "next/link";
import { Github, Instagram, Twitter } from "lucide-react";

function Footer() {
  return (
    <div>
      <div className="py-10 border-b border-gray-100 sm:flex sm:items-center sm:justify-between mx-auto max-w-[92%] md:max-w-screen-xl px-4 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Quick Links  */}
        <ul className="flex flex-wrap justify-center gap-4 text-xs lg:justify-end">
          {navLinks.map((links) => (
            <li key={links.id}>
              <Link
                className={`text-gray-500 transition hover:opacity-75 text-[0.9rem]`}
                href={`#${links.id}`}
              >
                {links.title}
              </Link>
            </li>
          ))}
        </ul>
        {/* Social Icon */}
        <ul className="mt-8 flex justify-center gap-6 sm:mt-0 lg:justify-end">
          <li>
            <a
              href="#"
              rel="noreferrer"
              target="_blank"
              className="text-gray-700 transition hover:opacity-75"
            >
              <span className="sr-only">Twitter</span>
              <Twitter size={22} />
            </a>
          </li>

          <li>
            <a
              href="#"
              rel="noreferrer"
              target="_blank"
              className="text-gray-700 transition hover:opacity-75"
            >
              <span className="sr-only">Instagram</span>
              <Instagram size={22} />
            </a>
          </li>

          <li>
            <a
              href="#"
              rel="noreferrer"
              target="_blank"
              className="text-gray-700 transition hover:opacity-75"
            >
              <span className="sr-only">GitHub</span>
              <Github size={22} />
            </a>
          </li>
        </ul>
      </div>
      <div className="py-4 flex flex-col md:flex-row justify-center items-center">
        <p className="text-center text-[1rem]">
          &copy; {new Date().getFullYear()} ShareSync.
        </p>
        <div className="mt-1 md:ml-1 md:mt-0">
          <span className="md:inline-block">Built by </span>
          <a
            href="https://abdrzqsalihu.vercel.app/"
            rel="noreferrer"
            target="_blank"
            className="md:ml-1"
          >
            <span className="text-primary underline font-medium">
              Abdulrazaq Salihu
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
