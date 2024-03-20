import React from "react";

function Cta() {
  return (
    <div>
      <footer className="bg-primary">
        <div className="mx-auto  max-w-[92%] md:max-w-screen-xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-[1.7rem] font-extrabold text-white sm:text-5xl">
              Share files effortlessly
            </h2>

            <p className="mx-auto mt-4 max-w-sm text-gray-200">
              Secure file sharing made easy. Keep your files safe and
              collaborate effortlessly with ShareSync.
            </p>
            <a
              href="#"
              className="mt-8 inline-block rounded-full border border-white bg-transparent px-12 py-3 text-center text-sm font-medium text-white hover:ring-1 hover:ring-white focus:outline-none focus:ring active:text-white"
            >
              Start for Free
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Cta;
