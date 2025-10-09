import { UserProfile } from "@clerk/nextjs";
import DashboardLayout from "../../../../components/dashboard-layout";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { dbAdmin } from "../../../../lib/firebase-admin";
import { currentUser } from "@clerk/nextjs/server";
import {
  serializeUserData,
  getStorageLimit,
} from "../../../../utils/firestore-serializer";

export const dynamic = "force-dynamic";

export default async function UserProfilePage() {
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
      <div className="mx-auto flex justify-center items-center">
        <div className="mt-0 md:mt-10">
          <UserProfile path="/dashboard/user-profile" routing="path" />
        </div>
      </div>
    </DashboardLayout>
  );
}
