import { Metadata } from "next";
import { Suspense } from "react";
import DashboardLayout from "../../components/dashboard-layout";
import { headers } from "next/headers";

import DashboardSkeleton from "../../components/DashboardSkeleton";
import DashboardContent from "../../components/pages/dashboard";

export const metadata: Metadata = {
  title: "StellarSync | Dashboard",
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
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent userId={userId} />
      </Suspense>
    </DashboardLayout>
  );
}
