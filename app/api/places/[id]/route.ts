import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";

function isVercelBlobUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return (
    url.includes(".public.blob.vercel-storage.com") ||
    url.includes("blob.vercel-storage.com")
  );
}

// PATCH /api/places/[id] - Update status, isFavorite, or other place details
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

    // Clean up old Vercel Blob image if a new image was uploaded and set
    if (
      existingPlace &&
      existingPlace.imageUrl &&
      existingPlace.imageUrl !== body.imageUrl &&
      isVercelBlobUrl(existingPlace.imageUrl)
    ) {
      try {
        await del(existingPlace.imageUrl);
      } catch (blobError) {
        console.error("Failed to delete old blob from Vercel Blob storage:", blobError);
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

// DELETE /api/places/[id] - Remove place from database
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

    await prisma.place.delete({
      where: { id },
    });

    // Clean up Vercel Blob storage if image was hosted on Vercel Blob
    if (isVercelBlobUrl(existingPlace.imageUrl)) {
      try {
        await del(existingPlace.imageUrl);
      } catch (blobError) {
        console.error("Failed to delete blob from Vercel Blob storage:", blobError);
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
