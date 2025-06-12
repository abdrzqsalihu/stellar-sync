import { Metadata } from "next";
import DashboardLayout from "../../../components/dashboard-layout";
import FileGrid from "../../../components/file-grid";
import UploadButton from "../../../components/upload-button";
import { Button } from "../../../components/ui/button";
import { FolderPlus } from "lucide-react";
import { getEmailFromUserId } from "../../../lib/getEmailFromUserId";
import { getFileTypesByCategory } from "../../../lib/fileTypes";
import { dbAdmin } from "../../../lib/firebase-admin";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "StellarSync | All Files",
};

export const dynamic = "force-dynamic";

export default async function FilesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  await headers();
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  const resolvedSearchParams = await searchParams;

  if (!userId) {
    return (
      <DashboardLayout>
        <p className="p-6"></p>
        <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
          <p className="text-lg font-medium">Not signed in.</p>
        </div>
      </DashboardLayout>
    );
  }

  const email = await getEmailFromUserId(userId);
  const category = resolvedSearchParams.category || null;
  const fileTypes = getFileTypesByCategory(category);

  // Server-side fetch
  let files: Array<any> = [];
  const base = dbAdmin
    .collection("uploadedFiles")
    .where("userEmail", "==", email);

  if (fileTypes) {
    for (const type of fileTypes) {
      const snap = await base.where("fileType", "==", type).get();
      snap.docs.forEach((d) => files.push({ id: d.id, ...d.data() }));
    }
  } else {
    const snap = await base.get();
    snap.docs.forEach((d) => files.push({ id: d.id, ...d.data() }));
  }

  const titleMap: Record<string, string> = {
    document: "Documents",
    image: "Images",
    audio: "Audios",
    video: "Videos",
    design: "Designs",
  };
  const pageTitle = category ? titleMap[category] || "All Files" : "All Files";

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground">
            {category
              ? `View and manage your ${pageTitle.toLowerCase()}.`
              : "View and manage all your files in one place."}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <UploadButton />
            <Button
              variant="outline"
              size="sm"
              className="group h-10 gap-2 rounded-md border-dashed hover:border-primary hover:bg-primary/5"
            >
              <FolderPlus className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-primary" />
              <span className="group-hover:text-primary">New Folder</span>
            </Button>
          </div>
        </div>
        <FileGrid fileList={files} view="all" />
      </div>
    </DashboardLayout>
  );
}
