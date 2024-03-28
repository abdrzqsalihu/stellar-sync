"use client";
import React, { useState } from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";

function Layout({ children }) {
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (!openNavigation) {
      setOpenNavigation(true);
      // console.log(openNavigation);
    } else {
      setOpenNavigation(false);
      // console.log(openNavigation);
    }
  };
  return (
    <div className="relative lg:flex overflow-hidden">
      <div
        className={`flex md:h-full md:w-64 flex-col fixed inset-y-0 z-50 ${
          openNavigation
            ? "transition-transform duration-300 ease-in-out md:translate-x-0"
            : "transition-transform duration-300 ease-in-out -translate-x-64 md:-translate-x-0"
        }`}
      >
        {/* <!-- Sidebar --> */}
        <Sidebar
          openNavigation={openNavigation}
          toggleNavigation={toggleNavigation}
        />
      </div>

      <div className="flex flex-col flex-grow md:ml-64">
        {/* <!-- Main content area --> */}
        <Header
          toggleNavigation={toggleNavigation}
          openNavigation={openNavigation}
        />
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
