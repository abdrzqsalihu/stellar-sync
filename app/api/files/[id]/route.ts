import { NextRequest, NextResponse } from "next/server";
import { dbAdmin, storageAdmin } from "../../../../lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

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
    return NextResponse.json({
      ok: true,
      password: data?.password,
      shareExpiresAt: data?.shareExpiresAt ?? null,
    });
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
  const body = await request.json();
  const { password } = body;
  // Distinguish "field omitted" from "field explicitly set to null" (clear expiration)
  const hasExpiryField = Object.prototype.hasOwnProperty.call(body, "shareExpiresAt");
  const shareExpiresAt = body.shareExpiresAt;

  try {
    const docRef = dbAdmin.collection("uploadedFiles").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ ok: false, error: "File not found" }, { status: 404 });
    }

    const update: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (password !== undefined) {
      update.password = password || "";
    }

    if (hasExpiryField) {
      if (shareExpiresAt === null || shareExpiresAt === "") {
        update.shareExpiresAt = null;
      } else {
        const parsed = new Date(shareExpiresAt);
        if (isNaN(parsed.getTime())) {
          return NextResponse.json(
            { ok: false, error: "Invalid expiration date" },
            { status: 400 }
          );
        }
        if (parsed.getTime() <= Date.now()) {
          return NextResponse.json(
            { ok: false, error: "Expiration date must be in the future" },
            { status: 400 }
          );
        }
        update.shareExpiresAt = parsed.toISOString();
      }
      // Configuring share settings marks the file as actively shared,
      // consistent with the existing "shared: true" side effect in /api/send-email
      update.shared = true;
    }

    await docRef.update(update);

    return NextResponse.json({ ok: true, shareExpiresAt: update.shareExpiresAt });
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json({ ok: false, error: "Failed to update file" }, { status: 500 });
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
   const fileSize: number = data?.fileSize ?? 0;
  const userEmail: string = data?.userEmail;
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

   if (userEmail && fileSize > 0) {
    const userSnap = await dbAdmin
      .collection("users")
      .where("email", "==", userEmail)
      .limit(1)
      .get();

    const userDoc = userSnap.docs[0];
    if (userDoc?.exists) {
      await userDoc.ref.update({
        storageUsed: FieldValue.increment(-fileSize),
      });
    }
  }


  await docRef.delete();
  return NextResponse.json({ ok: true, storageDeleted });
}