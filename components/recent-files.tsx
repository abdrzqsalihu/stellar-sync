"use client";

import { Button } from "../components/ui/button";
import {
  Download,
  FileText,
  ImageIcon,
  LinkIcon,
  MoreHorizontal,
  Star,
  Trash,
  Video,
  Upload,
  FolderOpen,
  Cloud,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UploadButton from "./upload-button";

export interface File {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  stared: boolean;
  shared: boolean;
  fileUrl?: string;
}

interface RecentFilesProps {
  limit?: number;
  showViewAll?: boolean;
  fileList: File[];
}

const EmptyState = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center py-20 px-6">
        {/* Animated Background Elements */}
        <div className="relative mb-8">
          {/* Main Cloud Icon with Gradient */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#5056FD]/10 to-[#5056FD]/5 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-[#5056FD]/10 to-[#5056FD]/5 p-8 rounded-full border border-[#5056FD]/10 shadow-sm">
              <Cloud className="h-16 w-16 text-[#5056FD]" />
            </div>
          </div>
        </div>
        {/* Text Content */}
        <div className="text-center space-y-4 mb-8">
          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 via-primary to-purple-700 bg-clip-text text-transparent">
            No files yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Upload your first files to get started. Store, organize, and share
            your documents, images, and videos securely.
          </p>
        </div>
        {/* Action Button */}
        <UploadButton hasFiles={false} />
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#5056FD]/10 rounded-xl flex items-center justify-center mb-3">
              <Upload className="w-5 h-5 text-[#5056FD]" />
            </div>
            <h4 className="font-medium text-sm text-foreground mb-1">
              Drag & Drop
            </h4>
            <p className="text-xs text-muted-foreground">
              Simply drag files here to upload
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#5056FD]/10 rounded-xl flex items-center justify-center mb-3">
              <Star className="w-5 h-5 text-[#5056FD]" />
            </div>
            <h4 className="font-medium text-sm text-foreground mb-1">
              Organize
            </h4>
            <p className="text-xs text-muted-foreground">
              Star important files for quick access
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-[#5056FD]/10 rounded-xl flex items-center justify-center mb-3">
              <LinkIcon className="w-5 h-5 text-[#5056FD]" />
            </div>
            <h4 className="font-medium text-sm text-foreground mb-1">Share</h4>
            <p className="text-xs text-muted-foreground">
              Share files with secure links
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default function RecentFiles({
  limit = 10,
  showViewAll = true,
  fileList,
}: RecentFilesProps) {
  const limitedFiles = limit ? fileList.slice(0, limit) : fileList;
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  // If no files, show the beautiful empty state
  if (!fileList || fileList.length === 0) {
    return <EmptyState />;
  }

  const getFileColor = (fileType: string) => {
    switch (fileType) {
      case "image/png":
      case "image/jpg":
      case "image/jpeg":
      case "image/gif":
      case "image/svg":
      case "image/webp":
      case "image/bmp":
        return "#4ECDC4";
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
        return "#a855f7";
      case "application/pdf":
        return "#ef4444";
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "#3b82f6";
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "text/csv":
        return "#22c55e";
      default:
        return "#5056FD";
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image/png":
      case "image/jpg":
      case "image/jpeg":
      case "image/gif":
      case "image/svg":
      case "image/webp":
      case "image/bmp":
        return <ImageIcon className="h-10 w-10 text-white" />;
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
        return <Video className="h-10 w-10 text-white" />;
      case "application/pdf":
        return <FileText className="h-10 w-10 text-white" />;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FileText className="h-10 w-10 text-white" />;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "text/csv":
        return <FileText className="h-10 w-10 text-white" />;
      default:
        return <FileText className="h-10 w-10 text-white" />;
    }
  };

  const getFileExtension = (name: string) => {
    return name.split(".").pop()?.toUpperCase() || "";
  };

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(
      `https://stellar-sync.vercel.app/preview/${id}`
    );
    toast.success("Link copied to clipboard");
  };

  const getDateGroup = (timestamp: any) => {
    // Parse the timestamp - it's in UTC format
    const fileDate = new Date(timestamp);
    const now = new Date();

    // Get the date parts in UTC to avoid timezone conversion issues
    const todayUTC = {
      year: now.getUTCFullYear(),
      month: now.getUTCMonth(),
      date: now.getUTCDate(),
    };

    const fileDateUTC = {
      year: fileDate.getUTCFullYear(),
      month: fileDate.getUTCMonth(),
      date: fileDate.getUTCDate(),
    };

    // Create UTC date objects for comparison (normalized to midnight UTC)
    const todayUTCDate = new Date(
      Date.UTC(todayUTC.year, todayUTC.month, todayUTC.date)
    );
    const fileUTCDate = new Date(
      Date.UTC(fileDateUTC.year, fileDateUTC.month, fileDateUTC.date)
    );

    // Calculate days difference
    const daysDiff = Math.floor(
      (todayUTCDate.getTime() - fileUTCDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) {
      return "Today";
    } else if (daysDiff === 1) {
      return "Yesterday";
    } else if (daysDiff <= 7) {
      return "This Week";
    } else {
      return "Older";
    }
  };

  // Group files by date
  const groupedFiles: Record<string, File[]> = {};

  limitedFiles.forEach((file) => {
    const group = getDateGroup(file.uploadedAt);
    if (!groupedFiles[group]) {
      groupedFiles[group] = [];
    }
    groupedFiles[group].push(file);
  });

  // Sort groups by recency
  const sortedGroups = Object.keys(groupedFiles).sort((a, b) => {
    const order: Record<string, number> = {
      Today: 0,
      Yesterday: 1,
      "This Week": 2,
      Older: 3,
    };
    return order[a] - order[b];
  });

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

  const handleDeleteClick = (fileId) => {
    setFileToDelete(fileId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      deleteFile(fileToDelete);
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const deleteFile = async (id: string) => {
    await fetch(`/api/files/${id}`, { method: "DELETE" });
    toast.success("File deleted successfully!");
    router.refresh();
  };

  return (
    <>
      <div className="space-y-6">
        {sortedGroups.map((group) => {
          if (groupedFiles[group].length === 0) return null;

          return (
            <div key={group} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{group}</h3>
                {group === "Today" && showViewAll && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/all-files">View all files</Link>
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupedFiles[group].map((file) => (
                  <div
                    key={file.id}
                    className="group relative flex overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md dark:border-border"
                  >
                    <Link
                      href={`/dashboard/file/${file.id}`}
                      className="flex flex-1 p-4"
                    >
                      <div
                        className="mr-4 flex h-14 w-14 items-center justify-center rounded-lg"
                        style={{ backgroundColor: getFileColor(file.fileType) }}
                      >
                        {getFileIcon(file.fileType)}
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                              {getFileExtension(file.fileName)}
                            </div>
                            <h3 className="mt-1 font-medium line-clamp-1">
                              {file.fileName}
                            </h3>
                            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                              <span>
                                {(
                                  parseInt(file.fileSize) /
                                  1024 /
                                  1024
                                ).toFixed(2)}
                                MB
                              </span>
                              {file.shared && (
                                <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                                  <LinkIcon className="h-3 w-3" /> Shared
                                </span>
                              )}
                            </div>
                          </div>
                          <Star
                            className={`h-5 w-5 cursor-pointer ${
                              file.stared
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground opacity-40 group-hover:opacity-100"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleStar(file.id, file.stared);
                            }}
                          />
                        </div>
                      </div>
                    </Link>

                    <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => toggleStar(file.id, file.stared)}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            {file.stared
                              ? "Remove from favorites"
                              : "Add to favorites"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyLink(file.id)}>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Copy link
                          </DropdownMenuItem>
                          <a
                            href={`/api/download?url=${encodeURIComponent(
                              file.fileUrl
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <DropdownMenuItem className="cursor-pointer">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                          </a>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(file.id)}
                            className="text-red-500"
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
            </div>
          );
        })}
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this file?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              file from your storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
