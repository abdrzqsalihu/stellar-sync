import Link from "next/link";
import Image from "next/image";
import { dbAdmin } from "../../../lib/firebase-admin";
import FileItem from "./_components/FileItem";
import ExpiredLink from "./_components/ExpiredLink";

// Public share link: resolved server-side so an expired link never sends the
// file's download URL to the browser in the first place.
export default async function FileView({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  const { fileId } = await params;

  const docSnap = await dbAdmin.collection("uploadedFiles").doc(fileId).get();

  let content;
  if (!docSnap.exists) {
    content = <ExpiredLink reason="not-found" />;
  } else {
    const data = docSnap.data();
    const expiresAt: string | null = data?.shareExpiresAt ?? null;
    const isExpired = !!expiresAt && new Date(expiresAt).getTime() <= Date.now();

    if (isExpired) {
      content = <ExpiredLink reason="expired" expiresAt={expiresAt} />;
    } else {
      content = (
        <FileItem
          file={{
            id: fileId,
            fileName: data?.fileName ?? "",
            fileType: data?.fileType ?? "",
            fileSize: data?.fileSize ?? 0,
            userName: data?.userName ?? "",
            password: data?.password ?? "",
          }}
        />
      );
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen w-full flex justify-center items-center flex-col gap-4 p-4">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="logo"
          width={150}
          height={150}
          className="mb-4"
        />
      </Link>
      {content}
    </div>
  );
}
