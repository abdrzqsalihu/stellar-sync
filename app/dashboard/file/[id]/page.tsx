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
import { useEffect, useState } from "react";
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
import { useParams } from "next/navigation";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "../../../../firebaseConfig";
import toast from "react-hot-toast";

interface FileType {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  stared: boolean;
  uploadedAt: string;
  shared?: boolean;
  password?: string;
}

export default function FilePage() {
  const params = useParams();
  const id = params.id as string;

  const [isFavorite, setIsFavorite] = useState(false);
  const db = getFirestore(app);
  const [file, setFile] = useState<FileType | undefined>(undefined);

  useEffect(() => {
    // console.log(params?.fileId);
    params?.id && getFileInfo();
  }, []);

  const getFileInfo = async () => {
    const docRef = doc(db, "uploadedFiles", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setFile(docSnap.data() as any);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const onPasswordSave = async (password) => {
    const docRef = doc(db, "uploadedFiles", id);
    await updateDoc(docRef, {
      password: password,
    });
  };

  const updateShared = async () => {
    const docRef = doc(db, "uploadedFiles", id);
    // Assuming `shared` is the correct property name
    await updateDoc(docRef, {
      shared: true, // Toggle the value of `shared`
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image/png":
      case "image/jpg":
      case "image/jpeg":
      case "image/gif":
      case "image/svg":
      case "image/webp":
      case "image/bmp":
        return <ImageIcon className="h-12 w-12 text-white" />;
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
        return <Video className="h-12 w-12 text-white" />;
      case "application/pdf":
        return <FileText className="h-12 w-12 text-white" />;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FileText className="h-12 w-12 text-white" />;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return <FileText className="h-12 w-12 text-white" />;
      default:
        return <FileText className="h-12 w-12 text-white" />;
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? "File removed from favorites" : "File added to favorites"
    );
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
          <h1 className="text-2xl font-bold tracking-tight">
            {file?.fileName}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="md:col-span-2 overflow-hidden rounded-2xl border shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col">
                <div className="flex h-48 items-center justify-center bg-[#5056FD]">
                  {getFileIcon(file?.fileType)}
                </div>
                <div className="p-6">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-3 py-1 text-xs font-medium">
                      {file?.fileType.toUpperCase()}
                    </div>
                    <div className="text-xl font-medium">{file?.fileName}</div>
                    <div className="text-sm text-muted-foreground">
                      {(file?.fileSize / 1024 / 1024).toFixed(2)}MB • Uploaded{" "}
                      {file?.uploadedAt}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <a
                        href={file?.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="rounded-xl bg-[#5056FD] hover:bg-[#4045e0]">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </a>
                      <a
                        href={`/api/download?url=${encodeURIComponent(
                          file?.fileUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          className="rounded-xl border-[#5056FD]/20 hover:bg-[#5056FD]/5 hover:text-[#5056FD]"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </a>
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
                <ShareOptions fileId={file?.id} />
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
