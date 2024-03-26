import React from "react";

function SharedTotalCard({ totalSharedFile }) {
  return (
    <div
      className="p-3 border rounded-md grid grid-cols-2
md:grid-cols-3 lg:grid-cols-4 mt-3"
    >
      <h2 className="text-gray-500">
        Total shared {totalSharedFile > 2 ? "files" : "file"}: {totalSharedFile}
      </h2>
    </div>
  );
}

export default SharedTotalCard;
