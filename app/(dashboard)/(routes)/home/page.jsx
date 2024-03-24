import React from "react";
import Overview from "./_components/Overview";
import UploadFile from "./_components/UploadFile";

function HomePage() {
  return (
    <div className="mx-auto px-10 mt-10">
      <Overview />
      <UploadFile />
    </div>
  );
}

export default HomePage;
