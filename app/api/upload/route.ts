import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique timestamped name
    const cleanFileName = (file.name || "place.jpg").replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${Date.now()}-${cleanFileName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    const fullFilePath = path.join(uploadDir, uniqueFilename);
    await writeFile(fullFilePath, buffer);

    return NextResponse.json(
      { 
        success: true, 
        url: `/uploads/${uniqueFilename}`,
        filename: uniqueFilename 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to upload image:", error);
    return NextResponse.json(
      { error: error?.message || "File upload failed" },
      { status: 500 }
    );
  }
}

