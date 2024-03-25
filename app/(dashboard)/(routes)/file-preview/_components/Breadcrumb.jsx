import React from "react";
import Link from "next/link";
import { HomeIcon } from "lucide-react";
function Breadcrumb() {
  return (
    <div>
      <nav aria-label="Breadcrumb" className="flex justify-center items-start">
        <ol className="flex overflow-hidden rounded-lg border border-gray-200 text-gray-600">
          <li className="flex items-center">
            <Link
              href="/home"
              className="flex h-10 items-center gap-1.5 bg-gray-100 px-4 transition hover:text-primary"
            >
              <HomeIcon size={18} className="text-primary" />

              <span className="ms-1.5 text-xs font-medium"> Home </span>
            </Link>
          </li>

          <li className="relative flex items-center">
            <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)]"></span>

            <span className="flex h-10 items-center bg-white pe-4 ps-8 text-xs font-medium transition hover:text-primary cursor-pointer">
              File preview
            </span>
          </li>
        </ol>
      </nav>
    </div>
  );
}

export default Breadcrumb;
