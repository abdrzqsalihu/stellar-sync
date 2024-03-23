// "use client";
import React from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
function Layout({ children }) {
  return (
    <div>
      <div className="flex md:h-full md:w-64 flex-col fixed inset-y-0 z-50">
        {/* <!-- Sidebar --> */}
        <Sidebar />
      </div>
      <div className="flex flex-col flex-grow md:ml-64">
        {/* <!-- Main content area --> */}
        <Header />
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
