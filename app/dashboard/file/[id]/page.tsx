"use client";

import {
  ArrowLeft,
  Calendar,
  Download,
  Eye,
  FileText,
  ImageIcon,
  Lock,
  Star,
  Trash,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "../../../../components/dashboard-layout";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import ShareOptions from "../../../../components/share-options";
import { useToast } from "../../../../components/ui/use-toast";
import { useParams } from "next/navigation";

export default function FilePage() {
  const params = useParams();
  const id = params.id as string;

  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock file data
  const file = {
    id: id,
    name: "Project Presentation.pdf",
    type: "pdf",
    size: "4.2 MB",
    uploadedAt: "2 days ago",
    url: "#",
    color: "#5056FD",
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
      case "jpg":
      case "png":
        return <ImageIcon className="h-12 w-12 text-white" />;
      case "video":
      case "mp4":
        return <Video className="h-12 w-12 text-white" />;
      default:
        return <FileText className="h-12 w-12 text-white" />;
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? "File removed from bookmarks"
        : "File added to bookmarks for quick access",
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `https://stellar-sync.vercel.app/share/${file.id}`
    );
    toast({
      title: "Link copied",
      description: "File link copied to clipboard",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-10 w-10 rounded-full hover:bg-[#5056FD]/10"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{file.name}</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="md:col-span-2 overflow-hidden rounded-2xl border shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col">
                <div
                  className="flex h-48 items-center justify-center"
                  style={{ backgroundColor: file.color }}
                >
                  {getFileIcon(file.type)}
                </div>
                <div className="p-6">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-3 py-1 text-xs font-medium">
                      {file.type.toUpperCase()}
                    </div>
                    <div className="text-xl font-medium">{file.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {file.size} • Uploaded {file.uploadedAt}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button className="rounded-xl bg-[#5056FD] hover:bg-[#4045e0]">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl border-[#5056FD]/20 hover:bg-[#5056FD]/5 hover:text-[#5056FD]"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="overflow-hidden rounded-2xl border shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">File Actions</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={toggleFavorite}
                      className={`rounded-xl ${
                        isFavorite
                          ? "border-yellow-400 bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                          : "border-[#5056FD]/20 hover:bg-[#5056FD]/5 hover:text-[#5056FD]"
                      }`}
                    >
                      <Star
                        className={`mr-2 h-4 w-4 ${
                          isFavorite ? "fill-yellow-400 text-yellow-400" : ""
                        }`}
                      />
                      {isFavorite ? "Favorited" : "Favorite"}
                    </Button>

                    <Button
                      variant="outline"
                      className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="share" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl bg-[#5056FD]/5 p-1">
                <TabsTrigger
                  value="share"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#5056FD] data-[state=active]:shadow-sm"
                >
                  Share
                </TabsTrigger>
                <TabsTrigger
                  value="expiry"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#5056FD] data-[state=active]:shadow-sm"
                >
                  Expiry
                </TabsTrigger>
              </TabsList>
              <TabsContent value="share" className="mt-6">
                <ShareOptions fileId={file.id} />
              </TabsContent>
              <TabsContent value="expiry" className="mt-6">
                <Card className="overflow-hidden rounded-xl border shadow-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Set Expiry Date</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose when this shared file will expire
                      </p>
                    </div>
                    <div className="grid gap-3">
                      <Button
                        variant="outline"
                        className="justify-start rounded-lg border-[#5056FD]/20 hover:bg-[#5056FD]/5 hover:text-[#5056FD]"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Select Date
                      </Button>
                      <Button className="rounded-lg bg-[#5056FD] hover:bg-[#4045e0]">
                        Save Expiry Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
