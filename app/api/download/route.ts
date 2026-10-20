import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "../../../lib/firebase-admin";

// ASCII fallback plus RFC 5987 filename* so the exact name survives; strips header-breaking chars
function contentDispositionFor(filename: string): string {
  const clean = filename.replace(/[\r\n\\/]/g, "");
  const fallback = clean.replace(/[^\x20-\x7e]/g, "_").replace(/["%]/g, "_");
  const encoded = encodeURIComponent(clean).replace(
    /['()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

async function fetchAndStream(fileUrl: string, filename: string) {
  const parsedUrl = new URL(fileUrl);
  const allowedHosts = (process.env.ALLOWED_DOWNLOAD_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);
  if (allowedHosts.length > 0 && !allowedHosts.includes(parsedUrl.host)) {
    return NextResponse.json({ error: "File host not allowed" }, { status: 400 });
  }

  const response = await fetch(parsedUrl.toString());
  if (!response.ok) {
    return NextResponse.json(
      { error: `Failed to fetch file: ${response.statusText}` },
      { status: 500 }
    );
  }

  const contentType = response.headers.get("content-type") || "application/octet-stream";
  const arrayBuffer = await response.arrayBuffer();

  return new NextResponse(Buffer.from(arrayBuffer), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDispositionFor(filename),
      "Content-Length": arrayBuffer.byteLength.toString(),
    },
  });
}

export async function GET(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get("fileId");

  // Public share-link path: looks the file up server-side so expiration can be
  // enforced before any bytes are fetched. The filename also comes from the
  // trusted Firestore record, never from the client.
  if (fileId) {
    try {
      const docSnap = await dbAdmin.collection("uploadedFiles").doc(fileId).get();
      if (!docSnap.exists) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      const data = docSnap.data();
      const expiresAt = data?.shareExpiresAt;
      if (expiresAt && new Date(expiresAt).getTime() <= Date.now()) {
        return NextResponse.json({ error: "This link has expired" }, { status: 410 });
      }
      if (!data?.fileUrl) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      return fetchAndStream(data.fileUrl, data.fileName || "downloaded-file");
    } catch (error) {
      console.error("Error downloading shared file:", error);
      return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
    }
  }

  const fileUrl = req.nextUrl.searchParams.get("url");

  if (!fileUrl) {
    return NextResponse.json({ error: "Missing file URL" }, { status: 400 });
  }

  try {
    // Extract filename from the client-supplied name, falling back to the URL
    let filename = "downloaded-file";

    const requestedName = req.nextUrl.searchParams.get("name")?.trim();
    if (requestedName) {
      filename = requestedName;
    } else {
      const urlFilename = new URL(fileUrl).pathname.split("/").pop();
      if (urlFilename) {
        filename = urlFilename.split("?")[0];
      }
    }

    return await fetchAndStream(fileUrl, filename);
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
  }
}