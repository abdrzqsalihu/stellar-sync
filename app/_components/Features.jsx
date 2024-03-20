import {
  CalendarX2,
  ExternalLink,
  FolderHeart,
  FolderTree,
  LayoutList,
  MonitorSmartphone,
} from "lucide-react";
import React from "react";

function Features() {
  return (
    <div className="mx-auto" id="features">
      <section className="bg-secondary text-white">
        <div className="mx-auto max-w-[92%] md:max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Features</h2>

            <p className="mt-4 text-gray-300">
              Upload, manage and share content instantly with friends, family,
              colleagues, or the public.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="block rounded-xl border border-gray-800 p-8 shadow-md hover:shadow-primary hover:bg-opacity-10 transition duration-500 ease-linear cursor-pointer">
              <LayoutList size={35} color="#5056FD" />

              <h2 className="mt-4 text-xl font-bold text-white">
                User-friendly Interface
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                User-friendly interface that makes navigation effortless and
                interactions intuitive, ensuring a seamless experience for all
                users.
              </p>
            </div>

            <div className="block rounded-xl border border-gray-800 p-8 shadow-md hover:shadow-primary hover:bg-opacity-10 transition duration-500 ease-linear cursor-pointer">
              <FolderTree size={35} color="#5056FD" />
              <h2 className="mt-4 text-xl font-bold text-white">
                File Organization
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Effortlessly organize your files with our intuitive file
                organization feature, ensuring a seamless experience for all
                users.
              </p>
            </div>

            <div className="block rounded-xl border border-gray-800 p-8 shadow-md hover:shadow-primary hover:bg-opacity-10 transition duration-500 ease-linear cursor-pointer">
              <ExternalLink size={35} color="#5056FD" />

              <h2 className="mt-4 text-xl font-bold text-white">
                Customizable Sharing Options
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Tailor your sharing experience with customizable options,
                ensuring seamless collaboration and communication for all users.
              </p>
            </div>

            <div className="block rounded-xl border border-gray-800 p-8 shadow-md hover:shadow-primary hover:bg-opacity-10 transition duration-500 ease-linear cursor-pointer">
              <MonitorSmartphone size={35} color="#5056FD" />

              <h2 className="mt-4 text-xl font-bold text-white">
                Mobile Accessibility
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Experience seamless accessibility on-the-go with our
                mobile-friendly platform, ensuring effortless usage for all
                users.
              </p>
            </div>

            <div className="block rounded-xl border border-gray-800 p-8 shadow-md hover:shadow-primary hover:bg-opacity-10 transition duration-500 ease-linear cursor-pointer">
              <FolderHeart size={35} color="#5056FD" />

              <h2 className="mt-4 text-xl font-bold text-white">
                Favorites/Bookmarking
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Effortlessly save and access your favorite content with our
                intuitive bookmarking feature, ensuring a seamless experience
                for all users.
              </p>
            </div>

            <div className="block rounded-xl border border-gray-800 p-8 shadow-md hover:shadow-primary hover:bg-opacity-10 transition duration-500 ease-linear cursor-pointer">
              <CalendarX2 size={35} color="#5056FD" />
              <h2 className="mt-4 text-xl font-bold text-white">
                Content Expiry
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                Set content expiry effortlessly, ensuring seamless management
                and control over shared materials for all users.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;
