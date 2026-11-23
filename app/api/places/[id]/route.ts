import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

// PATCH /api/places/[id] - Update status, isFavorite, or details
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing place ID" }, { status: 400 });
    }

    const body = await request.json();
    const updateData: any = {};

    let existingPlace: { imageUrl: string } | null = null;
    if (body.imageUrl !== undefined) {
      updateData.imageUrl = body.imageUrl;
      existingPlace = await prisma.place.findUnique({
        where: { id },
        select: { imageUrl: true },
      });
    }

    if (body.status !== undefined) updateData.status = body.status;
    if (body.isFavorite !== undefined) updateData.isFavorite = Boolean(body.isFavorite);
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.country !== undefined) updateData.country = body.country.trim();
    if (body.category !== undefined) updateData.category = body.category.trim();
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.budget !== undefined) {
      updateData.budget = body.budget ? parseFloat(body.budget) : null;
    }
    if (body.targetYear !== undefined) {
      updateData.targetYear = body.targetYear ? parseInt(body.targetYear, 10) : null;
    }

    const updatedPlace = await prisma.place.update({
      where: { id },
      data: updateData,
    });

    // Clean up old local image file if a new image was uploaded and set
    if (
      existingPlace &&
      existingPlace.imageUrl &&
      existingPlace.imageUrl !== body.imageUrl &&
      existingPlace.imageUrl.startsWith("/uploads/")
    ) {
      try {
        const oldFileName = existingPlace.imageUrl.replace(/^\/uploads\//, "");
        const oldFilePath = path.join(process.cwd(), "public", "uploads", oldFileName);
        await unlink(oldFilePath);
      } catch (err) {
        console.warn("Could not delete old image:", err);
      }
    }

    return NextResponse.json(updatedPlace, { status: 200 });
  } catch (error: any) {
    console.error("Error updating place:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update place." },
      { status: 500 }
    );
  }
}

// DELETE /api/places/[id] - Delete record and remove image file from /public/uploads/
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing place ID" }, { status: 400 });
    }

    const existingPlace = await prisma.place.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (!existingPlace) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    // Delete record from database
    await prisma.place.delete({
      where: { id },
    });

    // Remove local file if it resides in /public/uploads/
    if (existingPlace.imageUrl && existingPlace.imageUrl.startsWith("/uploads/")) {
      const fileName = existingPlace.imageUrl.replace(/^\/uploads\//, "");
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      try {
        await unlink(filePath);
      } catch (fileErr) {
        console.warn("Could not delete local file:", filePath, fileErr);
      }
    }

    return NextResponse.json(
      { success: true, message: "Place deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting place:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete place." },
      { status: 500 }
    );
  }
}
