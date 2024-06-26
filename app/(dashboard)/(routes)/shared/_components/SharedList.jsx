import { Star } from "lucide-react";
import Link from "next/link";
import React from "react";

function SharedList({ sharedList, updateStared, deleteFile }) {
  return (
    <div className="overflow-x-auto sm:rounded-lg mt-6">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-200 uppercase bg-secondary ">
          <tr>
            <th scope="col" className="px-6 py-3">
              File Name
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Size
            </th>
            <th scope="col" className="px-12 lg:px-6 py-3">
              Action
            </th>
            <th scope="col" className="px-0 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {sharedList.map((file, index) => (
            <tr className="odd:bg-white even:bg-gray-50 border-b" key={index}>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {file.fileName}
              </th>
              <td className="px-6 py-4">{file.fileType}</td>
              <td className="px-6 py-4">
                {(file.fileSize / 1024 / 1024).toFixed(2)}MB
              </td>
              <td className="px-6 py-4 flex flex-row items-center justify-between max-w-[72%]">
                <Link
                  href={"/file-preview/" + file.id}
                  className="font-medium text-primary hover:opacity-90 ml-[0.1rem] lg:-ml-7"
                >
                  View
                </Link>

                <button
                  className="font-medium text-red-500 hover:opacity-90 ml-10 lg:ml-0"
                  onClick={() => deleteFile(file.id)}
                >
                  Delete
                </button>
              </td>
              <td>
                <button
                  className="cursor-pointer mr-8 ml-5 lg:mr-0 lg:ml-0"
                  onClick={() => updateStared(file.id, file.stared)}
                >
                  {file.stared === false ? (
                    <Star size={18} />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      style={{
                        fill: "#212837",
                        transform: "",
                        msFilter: "",
                      }}
                    >
                      <path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"></path>
                    </svg>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SharedList;
