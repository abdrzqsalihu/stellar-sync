import FileStats from "../file-stats";
import UploadButton from "../upload-button";
import RecentFiles from "../recent-files";
import StorageStats from "../storage-stats";
import { getEmailFromUserId } from "../../lib/getEmailFromUserId";
import { dbAdmin } from "../../lib/firebase-admin";
import { clerkClient } from "@clerk/nextjs";
import UpgradePlan from "../upgrade-plan";

interface DashboardContentProps {
  userId: string;
}

export default async function DashboardContent({
  userId,
}: DashboardContentProps) {
  const email = await getEmailFromUserId(userId);
  const user = await clerkClient.users.getUser(userId);
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  async function ensureUserDocument(
    userId: string,
    email: string,
    fullName: string = ""
  ) {
    const userRef = dbAdmin.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      await userRef.set({
        fullName,
        email,
        storageUsed: 0,
        storageLimit: 1073741824, // 1GB
        plan: "free",
        createdAt: new Date().toISOString(),
      });
      console.log("Created user doc for:", email);
    }

    const userData = (await userRef.get()).data();
    if (!userData?.storageUsed || userData.storageUsed === 0) {
      const filesSnap = await dbAdmin
        .collection("uploadedFiles")
        .where("userEmail", "==", email)
        .get();

      const totalSize = filesSnap.docs.reduce((sum, doc) => {
        const file = doc.data();
        return sum + (file.fileSize || 0);
      }, 0);

      await userRef.update({
        storageUsed: totalSize,
      });

      console.log(`Backfilled storageUsed for ${email}: ${totalSize} bytes`);
    }
  }
  await ensureUserDocument(userId, email, fullName);

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

  const userDoc = await dbAdmin.collection("users").doc(userId).get();
  const userData = userDoc.exists ? userDoc.data() : null;

  const storageUsed = userData?.storageUsed ?? 0;
  const storageLimit = userData?.storageLimit ?? 1073741824; // default 1GB

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
          <StorageStats
            files={files}
            storageUsed={storageUsed}
            storageLimit={storageLimit}
          />

          <UpgradePlan
            userId={user.id}
            email={email}
            name={fullName}
            isPro={userData?.plan === "pro"}
          />
        </div>
      </div>
    </div>
  );
}
