import React from "react";

function StaredTotalCard({ totalStaredFile }) {
  return (
    <div
      className="p-3 border rounded-md grid grid-cols-1
md:grid-cols-3 lg:grid-cols-4 mt-3"
    >
      <h2 className="text-gray-500">
        Total stared {totalStaredFile > 2 ? "files" : "file"}: {totalStaredFile}
      </h2>
    </div>
  );
}

export default StaredTotalCard;
