import { Metadata } from "next";
import DashboardLayout from "../../../components/dashboard-layout";
import FileGrid from "../../../components/file-grid";
import { getEmailFromUserId } from "../../../lib/getEmailFromUserId";
import { dbAdmin } from "../../../lib/firebase-admin";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "StellarSync | Shared",
};

export const dynamic = "force-dynamic";

export default async function SharedPage() {
  await headers();
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

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

  let files: Array<any> = [];
  const base = dbAdmin
    .collection("uploadedFiles")
    .where("userEmail", "==", email);

  const snap = await base.get();
  snap.docs.forEach((d) => files.push({ id: d.id, ...d.data() }));

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Shared Files</h1>
          <p className="text-muted-foreground">
            Manage files you've shared with others.
          </p>
        </div>

        <FileGrid
          fileList={files.filter((file) => file.shared)}
          view="shared"
        />
      </div>
    </DashboardLayout>
  );
}
