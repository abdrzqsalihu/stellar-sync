import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

function Pricing() {
  return (
    <div className="h-full" id="pricing">
      <div className="mx-auto max-w-[92%] md:max-w-3xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
        <h2 className="text-3xl font-bold sm:text-4xl text-center mb-10 text-gray-900">
          Pricing
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center sm:gap-8">
          <div className="rounded-2xl border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                Starter
                <span className="sr-only">Plan</span>
              </h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {" "}
                  0${" "}
                </strong>

                <span className="text-sm font-medium text-gray-700">
                  /forever
                </span>
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              {/* <li className="flex items-center gap-1">
                <Check size={20} color="#5056FD" />
                <span className="text-gray-700"> 10 users included </span>
              </li> */}

              <li className="flex items-center gap-1">
                <Check size={20} color="#5056FD" />
                <span className="text-gray-700"> 1GB of storage </span>
              </li>

              <li className="flex items-center gap-1">
                <Check size={20} color="#5056FD" />
                <span className="text-gray-700"> Email support </span>
              </li>

              <li className="flex items-center gap-1">
                <Check size={20} color="#5056FD" />
                <span className="text-gray-700"> Help center access </span>
              </li>
            </ul>

            <Link
              href="/dashboard"
              className="mt-8 block rounded-full border border-primary bg-white px-12 py-3 text-center text-sm font-medium text-primary hover:ring-1 hover:ring-primary focus:outline-none focus:ring active:text-primary"
            >
              Get Started
            </Link>
          </div>
          <div className="rounded-2xl border border-primary p-6 shadow-sm ring-1 ring-primary sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                Pro
                <span className="sr-only">Plan</span>
              </h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-secondary sm:text-4xl">
                  {" "}
                  5${" "}
                </strong>

                <span className="text-sm font-medium text-gray-700">
                  /month
                </span>
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              {/* <li className="flex items-center gap-1">
                <Check size={20} color="#5056FD" />
                <span className="text-gray-700"> 20 users included </span>
              </li> */}

              <li className="flex items-center gap-1">
                <Check size={20} color="#5056FD" />

                <span className="text-gray-700"> 4GB of storage </span>
              </li>

              <li className="flex items-center gap-1">
                <Check size={20} color="#5056FD" />
                <span className="text-gray-700"> Email support </span>
              </li>

              <li className="flex items-center gap-1">
                <Check size={20} color="#5056FD" />
                <span className="text-gray-700"> Help center access </span>
              </li>

              <li className="flex items-center gap-1">
                <Check size={20} color="#5056FD" />
                <span className="text-gray-700"> Phone support </span>
              </li>

              {/* <li className="flex items-center gap-1">
                <Check size={20} color="#5056FD" />
                <span className="text-gray-700"> Community access </span>
              </li> */}
            </ul>

            <Link
              href="/dashboard"
              className="mt-8 block rounded-full border border-primary bg-primary px-12 py-3 text-center text-sm font-medium text-white hover:bg-primary hover:ring-1 hover:ring-primary focus:outline-none focus:ring active:text-primary hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
