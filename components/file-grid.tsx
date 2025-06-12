"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
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
import { useRouter } from "next/navigation";

export interface File {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  stared: boolean;
  shared: boolean;
  url?: string;
}

interface FileGridProps {
  fileList: File[];
}

export default function FileGrid({ fileList }: FileGridProps) {
  const router = useRouter();

  // Choose an icon based on the fileType (MIME)
  const getFileIcon = (mime: string) => {
    if (mime.startsWith("image/")) {
      return <ImageIcon className="h-10 w-10 text-[#4ECDC4]" />;
    }
    if (mime.startsWith("video/")) {
      return <Video className="h-10 w-10 text-purple-500" />;
    }
    if (mime === "application/pdf") {
      return <FileText className="h-10 w-10 text-red-500" />;
    }
    if (
      mime === "application/msword" ||
      mime ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return <FileText className="h-10 w-10 text-blue-500" />;
    }
    if (
      mime === "application/vnd.ms-excel" ||
      mime ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mime === "text/csv"
    ) {
      return <FileText className="h-10 w-10 text-green-500" />;
    }
    // fallback icon
    return <FileText className="h-10 w-10 text-[#5056FD]" />;
  };

  const toggleStar = async (id: string, stared: boolean) => {
    await fetch(`/api/files/${id}`, {
      method: "POST",
      body: JSON.stringify({ stared: !stared }),
    });
    toast.success(
      stared ? "File removed from favorites" : "File added to favorites"
    );
    router.refresh();
  };

  const deleteFile = async (id: string) => {
    await fetch(`/api/files/${id}`, { method: "DELETE" });
    toast.success("File deleted successfully!");
    router.refresh();
  };

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/preview/${id}`);
    toast.success("File link copied to clipboard");
  };

  if (fileList.length === 0) {
    return (
      <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
        <p className="text-lg font-medium">No files found</p>
        <p className="text-sm text-muted-foreground">
          Upload your first file to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {fileList.map((f) => (
        <div
          key={f.id}
          className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
        >
          <Link
            href={`/dashboard/file/${f.id}`}
            className="flex flex-1 flex-col p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(f.fileType)}
                <div>
                  <h3 className="font-medium line-clamp-1">{f.fileName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {(Number(f.fileSize) / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Star
                className={`h-5 w-5 cursor-pointer ${
                  f.stared
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 group-hover:text-gray-400"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleStar(f.id, f.stared);
                }}
              />
            </div>

            <div className="mt-auto pt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Uploaded {f.uploadedAt}</span>
                {f.shared && (
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
                <DropdownMenuItem onClick={() => toggleStar(f.id, f.stared)}>
                  <Star className="mr-2 h-4 w-4" />
                  {f.stared ? "Remove from favorites" : "Add to favorites"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyLink(f.id)}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => deleteFile(f.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
