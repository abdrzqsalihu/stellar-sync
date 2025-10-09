import { clerkClient } from "@clerk/nextjs";

export async function getEmailFromUserId(userId: string) {
  const user = await clerkClient.users.getUser(userId);
  // assumes at least one verified address
  return user.emailAddresses[0].emailAddress;
}
