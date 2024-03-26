import { Files, Share2, Star } from "lucide-react";
import React from "react";

function Overview({ allFilesCount, staredFilesCount, sharedFilesCount }) {
  return (
    <div>
      <h1 className="text-2xl font-medium text-primary mb-6">Overview</h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="rounded-lg">
          <div className="h-32 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">All files</p>

                <p className="text-2xl mt-1 font-medium text-gray-900">
                  {allFilesCount}
                </p>
              </div>

              <span className="rounded-full bg-primary p-3 text-white">
                <Files size={20} />
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-lg">
          <div className="h-32 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Shared files</p>

                <p className="text-2xl mt-1 font-medium text-gray-900">
                  {sharedFilesCount}
                </p>
              </div>

              <span className="rounded-full bg-primary p-3 text-white">
                <Share2 size={20} />
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-lg">
          <div className="h-32 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Stared files</p>

                <p className="text-2xl mt-1 font-medium text-gray-900">
                  {staredFilesCount}
                </p>
              </div>

              <span className="rounded-full bg-primary p-3 text-white">
                <Star size={20} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
