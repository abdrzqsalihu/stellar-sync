import { UserButton } from "@clerk/nextjs";
import React from "react";

function Sidebar() {
  return (
    <div>
      <UserButton />
      Sidebar
    </div>
  );
}

export default Sidebar;
