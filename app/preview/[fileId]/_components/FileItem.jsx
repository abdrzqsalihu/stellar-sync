import { Download } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

function FileItem({ file }) {
  const [password, setPassword] = useState("");
  return (
    file && (
      <div>
        <div className="p-5 rounded-md bg-white flex flex-col items-center max-w-[100%] mx-auto">
          <div className="text-center flex-col gap-3 items-center flex">
            <h2 className="text-[20px] text-gray-600">
              <strong className="text-primary">{file.userName} </strong>
              <p className="text-[1rem] mt-1">Shared this file with you</p>
            </h2>
            <Image
              src="/download-file.gif"
              width={150}
              height={150}
              alt="download"
              className="w-[150px] h-[150px]  p-5 "
            />

            <h2 className="text-gray-500 text-[15px]">
              {file.fileName} ⚡ {file.fileType} ⚡{" "}
              {(file.fileSize / 1024 / 1024).toFixed(2)} MB
            </h2>
          </div>

          {file.password.length > 3 ? (
            <input
              type="password"
              className="p-2 border rounded-md text-[14px] mt-5
      text-center  outline-primary outline-1"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to access "
            />
          ) : null}

          <button
            href=""
            className="flex gap-2 p-2
       bg-primary text-white rounded-full w-full
       items-center hover:opacity-90
        text-[14px] mt-5 text-center  justify-center
        disabled:bg-gray-300"
            onClick={() => window.open(file?.fileUrl)}
            disabled={file.password !== password}
          >
            <Download className="h-4 w-4" /> Download
          </button>
          {/* <h2 className="text-gray-400 text-[12px]">
            *Term and Condition apply
          </h2> */}
        </div>
      </div>
    )
  );
}

export default FileItem;
