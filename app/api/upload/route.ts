import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// POST /api/upload - Multipart Form Data upload to Vercel Blob
export async function POST(request: NextRequest) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN is not configured" },
        { status: 500 }
      );
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in request" },
        { status: 400 }
      );
    }

    // Sanitize filename and create unique timestamped blob pathname
    const originalName = file.name || "place.jpg";
    const cleanFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const pathname = `places/${Date.now()}-${cleanFileName}`;

    const blob = await put(pathname, file, {
      access: "public",
      token,
    });

    return NextResponse.json(
      {
        success: true,
        url: blob.url,
        filename: cleanFileName,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Vercel Blob upload failed:", error);
    return NextResponse.json(
      { error: error?.message || "File upload failed" },
      { status: 500 }
    );
  }
}
