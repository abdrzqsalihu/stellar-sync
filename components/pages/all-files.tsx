import { getFileTypesByCategory } from "../../lib/fileTypes";
import { dbAdmin } from "../../lib/firebase-admin";
import { getEmailFromUserId } from "../../lib/getEmailFromUserId";
import UploadButton from "../upload-button";
import FileGrid from "../file-grid";

interface FileContentProps {
  userId: string;
  searchParams: Promise<{ category?: string }>;
}

export default async function FilesContent({
  userId,
  searchParams,
}: FileContentProps) {
  const resolvedSearchParams = await searchParams;
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
          <UploadButton hasFiles={true} />
          {/* <Button
            variant="outline"
            size="sm"
            className="group h-10 gap-2 rounded-md border-dashed hover:border-primary hover:bg-primary/5"
          >
            <FolderPlus className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-primary" />
            <span className="group-hover:text-primary">New Folder</span>
          </Button> */}
        </div>
      </div>
      <FileGrid fileList={files} view="all" />
    </div>
  );
}
