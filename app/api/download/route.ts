import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const fileUrl = req.nextUrl.searchParams.get("url");

  if (!fileUrl) {
    return NextResponse.json({ error: "Missing file URL" }, { status: 400 });
  }

  try {
    
    const parsedUrl = new URL(fileUrl);
     const allowedHosts = (process.env.ALLOWED_DOWNLOAD_HOSTS ?? "")
      .split(",")
      .map((host) => host.trim())
      .filter(Boolean);
    if (allowedHosts.length > 0 && !allowedHosts.includes(parsedUrl.host)) {
      return NextResponse.json(
        { error: "File host not allowed" },
        { status: 400 }
      );
    }
    
     const response = await fetch(parsedUrl.toString());

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch file: ${response.statusText}` }, { status: 500 });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await response.arrayBuffer();

    // Extract filename from URL or Content-Disposition header
    let filename = "downloaded-file";
    
    // Try to get filename from Content-Disposition header
    const contentDisposition = response.headers.get("content-disposition");
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    
    // If no filename in header, try to extract from URL
    if (filename === "downloaded-file") {
      const urlFilename = new URL(fileUrl).pathname.split('/').pop();
      if (urlFilename) {
        // Remove query parameters if present
        filename = urlFilename.split('?')[0];
      }
    }

    // Optional: Log or validate
    // console.log("Fetched file of type:", contentType, "and size:", arrayBuffer.byteLength, "with filename:", filename);

    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
  }
}