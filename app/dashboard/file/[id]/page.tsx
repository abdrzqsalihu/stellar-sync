import { Metadata } from "next";
import {
  ArrowLeft,
  Calendar,
  Download,
  Eye,
  FileText,
  ImageIcon,
  Video,
} from "lucide-react";
import Link from "next/link";
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
import { getEmailFromUserId } from "../../../../lib/getEmailFromUserId";
import { dbAdmin } from "../../../../lib/firebase-admin";
import { headers } from "next/headers";
import FileActionsClient from "../../../../components/file-actions";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import {
  getStorageLimit,
  serializeUserData,
} from "../../../../utils/firestore-serializer";

export const metadata: Metadata = {
  title: "StellarSync | File Details",
};

export const dynamic = "force-dynamic";

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
  userEmail?: string;
}

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

export default async function FilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // await headers();
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  const resolvedParams = await params;
  const fileId = resolvedParams.id;

  const userDoc = await dbAdmin.collection("users").doc(userId).get();
  // const userData = userDoc.exists ? userDoc.data() : null;
  let userData = null;
  if (userDoc.exists) {
    const rawUserData = userDoc.data();
    // Use the robust serializer that handles ALL Firestore types
    userData = serializeUserData({
      id: userDoc.id,
      ...rawUserData,
    });
  } else {
    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }
    // Create user document if it doesn't exist - Free plan gets 1GB
    const newUserData = {
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      email: user.emailAddresses[0]?.emailAddress,
      createdAt: new Date(),
      storageUsed: 0,
      subscriptionStatus: "free",
      plan: "Free",
      storageLimit: getStorageLimit("free"), // 1GB
      updatedAt: new Date(),
    };

    await dbAdmin.collection("users").doc(user.id).set(newUserData);

    // Serialize the new user data too
    userData = serializeUserData({
      id: user.id,
      ...newUserData,
    });
  }

  if (!userId) {
    return (
      <DashboardLayout userData={userData}>
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-10 w-10 rounded-full hover:bg-[#5056FD]/10"
            >
              <Link href="/dashboard/all-files">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          </div>
          <Card className="overflow-hidden rounded-2xl border shadow-md">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You need to be signed in to view this file.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/dashboard/all-files">Back to All Files</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const email = await getEmailFromUserId(userId);

  // Server-side fetch
  let file: FileType | null = null;
  let error: string | null = null;

  try {
    const docRef = dbAdmin.collection("uploadedFiles").doc(fileId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      error = "File not found";
    } else {
      const fileData = docSnap.data() as FileType;

      // Check if the user owns this file
      if (fileData.userEmail !== email) {
        error = "You don't have permission to access this file";
      } else {
        file = {
          id: docSnap.id,
          ...fileData,
        };
      }
    }
  } catch (err) {
    console.error("Error fetching file:", err);
    error = "Failed to load file data";
  }

  // Handle error state
  if (error || !file) {
    return (
      <DashboardLayout userData={userData}>
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-10 w-10 rounded-full hover:bg-[#5056FD]/10"
            >
              <Link href="/dashboard/all-files">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              File Not Found
            </h1>
          </div>
          <Card className="overflow-hidden rounded-2xl border shadow-md">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {error || "The requested file could not be found."}
                </p>
                <Button asChild className="mt-4">
                  <Link href="/dashboard/all-files">Back to All Files</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userData={userData}>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-10 w-10 rounded-full hover:bg-[#5056FD]/10"
          >
            <Link href="/dashboard/all-files">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{file.fileName}</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="md:col-span-2 overflow-hidden rounded-2xl border shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col">
                <div className="flex h-48 items-center justify-center bg-[#5056FD]">
                  {getFileIcon(file.fileType)}
                </div>
                <div className="p-6">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-3 py-1 text-xs font-medium">
                      {file.fileType.toUpperCase()}
                    </div>
                    <div className="text-xl font-medium">{file.fileName}</div>
                    <div className="text-sm text-muted-foreground">
                      {(file.fileSize / 1024 / 1024).toFixed(2)}MB • Uploaded{" "}
                      {file.uploadedAt}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <a
                        href={file.fileUrl}
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
                          file.fileUrl
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
            <FileActionsClient fileId={file.id} initialStarred={file.stared} />

            <Tabs defaultValue="share" className="w-full">
              <TabsList className="grid w-full grid-cols-1 rounded-xl bg-[#5056FD]/5 p-1">
                <TabsTrigger
                  value="share"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#5056FD] data-[state=active]:shadow-sm"
                >
                  Share
                </TabsTrigger>
                <TabsTrigger
                  value="expiry"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#5056FD] data-[state=active]:shadow-sm hidden"
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
