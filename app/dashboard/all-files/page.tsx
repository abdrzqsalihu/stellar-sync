// FilesPage.tsx
import { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import DashboardLayout from "../../../components/dashboard-layout";
import FileSkeleton from "../../../components/FileSkeleton";
import FilesContent from "../../../components/pages/all-files";
import { redirect } from "next/navigation";
import { dbAdmin } from "../../../lib/firebase-admin";
import {
  getStorageLimit,
  serializeUserData,
} from "../../../utils/firestore-serializer";
import { currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "StellarSync | All Files",
};

export const dynamic = "force-dynamic";

interface FilesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function FilesPage({ searchParams }: FilesPageProps) {
  // await headers();
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
  // const userData = userDoc.exists ? userDoc.data() : null;
  let userData = null;
  if (userDoc.exists) {
    const rawUserData = userDoc.data();
    // Use the robust serializer that handles ALL Firestore types
    userData = serializeUserData({
      id: userDoc.id,
      ...rawUserData,
    });
  } else {
    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }
    // Create user document if it doesn't exist - Free plan gets 1GB
    const newUserData = {
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      email: user.emailAddresses[0]?.emailAddress,
      createdAt: new Date(),
      storageUsed: 0,
      subscriptionStatus: "free",
      plan: "Free",
      storageLimit: getStorageLimit("free"), // 1GB
      updatedAt: new Date(),
    };

    await dbAdmin.collection("users").doc(user.id).set(newUserData);

    // Serialize the new user data too
    userData = serializeUserData({
      id: user.id,
      ...newUserData,
    });
  }

  return (
    <DashboardLayout userData={userData}>
      <Suspense fallback={<FileSkeleton />}>
        <FilesContent userId={userId} searchParams={searchParams} />
      </Suspense>
    </DashboardLayout>
  );
}
