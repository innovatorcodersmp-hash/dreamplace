import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;

    const updatedPlace = await prisma.place.update({
      where: { id },
      data: updateData,
    });

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

    await prisma.place.delete({
      where: { id },
    });

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

