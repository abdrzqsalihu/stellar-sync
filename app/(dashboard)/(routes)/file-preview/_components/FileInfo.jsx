import Image from "next/image";
import React, { useEffect, useState } from "react";

function FileInfo({ file }) {
  const [fileType, setFileType] = useState();
  useEffect(() => {
    file && setFileType(file?.fileType.split("/")[0]);
    // console.log(fileType);
  }, [file]);
  return (
    file && (
      <div
        className="text-center border
     flex justify-center mt-6 mb-4 flex-col items-center p-6 rounded-lg
     border-gray-300"
      >
        <Image
          src={fileType == "image" ? file?.fileUrl : "/file.png"}
          width={fileType == "image" ? 320 : 150}
          height={fileType == "image" ? 320 : 150}
          alt="logo"
          className="rounded-md object-contain"
          //   style={{ width: "auto", height: "auto" }}
        />
        <div className="mt-4">
          <h2 className="text-primary font-medium">{file.fileName}</h2>
          <h2 className="text-gray-400 text-[13px]">
            {file.fileType} / {(file.fileSize / 1024 / 1024).toFixed(2)}MB
          </h2>
        </div>
      </div>
    )
  );
}

export default FileInfo;
