import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/places - List all places ordered by createdAt desc
export async function GET() {
  try {
    const places = await prisma.place.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(places, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving places:", error);
    return NextResponse.json(
      { error: "Could not retrieve places from database." },
      { status: 500 }
    );
  }
}

// POST /api/places - Validate and create new place record in PostgreSQL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      country,
      category,
      targetYear,
      budget,
      status = "WISHLIST",
      isFavorite = false,
      imageUrl,
      notes,
    } = body;

    if (!title || !country || !category || !imageUrl) {
      return NextResponse.json(
        { error: "Title, Country, Category, and Image are required fields." },
        { status: 400 }
      );
    }

    const newPlace = await prisma.place.create({
      data: {
        title: title.trim(),
        country: country.trim(),
        category: category.trim(),
        targetYear: targetYear ? parseInt(targetYear, 10) : null,
        budget: budget ? parseFloat(budget) : null,
        status: status || "WISHLIST",
        isFavorite: Boolean(isFavorite),
        imageUrl: imageUrl.trim(),
        notes: notes ? notes.trim() : null,
      },
    });

    return NextResponse.json(newPlace, { status: 201 });
  } catch (error: any) {
    console.error("Error creating place:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create place record." },
      { status: 500 }
    );
  }
}
