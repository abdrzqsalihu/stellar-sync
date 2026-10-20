import { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import DashboardLayout from "../../../components/dashboard-layout";
import FileSkeleton from "../../../components/FileSkeleton";
import SearchContent from "../../../components/pages/search";
import { redirect } from "next/navigation";
import { dbAdmin } from "../../../lib/firebase-admin";
import { currentUser } from "@clerk/nextjs/server";
import {
  getStorageLimit,
  serializeUserData,
} from "../../../utils/firestore-serializer";

export const metadata: Metadata = {
  title: "StellarSync | Search",
};

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    redirect("/sign-in");
  }

  const userDoc = await dbAdmin.collection("users").doc(userId).get();
  let userData = null;
  if (userDoc.exists) {
    const rawUserData = userDoc.data();
    userData = serializeUserData({
      id: userDoc.id,
      ...rawUserData,
    });
  } else {
    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }
    const newUserData = {
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      email: user.emailAddresses[0]?.emailAddress,
      createdAt: new Date(),
      storageUsed: 0,
      subscriptionStatus: "free",
      plan: "Free",
      storageLimit: getStorageLimit("free"),
      updatedAt: new Date(),
    };

    await dbAdmin.collection("users").doc(user.id).set(newUserData);

    userData = serializeUserData({
      id: user.id,
      ...newUserData,
    });
  }

  return (
    <DashboardLayout userData={userData}>
      <Suspense fallback={<FileSkeleton />}>
        <SearchContent userId={userId} searchParams={searchParams} />
      </Suspense>
    </DashboardLayout>
  );
}
