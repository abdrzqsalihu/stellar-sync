"use client";
// import { usePathname } from "next/navigation";
import { CircleArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import { React, useState } from "react";
import { navLinks } from "../constants/ContentConstants";
import { Menu, X } from "lucide-react";

function Header() {
  // const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-5 backdrop-blur shadow-sm">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="md:flex md:items-center md:gap-12">
              {/* Logo  */}
              <a className="block" href="/">
                <Image
                  src="/logo.png"
                  width={100}
                  height={100}
                  style={{ width: "auto", height: "auto" }}
                  alt="logo"
                />
              </a>
            </div>

            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-6 text-sm">
                  {navLinks.map((links) => (
                    <li key={links.id}>
                      <a
                        className={`text-gray-600 transition hover:text-primary hover:font-medium text-[0.9rem]`}
                        href={`#${links.id}`}
                      >
                        {links.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex sm:gap-4">
                <a
                  className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white shadow"
                  href="#"
                >
                  Login
                </a>

                <div className="hidden sm:flex">
                  <a
                    className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-primary flex items-center"
                    href="#"
                  >
                    <span className="pr-[0.4rem]">Get Started</span>
                    {/* <LogIn size={15} /> */}
                    <CircleArrowOutUpRight size={16} />
                  </a>
                </div>
              </div>

              {/* Menu Icon  */}
              <div className="block md:hidden">
                <button
                  className="cursor-pointer rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                  onClick={toggleMenu}
                >
                  {isMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu  */}
        <div
          className={`${
            isMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
          } transform origin-top transition-transform duration-300 ease-in-out absolute mt-1 left-0 w-full z-60 md:hidden`}
        >
          {isMenuOpen && (
            <div className="fixed left-0 w-full bg-white shadow-sm py-2">
              <ul className="space-y-2 p-2 px-8">
                {navLinks.map((nav) => (
                  <li
                    key={nav.id}
                    className={`cursor-pointer p-1 font-primary leading-6 text-secondary hover:text-primary hover:font-medium mr-0}`}
                  >
                    <a href={`#${nav.id}`}>{nav.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
