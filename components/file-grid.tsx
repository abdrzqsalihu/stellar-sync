"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useToast } from "../components/ui/use-toast";
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

interface FileGridProps {
  favorites?: boolean;
  shared?: boolean;
}

export default function FileGrid({
  favorites = false,
  shared = false,
}: FileGridProps) {
  const { toast } = useToast();

  // Mock files data
  const [files, setFiles] = useState([
    {
      id: "1",
      name: "Project Presentation.pdf",
      type: "pdf",
      size: "4.2 MB",
      uploadedAt: "2 days ago",
      favorite: true,
      shared: true,
    },
    {
      id: "2",
      name: "Company Logo.png",
      type: "image",
      size: "1.8 MB",
      uploadedAt: "1 week ago",
      favorite: true,
      shared: false,
    },
    {
      id: "3",
      name: "Meeting Notes.docx",
      type: "doc",
      size: "320 KB",
      uploadedAt: "3 days ago",
      favorite: false,
      shared: true,
    },
    {
      id: "4",
      name: "Product Demo.mp4",
      type: "video",
      size: "28.6 MB",
      uploadedAt: "5 days ago",
      favorite: false,
      shared: true,
    },
    {
      id: "5",
      name: "Financial Report.xlsx",
      type: "excel",
      size: "2.3 MB",
      uploadedAt: "1 day ago",
      favorite: false,
      shared: false,
    },
    {
      id: "6",
      name: "User Research.pdf",
      type: "pdf",
      size: "5.7 MB",
      uploadedAt: "2 weeks ago",
      favorite: true,
      shared: false,
    },
    {
      id: "7",
      name: "Website Mockup.fig",
      type: "design",
      size: "8.1 MB",
      uploadedAt: "4 days ago",
      favorite: false,
      shared: true,
    },
    {
      id: "8",
      name: "Client Feedback.docx",
      type: "doc",
      size: "450 KB",
      uploadedAt: "6 days ago",
      favorite: false,
      shared: false,
    },
  ]);

  // Filter files based on props
  const filteredFiles = files.filter((file) => {
    if (favorites) return file.favorite;
    if (shared) return file.shared;
    return true;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
      case "png":
      case "jpg":
        return <ImageIcon className="h-10 w-10 text-[#4ECDC4]" />;
      case "video":
      case "mp4":
        return <Video className="h-10 w-10 text-purple-500" />;
      default:
        return <FileText className="h-10 w-10 text-[#5056FD]" />;
    }
  };

  const toggleFavorite = (id: string) => {
    setFiles(
      files.map((file) =>
        file.id === id ? { ...file, favorite: !file.favorite } : file
      )
    );

    const file = files.find((f) => f.id === id);
    if (file) {
      toast({
        title: file.favorite ? "Removed from favorites" : "Added to favorites",
        description: file.favorite
          ? "File removed from bookmarks"
          : "File added to bookmarks for quick access",
      });
    }
  };

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(
      `https://stellar-sync.vercel.app/share/${id}`
    );
    toast({
      title: "Link copied",
      description: "File link copied to clipboard",
    });
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
                  {getFileIcon(file.type)}
                  <div>
                    <h3 className="font-medium line-clamp-1">{file.name}</h3>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                </div>
                <Star
                  className={`h-5 w-5 cursor-pointer ${
                    file.favorite
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
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toggleFavorite(file.id)}>
                    <Star className="mr-2 h-4 w-4" />
                    {file.favorite
                      ? "Remove from favorites"
                      : "Add to favorites"}
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
