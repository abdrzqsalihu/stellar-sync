"use client";
import Logo from "../../../public/white-logo.png";
import { sidebarLinks } from "../../constants/ContentConstants";
import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CircleHelp, LogOut, Settings } from "lucide-react";

function Sidebar({ openNavigation, toggleNavigation }) {
  const { signOut } = useClerk();
  const router = useRouter();
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
        }  h-screen w-full flex-col justify-between border-e bg-secondary z-50`}
      >
        <div className="px-4 py-6">
          <Link href="/" className="grid h-10 w-32 place-content-center">
            <Image
              src={Logo}
              width={100}
              height={100}
              style={{ width: "auto", height: "auto" }}
              quality={100}
              placeholder="empty"
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

        <div className="sticky inset-x-0 bottom-0">
          <ul className="space-y-[0.4rem] p-4">
            <p className="uppercase text-[12px] text-gray-400 px-3 mb-4">
              ACCOUNT
            </p>
            <li>
              <a
                onClick={() => {
                  handleClick();
                }}
                href="https://wa.me/+2348085458632"
                target="_blank"
                className={`rounded-lg px-3 py-3 text-sm font-medium flex items-center text-gray-200`}
              >
                <CircleHelp
                  strokeWidth={1.4}
                  size={18}
                  color={`#D1D5DB`}
                  className="mr-2"
                />{" "}
                <span>Support</span>
              </a>
            </li>

            <li>
              <Link
                onClick={() => {
                  handleClick();
                }}
                href="/user-profile"
                className={`rounded-lg px-3 py-3 text-sm font-medium flex items-center text-gray-200 ${
                  pathname === "/user-profile"
                    ? "bg-gray-300 text-secondary"
                    : "text-gray-200"
                }`}
              >
                <Settings
                  strokeWidth={1.4}
                  size={18}
                  color={`${
                    pathname == "/user-profile" ? "#5056FD" : "#D1D5DB"
                  }`}
                  className="mr-2"
                />{" "}
                <span>Settings</span>
              </Link>
            </li>

            <li>
              <button
                onClick={() => signOut(() => router.push("/"))}
                className={`rounded-lg px-3 py-3 text-sm font-medium flex items-center text-gray-200`}
              >
                <LogOut
                  strokeWidth={1.4}
                  size={18}
                  color={`#D1D5DB`}
                  className="mr-2"
                />{" "}
                <span>Logout</span>
              </button>
            </li>
          </ul>
          <div className="flex items-center gap-2 p-4 border-t border-gray-300">
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
