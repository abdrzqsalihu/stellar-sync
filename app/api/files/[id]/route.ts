// app/api/files/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbAdmin, storageAdmin } from "../../../../lib/firebase-admin";

interface Context {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { stared } = await request.json();
  await dbAdmin.collection("uploadedFiles").doc(id).update({ stared });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;  
  const docRef = dbAdmin.collection("uploadedFiles").doc(id);
  const docSnap = await docRef.get();
  
  if (!docSnap.exists) {
    return NextResponse.json({ ok: false, error: "File not found" }, { status: 404 });
  }

  const data = docSnap.data();
  const fileUrl: string | undefined = data?.fileUrl;
  const fileName: string | undefined = data?.fileName;
  let storageDeleted = false;

  try {
    const bucket = storageAdmin.bucket(process.env.FIREBASE_STORAGE_BUCKET);
    if (fileUrl) {
      const url = new URL(fileUrl);
      const match = decodeURIComponent(url.pathname).match(/\/o\/(.+?)(?:\?|$)/);
      if (match?.[1]) {
        await bucket.file(match[1]).delete();
        storageDeleted = true;
      }
    } else if (fileName) {
      await bucket.file(`uploadedFiles/${fileName}`).delete();
      storageDeleted = true;
    }
  } catch (err: any) {
    console.error("Storage deletion failed:", err);
  }

  await docRef.delete();
  return NextResponse.json({ ok: true, storageDeleted });
}