export interface Place {
  id: string;
  title: string;
  country: string;
  category: string; // "Beach" | "Mountains" | "Historic" | "City" | "Hidden Gem" | "Road Trip"
  targetYear?: number | null;
  budget?: number | null;
  status: "WISHLIST" | "PLANNING" | "VISITED";
  isFavorite: boolean;
  imageUrl: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type StatusFilter = "ALL" | "WISHLIST" | "PLANNING" | "VISITED";

