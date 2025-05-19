import Link from "next/link";
import React from "react";

function Hero() {
  return (
    <div className="mt-16">
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="bg-gradient-to-r from-blue-500 via-primary to-purple-700 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              Upload, Manage, and Share Your Content
              <span className="sm:block"> Seamlessly! </span>
            </h1>

            <p className="mx-auto mt-4 max-w-[38rem] sm:text-xl/relaxed text-secondary">
              Streamline your workflow. Upload, manage, and share your content
              all in one place.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                className="block w-[90%] rounded border border-primary bg-primary px-12 py-3 text-sm font-medium text-white transition duration-500 ease-in-out hover:text-primary hover:bg-transparent focus:outline-none focus:ring active:text-opacity-75 md:w-auto"
                href="/dashboard"
              >
                Get Started
              </Link>

              <Link
                className="block w-[90%] rounded border border-primary px-12 py-3 text-sm font-medium text-primary hover:text-white transition duration-500 ease-in-out hover:bg-primary focus:outline-none focus:ring active:bg-primary  md:w-auto"
                href="#features"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
