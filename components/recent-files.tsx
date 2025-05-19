"use client";

import { useState } from "react";
import { useToast } from "../components/ui/use-toast";
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
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface RecentFilesProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function RecentFiles({
  limit = 6,
  showViewAll = true,
}: RecentFilesProps) {
  const { toast } = useToast();

  // Mock files data with dates for grouping
  const [files, setFiles] = useState([
    {
      id: "1",
      name: "Project Presentation.pdf",
      type: "pdf",
      size: "4.2 MB",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      favorite: true,
      shared: true,
      color: "#5056FD",
    },
    {
      id: "2",
      name: "Company Logo.png",
      type: "image",
      size: "1.8 MB",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      favorite: true,
      shared: false,
      color: "#4ECDC4",
    },
    {
      id: "3",
      name: "Meeting Notes.docx",
      type: "doc",
      size: "320 KB",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      favorite: false,
      shared: true,
      color: "#5056FD",
    },
    {
      id: "4",
      name: "Product Demo.mp4",
      type: "video",
      size: "28.6 MB",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      favorite: false,
      shared: true,
      color: "#FFD166",
    },
    {
      id: "5",
      name: "Financial Report.xlsx",
      type: "excel",
      size: "2.3 MB",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      favorite: false,
      shared: false,
      color: "#06D6A0",
    },
    {
      id: "6",
      name: "User Research.pdf",
      type: "pdf",
      size: "5.7 MB",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      favorite: true,
      shared: false,
      color: "#118AB2",
    },
    {
      id: "7",
      name: "Website Mockup.fig",
      type: "design",
      size: "8.1 MB",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
      favorite: false,
      shared: true,
      color: "#EF476F",
    },
    {
      id: "8",
      name: "Client Feedback.docx",
      type: "doc",
      size: "450 KB",
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      favorite: false,
      shared: false,
      color: "#073B4C",
    },
  ]);

  // Limit files if needed
  const limitedFiles = limit ? files.slice(0, limit) : files;

  // Group files by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const getFileIcon = (type: string, color: string) => {
    switch (type) {
      case "image":
      case "png":
      case "jpg":
        return <ImageIcon className="h-10 w-10 text-white" />;
      case "video":
      case "mp4":
        return <Video className="h-10 w-10 text-white" />;
      default:
        return <FileText className="h-10 w-10 text-white" />;
    }
  };

  const getFileExtension = (name: string) => {
    return name.split(".").pop()?.toUpperCase() || "";
  };

  const getDateGroup = (date: Date) => {
    if (date >= today) {
      return "Today";
    } else if (date >= yesterday) {
      return "Yesterday";
    } else if (date >= lastWeekStart) {
      return "This Week";
    } else {
      return "Older";
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

  // Group files by date
  const groupedFiles: Record<string, typeof files> = {};

  limitedFiles.forEach((file) => {
    const group = getDateGroup(file.uploadedAt);
    if (!groupedFiles[group]) {
      groupedFiles[group] = [];
    }
    groupedFiles[group].push(file);
  });

  // Order of groups
  const groupOrder = ["Today", "Yesterday", "This Week", "Older"];

  return (
    <div className="space-y-6">
      {groupOrder.map((group) => {
        if (!groupedFiles[group] || groupedFiles[group].length === 0)
          return null;

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
                      style={{ backgroundColor: file.color }}
                    >
                      {getFileIcon(file.type, file.color)}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                            {getFileExtension(file.name)}
                          </div>
                          <h3 className="mt-1 font-medium line-clamp-1">
                            {file.name}
                          </h3>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{file.size}</span>
                            {file.shared && (
                              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                                <LinkIcon className="h-3 w-3" /> Shared
                              </span>
                            )}
                          </div>
                        </div>
                        <Star
                          className={`h-5 w-5 cursor-pointer ${
                            file.favorite
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground opacity-40 group-hover:opacity-100"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(file.id);
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
                          onClick={() => toggleFavorite(file.id)}
                        >
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
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
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
  );
}
