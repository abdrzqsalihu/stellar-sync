// FilesPage.tsx
import { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import DashboardLayout from "../../../components/dashboard-layout";
import FileSkeleton from "../../../components/FileSkeleton";
import FilesContent from "../../../components/pages/all-files";

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

  return (
    <DashboardLayout>
      <Suspense fallback={<FileSkeleton />}>
        <FilesContent userId={userId} searchParams={searchParams} />
      </Suspense>
    </DashboardLayout>
  );
}
