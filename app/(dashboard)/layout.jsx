// "use client";
import React from "react";
import Sidebar from "./_components/Sidebar";
function Layout({ children }) {
  return (
    <div>
      <Sidebar />
      <div>{children}</div>
    </div>
  );
}

export default Layout;
