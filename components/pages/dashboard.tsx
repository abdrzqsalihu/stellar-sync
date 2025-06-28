import { FolderPlus } from "lucide-react";
import FileStats from "../file-stats";
import { Button } from "../ui/button";
import UploadButton from "../upload-button";
import RecentFiles from "../recent-files";
import StorageStats from "../storage-stats";
import { getEmailFromUserId } from "../../lib/getEmailFromUserId";
import { dbAdmin } from "../../lib/firebase-admin";

interface DashboardContentProps {
  userId: string;
}

export default async function DashboardContent({
  userId,
}: DashboardContentProps) {
  const email = await getEmailFromUserId(userId);

  let files: Array<any> = [];
  const base = dbAdmin
    .collection("uploadedFiles")
    .where("userEmail", "==", email);

  const snap = await base.get();
  snap.docs.forEach((d) => files.push({ id: d.id, ...d.data() }));

  // Calculate file counts
  const allFilesCount = files.length;
  const staredFilesCount = files.filter(
    (file) => file.stared || file.isStarred
  ).length;
  const sharedFilesCount = files.filter(
    (file) =>
      file.shared ||
      file.isShared ||
      (file.sharedWith && file.sharedWith.length > 0)
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to your file storage dashboard.
        </p>
      </div>

      <FileStats
        allFilesCount={allFilesCount}
        staredFilesCount={staredFilesCount}
        sharedFilesCount={sharedFilesCount}
      />

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex-1 space-y-6">
          {allFilesCount > 0 && (
            <div className="flex gap-4 sm:flex-row items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Files</h2>
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
          )}

          <RecentFiles fileList={files} />
        </div>

        <div className="w-full md:w-80 space-y-6">
          <StorageStats files={files} totalStorage={1} />

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="bg-primary/5 p-6">
              <div className="flex flex-col space-y-1.5">
                <h3 className="font-semibold leading-none tracking-tight">
                  Upgrade to Pro
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get more storage and premium features
                </p>
              </div>
              <div className="mt-6 space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3 text-primary"
                      >
                        <path d="M2 20h20V8H2z" />
                        <path d="M12 4v4" />
                        <path d="M10 4h4" />
                      </svg>
                    </div>
                    <span>4GB Storage</span>
                  </li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
