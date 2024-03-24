import React from "react";

function ProgressBar({ progress }) {
  return (
    <div className="bg-gray-400 w-full mt-4 h-4 rounded-xl">
      <div
        className="py-0.2 bg-primary h-4 rounded-xl text-[12px] text-white"
        style={{ width: `${progress}%` }}
      >
        {`${Number(progress).toFixed(0)}%`}
      </div>
    </div>
  );
}

export default ProgressBar;
