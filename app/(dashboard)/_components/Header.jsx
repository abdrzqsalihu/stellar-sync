"use client";
import { UserButton } from "@clerk/nextjs";
import { AlignJustify, BadgeHelp } from "lucide-react";
import Image from "next/image";
import React from "react";

function Header({ toggleNavigation, openNavigation }) {
  return (
    <div className="flex p-5 border-b items-center justify-between md:justify-end">
      <button id="menuButton" className="md:hidden" onClick={toggleNavigation}>
        <AlignJustify className={`${openNavigation ? "hidden" : "flex"}`} />
      </button>
      <Image
        src="/logo.png"
        width={90}
        height={90}
        style={{ width: "auto", height: "auto" }}
        // className="md:hidden"
        className={`${openNavigation ? "hidden" : "flex"} md:hidden`}
        alt="logo"
      />
      <a
        href="https://wa.me/+2348085458632"
        target="_blank"
        aria-label="WhatsApp Profile"
        className="mr-8 hidden md:block"
      >
        <BadgeHelp
          size={22}
          strokeWidth={1.3}
          // className="mr-8 hidden md:block"
          color="#5056FD"
        />
      </a>
      <UserButton />
    </div>
  );
}

export default Header;
