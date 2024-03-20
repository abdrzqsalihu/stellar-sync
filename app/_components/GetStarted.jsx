import { Earth, Lock, Share2 } from "lucide-react";
import React from "react";

function GetStarted() {
  return (
    <div className="bg-gray-100 py-14">
      <h1 className="text-center text-[1.7rem] md:text-[2.3rem] font-bold text-secondary mb-8">
        Why StellarSync?
      </h1>
      <div className="mx-auto max-w-[92%] md:max-w-screen-xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          {/* GRID 1  */}
          <div className="group relative block h-52 sm:h-80 lg:h-[16rem] cursor-pointer">
            <span className="absolute inset-0 border-2 border-dashed border-primary rounded-lg"></span>

            <div className="relative flex h-full transform items-end border-2 border-secondary bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2 rounded-lg">
              <div className="p-4 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8">
                <Earth size={45} color="#5056FD" />
                <h2 className="mt-4 text-xl font-medium sm:text-2xl text-secondary">
                  File Accessibility
                </h2>
              </div>

              <div className="absolute p-4 py-10 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-10">
                <h3 className="mt-4 text-xl font-medium sm:text-2xl text-primary">
                  File Accessibility
                </h3>

                <p className="mt-4 text-sm sm:text-base">
                  Never be without your important files again. Experience true
                  flexibility and convenience with seamless access to your
                  files, anytime, anywhere.
                </p>
              </div>
            </div>
          </div>
          {/* GRID 2 */}
          <div className="group relative block h-52 sm:h-80 lg:h-[16rem] cursor-pointer">
            <span className="absolute inset-0 border-2 border-dashed border-primary rounded-lg"></span>

            <div className="relative flex h-full transform items-end border-2 border-secondary bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2 rounded-lg">
              <div className="p-4 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8">
                <Lock size={45} color="#5056FD" />
                <h2 className="mt-4 text-xl font-medium sm:text-2xl text-secondary">
                  Secured
                </h2>
              </div>

              <div className="absolute p-4 py-10 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-10">
                <h3 className="mt-4 text-xl font-medium sm:text-2xl text-primary">
                  Secured
                </h3>

                <p className="mt-4 text-sm sm:text-base">
                  Advanced security, including encryption, authentication, and
                  access control to safeguards your data from unauthorized
                  access.
                </p>
              </div>
            </div>
          </div>
          {/* GRID 3 */}
          <div className="group relative block h-52 sm:h-80 lg:h-[16rem] cursor-pointer">
            <span className="absolute inset-0 border-2 border-dashed border-primary rounded-lg"></span>

            <div className="relative flex h-full transform items-end border-2 border-secondary bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2 rounded-lg">
              <div className="p-4 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8">
                <Share2 size={45} color="#5056FD" />
                <h2 className="mt-4 text-xl font-medium sm:text-2xl text-secondary">
                  Seamless Sharing
                </h2>
              </div>

              <div className="absolute p-4 py-10 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-10">
                <h3 className="mt-4 text-xl font-medium sm:text-2xl text-primary">
                  Seamless Sharing
                </h3>

                <p className="mt-4 text-sm sm:text-base">
                  Share your content seamlessly with colleagues, clients, or
                  friends directly. Generate shareable links for effortless
                  distribution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;
