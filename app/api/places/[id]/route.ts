import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";

async function deleteBlobIfRemote(url: string | null | undefined) {
  if (!url || !url.startsWith("https://")) return;
  try {
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch (err) {
    console.warn("Could not delete blob:", url, err);
  }
}

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

    // Clean up old Vercel Blob image if a new image was uploaded and set
    if (
      existingPlace &&
      existingPlace.imageUrl &&
      existingPlace.imageUrl !== body.imageUrl
    ) {
      await deleteBlobIfRemote(existingPlace.imageUrl);
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

// DELETE /api/places/[id] - Delete record and remove image from Vercel Blob
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

    // Remove remote blob if imageUrl is an HTTPS URL
    await deleteBlobIfRemote(existingPlace.imageUrl);

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
