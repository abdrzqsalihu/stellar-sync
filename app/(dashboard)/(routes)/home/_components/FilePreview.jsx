import { CircleX, FileCheck2 } from "lucide-react";
import React from "react";

function FilePreview({ file, removeFile }) {
  return (
    <div className="flex items-center gap-2 justify-between mt-5 border rounded-md p-2 border-blue-100">
      <div className="flex items-center p-2">
        <FileCheck2 width={40} height={40} />
        <div className="text-left ml-2">
          <h2 className="text-primary font-medium">{file.name}</h2>
          <h2 className="text-[12px] text-gray-400">
            {file.type} / {(file.size / 1024 / 1024).toFixed(2)}MB
          </h2>
        </div>
      </div>
      <CircleX
        className="text-red-500 cursor-pointer mr-2"
        onClick={() => removeFile()}
      />
    </div>
  );
}

export default FilePreview;
