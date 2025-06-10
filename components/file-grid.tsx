"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import toast from "react-hot-toast";
import {
  Download,
  FileText,
  ImageIcon,
  LinkIcon,
  MoreHorizontal,
  Star,
  Trash,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface File {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  stared: boolean;
  shared: boolean;
  // Add other properties if needed, e.g., url for download
  url?: string;
}

interface FileGridProps {
  fileList: File[];
  updateStared: (id: string, isFavorite: boolean) => void;
  deleteFile: (id: string) => void;
  favorites?: boolean;
  shared?: boolean;
}

export default function FileGrid({
  fileList,
  updateStared,
  deleteFile,
  favorites = false,
  shared = false,
}: FileGridProps) {
  // Filter files based on props
  const filteredFiles = fileList.filter((file) => {
    if (favorites) return file.stared;
    if (shared) return file.shared;
    return true;
  });

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    // console.log(extension);
    switch (extension) {
      case "image/png":
      case "image/jpg":
      case "image/jpeg":
      case "image/gif":
      case "image/svg":
      case "image/webp":
      case "image/bmp":
        return <ImageIcon className="h-10 w-10 text-[#4ECDC4]" />;
      case "video/mp4":
      case "video/quicktime":
      case "video/x-msvideo":
      case "video/x-flv":
      case "video/mp2t":
      case "video/3gpp":
      case "video/3gpp2":
      case "video/x-m4v":
      case "video/webm":
      case "video/x-mng":
      case "video/ogg":
      case "video/ogv":
      case "video/dash":
      case "video/x-ms-wmv":
      case "video/x-ms-asf":
        return <Video className="h-10 w-10 text-purple-500" />;
      case "application/pdf":
        return <FileText className="h-10 w-10 text-red-500" />;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FileText className="h-10 w-10 text-blue-500" />;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return <FileText className="h-10 w-10 text-green-500" />;
      default:
        return <FileText className="h-10 w-10 text-[#5056FD]" />;
    }
  };

  const toggleFavorite = (id: string) => {
    const file = fileList.find((f) => f.id === id);
    if (file) {
      updateStared(id, file.stared);
      toast.success(
        file.stared ? "File removed from favorites" : "File added to favorites"
      );
    }
  };

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(
      `https://stellar-sync.vercel.app/preview/${id}`
    );
    toast.success("File link copied to clipboard");
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredFiles.length === 0 ? (
        <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
          <p className="text-lg font-medium">No files found</p>
          <p className="text-sm text-muted-foreground">
            {favorites
              ? "You haven't added any files to favorites yet."
              : shared
              ? "You haven't shared any files yet."
              : "Upload your first file to get started."}
          </p>
        </div>
      ) : (
        filteredFiles.map((file) => (
          <div
            key={file.id}
            className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
          >
            <Link
              href={`/dashboard/file/${file.id}`}
              className="flex flex-1 flex-col p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.fileType)}
                  <div>
                    <h3 className="font-medium line-clamp-1">
                      {file.fileName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {" "}
                      {(parseInt(file.fileSize) / 1024 / 1024).toFixed(2)}MB
                    </p>
                  </div>
                </div>
                <Star
                  className={`h-5 w-5 cursor-pointer ${
                    file.stared
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 group-hover:text-gray-400"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(file.id);
                  }}
                />
              </div>

              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Uploaded {file.uploadedAt}</span>
                  {file.shared && (
                    <span className="flex items-center gap-1 rounded-full bg-[#5056FD]/10 px-2 py-0.5 text-[#5056FD]">
                      <LinkIcon className="h-3 w-3" /> Shared
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm">
                  <MoreHorizontal className="h-4 w-4 text-gray-700" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => updateStared(file.id, file.stared)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {file.stared ? "Remove from favorites" : "Add to favorites"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyLink(file.id)}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500 focus:text-red-500">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
