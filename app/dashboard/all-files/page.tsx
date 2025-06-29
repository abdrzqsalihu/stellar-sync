// FilesPage.tsx
import { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import DashboardLayout from "../../../components/dashboard-layout";
import FileSkeleton from "../../../components/FileSkeleton";
import FilesContent from "../../../components/pages/all-files";
import { redirect } from "next/navigation";
import { dbAdmin } from "../../../lib/firebase-admin";

export const metadata: Metadata = {
  title: "StellarSync | All Files",
};

export const dynamic = "force-dynamic";

interface FilesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function FilesPage({ searchParams }: FilesPageProps) {
  await headers();
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  // if (!userId) {
  //   return (
  //     <DashboardLayout>
  //       <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
  //         <p className="text-lg font-medium">Not signed in.</p>
  //       </div>
  //     </DashboardLayout>
  //   );
  // }

  if (!userId) {
    redirect("/sign-in");
  }

  const userDoc = await dbAdmin.collection("users").doc(userId).get();
  const userData = userDoc.exists ? userDoc.data() : null;

  return (
    <DashboardLayout userData={userData}>
      <Suspense fallback={<FileSkeleton />}>
        <FilesContent userId={userId} searchParams={searchParams} />
      </Suspense>
    </DashboardLayout>
  );
}
