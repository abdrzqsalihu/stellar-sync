import { Metadata } from "next";
import { Suspense } from "react";

import { headers } from "next/headers";
import DashboardLayout from "../../../components/dashboard-layout";
import FileSkeleton from "../../../components/FileSkeleton";
import FavoriteContent from "../../../components/pages/favorites";

export const metadata: Metadata = {
  title: "StellarSync | Favorites",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await headers();
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    return (
      <DashboardLayout>
        <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
          <p className="text-lg font-medium">Not signed in.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Suspense fallback={<FileSkeleton />}>
        <FavoriteContent userId={userId} />
      </Suspense>
    </DashboardLayout>
  );
}
