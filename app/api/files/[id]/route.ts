// app/api/files/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbAdmin, storageAdmin } from "../../../../lib/firebase-admin";

interface Context {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const docRef = dbAdmin.collection("uploadedFiles").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ ok: false, error: "File not found" }, { status: 404 });
    }

    const data = docSnap.data();
    return NextResponse.json({ ok: true, password: data?.password });
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json({ ok: false, error: "Failed to fetch file" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { stared } = await request.json();
  await dbAdmin.collection("uploadedFiles").doc(id).update({ stared });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { password } = await request.json();

  try {
    const docRef = dbAdmin.collection("uploadedFiles").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ ok: false, error: "File not found" }, { status: 404 });
    }

  
    await docRef.update({
      password: password || "",
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error setting password:", error);
    return NextResponse.json({ ok: false, error: "Failed to set password" }, { status: 500 });
  }
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