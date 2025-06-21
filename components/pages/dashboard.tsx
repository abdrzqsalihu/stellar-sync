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
    (file) => file.starred || file.isStarred
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">Recent Files</h2>
            <div className="flex gap-2">
              <UploadButton />
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
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </div>
                    <span>Advanced sharing options</span>
                  </li>
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
                        <rect
                          width="18"
                          height="11"
                          x="3"
                          y="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <span>No expiry on shared files</span>
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
