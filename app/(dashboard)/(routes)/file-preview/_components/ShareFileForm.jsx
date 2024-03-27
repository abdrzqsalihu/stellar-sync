import { Copy } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Alert from "@/app/(dashboard)/_components/Alert";
import GlobalApi from "./../../../../utils/GlobalApi";

function ShareFileForm({ file, onPasswordSave, updateShared }) {
  const [isPasswordEnable, setIsEnablePassword] = useState(
    file?.password !== ""
  );
  const [alert, setAlert] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { user } = useUser();

  const sendEmail = () => {
    const data = {
      emailToSend: email,
      userName: user?.fullName,
      fileName: file.fileName,
      fileSize: file.fileSize,
      fileType: file.fileType,
      shortUrl: file?.shortUrl,
    };

    GlobalApi.sendEmail(data).then((resp) => {
      console.log(resp);
      setAlert({
        status: "Success",
        msg: "Email sent successfully!",
      });
      setEmail("");
      // Call the updateShared function passed from the parent component
      updateShared(); // Call the updateShared function here
    });
  };
  useEffect(() => {
    // Update isPasswordEnable state based on file password
    setIsEnablePassword(file?.password !== "");
  }, [file?.password]);

  const onCopyClick = () => {
    navigator.clipboard.writeText(file.shortUrl);
    setAlert({
      status: "Copied",
      msg: "Url copied successfully!",
    });
  };
  const handlePasswordSave = async () => {
    // Your logic to save the password
    // Assuming you've successfully saved the password
    await onPasswordSave(password);
    setAlert({
      status: "Password added",
      msg: "Password added successfully!",
    });
    // Clear the password
    setPassword("");
  };
  return (
    file && (
      <div className="flex flex-col gap-2">
        <Alert alert={alert} />
        <div>
          <label className="text-[14px] text-gray-500">Short Url</label>
          <div className="flex gap-5 p-2 border rounded-md justify-between">
            <input
              type="text"
              value={file.shortUrl}
              disabled
              className="disabled:text-gray-500 bg-transparent
              outline-none w-full"
            />
            <Copy
              className="text-gray-400 hover:text-gray-600 
          cursor-pointer"
              onClick={() => onCopyClick()}
            />
          </div>
        </div>
        <div className="gap-3 flex mt-5">
          <input
            type="checkbox"
            checked={isPasswordEnable}
            onChange={(e) => setIsEnablePassword(e.target.checked)}
          />
          <label>Enable Password?</label>
        </div>

        {isPasswordEnable ? (
          <div className="flex flex-col gap-3 items-center">
            <div className="border rounded-md w-full p-2">
              <input
                type="password"
                defaultValue={file?.password}
                className="disabled:text-gray-500 bg-transparent w-full
           outline-none"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="w-full p-2 bg-primary text-white
          rounded-md disabled:bg-gray-300 hover:opacity-90"
              disabled={password?.length < 4}
              onClick={handlePasswordSave}
            >
              Set Password
            </button>
          </div>
        ) : null}

        <div className="border rounded-md p-3 mt-5">
          <label className="text-[14px] text-gray-500">
            Send file to email
          </label>
          <div className="border rounded-md p-2 mt-2">
            <input
              type="email"
              placeholder="user@gmail.com"
              className=" bg-transparent
              outline-none w-full"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <button
            className="p-2 disabled:bg-gray-300
           bg-primary text-white hover:opacity-90
          w-full mt-2 rounded-md"
            disabled={email?.length < 3}
            onClick={() => sendEmail()}
          >
            Send Email
          </button>
        </div>
      </div>
    )
  );
}

export default ShareFileForm;
