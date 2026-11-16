import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in request" },
        { status: 400 }
      );
    }

    // Sanitize filename and create unique pathname: places/${Date.now()}-${cleanFileName}
    const cleanFileName = (file.name || "place.jpg").replace(/[^a-zA-Z0-9.-]/g, "_");
    const pathname = `places/${Date.now()}-${cleanFileName}`;

    // Upload to Vercel Blob storage with public access
    const blob = await put(pathname, file, {
      access: "public",
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
    console.error("Failed to upload image to Vercel Blob:", error);
    return NextResponse.json(
      { error: error?.message || "File upload failed" },
      { status: 500 }
    );
  }
}
