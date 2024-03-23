"use client";
import { sidebarLinks } from "@/app/constants/ContentConstants";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

function Sidebar({ openNavigation, toggleNavigation }) {
  const { user } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openNavigation && !event.target.closest(".side-nav")) {
        toggleNavigation();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openNavigation]);

  const handleClick = () => {
    if (openNavigation) {
      toggleNavigation();
    }
  };

  return (
    <div>
      <div
        className={`side-nav ${
          openNavigation ? "flex" : "hidden md:flex"
        }  h-screen w-full flex-col justify-between border-e bg-secondary z-40`}
      >
        <div className="px-4 py-6">
          <Link href="/" className="grid h-10 w-32 place-content-center">
            <Image
              src="/white-logo.png"
              width={100}
              height={100}
              style={{ width: "auto", height: "auto" }}
              alt="Logo"
            />
          </Link>

          <ul className="mt-8 space-y-[0.4rem]">
            {sidebarLinks.map((item, index) => (
              <li key={index}>
                <Link
                  onClick={() => {
                    handleClick();
                  }}
                  href={item.path}
                  className={`rounded-lg px-4 py-3 text-sm font-medium flex items-center ${
                    pathname === item.path
                      ? "bg-gray-300 text-secondary"
                      : "text-gray-200"
                  }`}
                >
                  <item.icon
                    strokeWidth={1.4}
                    size={18}
                    color={`${pathname == item.path ? "#5056FD" : "#D1D5DB"}`}
                    className="mr-2"
                  />{" "}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-300">
          <div className="flex items-center gap-2 p-4">
            <UserButton />
            <div>
              <p className="text-xs text-white">
                <strong className="block font-medium mb-[0.1rem]">
                  {user?.fullName}
                </strong>
                <span> {user?.primaryEmailAddress.emailAddress} </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
