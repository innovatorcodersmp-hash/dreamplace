"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  MapPin,
  Calendar,
  IndianRupee,
  Heart,
  Trash2,
  Pencil,
  CheckCircle2,
  Clock,
  Bookmark,
  ChevronDown,
} from "lucide-react";
import { Place } from "../types/place";

interface PlaceCardProps {
  place: Place;
  onUpdate: (updated: Place) => void;
  onDelete: (id: string) => void;
  onEdit: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onUpdate, onDelete, onEdit }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Confetti explosion when marking VISITED
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#f43f5e", "#ec4899", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"],
        disableForReducedMotion: true,
      });
    } catch (e) {
      console.log("Confetti trigger:", e);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const nextFavorite = !place.isFavorite;
      onUpdate({ ...place, isFavorite: nextFavorite });

      const res = await fetch(`/api/places/${place.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: nextFavorite }),
      });

      if (!res.ok) throw new Error("Failed to update favorite status");
      const saved = await res.json();
      onUpdate(saved);
    } catch (err) {
      console.error(err);
      onUpdate(place);
    }
  };

  const handleStatusChange = async (nextStatus: "WISHLIST" | "PLANNING" | "VISITED") => {
    if (nextStatus === place.status) {
      setShowStatusMenu(false);
      return;
    }

    setShowStatusMenu(false);
    setIsUpdating(true);

    if (nextStatus === "VISITED") {
      triggerCelebration();
    }

    try {
      const res = await fetch(`/api/places/${place.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error("Status update failed");
      const updated = await res.json();
      onUpdate(updated);
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Remove "${place.title}" from your bucket list?`)) return;

    try {
      const res = await fetch(`/api/places/${place.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete place");
      onDelete(place.id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const statusConfig = {
    WISHLIST: {
      bg: "bg-amber-500/20 border-amber-500/40 text-amber-300",
      icon: <Bookmark className="w-3 h-3" />,
      label: "Wishlist",
    },
    PLANNING: {
      bg: "bg-purple-500/20 border-purple-500/40 text-purple-300",
      icon: <Clock className="w-3 h-3" />,
      label: "Planning",
    },
    VISITED: {
      bg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: "Visited",
    },
  }[place.status] || {
    bg: "bg-slate-500/20 border-slate-500/40 text-slate-300",
    icon: <Bookmark className="w-3 h-3" />,
    label: place.status,
  };

  return (
    <div
      onMouseLeave={() => setShowStatusMenu(false)}
      className="glass-card rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/10 flex flex-col group relative border border-white/10 w-full min-w-0 max-w-full"
    >
      {/* Balanced Image Thumbnail (h-40 sm:h-44) */}
      <div className="relative w-full h-40 sm:h-44 overflow-hidden bg-slate-900 shrink-0">
        <img
          src={place.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"}
          alt={place.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient shadow for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40" />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none min-w-0">
          {/* Category Tag */}
          <span className="pointer-events-auto inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold tracking-wide glass-pill bg-black/60 text-white border border-white/20 backdrop-blur-md shadow-sm truncate max-w-[70%]">
            {place.category}
          </span>

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            aria-label="Toggle favorite"
            className="pointer-events-auto p-1.5 rounded-lg glass-pill bg-black/50 hover:bg-black/75 transition-transform active:scale-90 shadow-sm border border-white/20 shrink-0"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                place.isFavorite
                  ? "fill-rose-500 text-rose-500 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.9)]"
                  : "text-white/80 hover:text-white"
              }`}
            />
          </button>
        </div>

        {/* Bottom Floating Status Pill */}
        <div className="absolute bottom-2.5 left-2.5">
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              disabled={isUpdating}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border backdrop-blur-md shadow-sm transition-all ${statusConfig.bg}`}
            >
              {statusConfig.icon}
              <span>{statusConfig.label}</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-80" />
            </button>

            {/* Compact Status Menu */}
            {showStatusMenu && (
              <div className="absolute bottom-full left-0 mb-1.5 w-32 rounded-xl glass-card bg-slate-900/98 border border-white/20 p-1 shadow-2xl z-30">
                {(["WISHLIST", "PLANNING", "VISITED"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      place.status === s
                        ? "bg-rose-500/25 text-rose-300 font-bold"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {s === "WISHLIST" && "📌 Wishlist"}
                    {s === "PLANNING" && "✈️ Planning"}
                    {s === "VISITED" && "🏆 Visited 🎉"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Streamlined Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between min-w-0">
        <div className="min-w-0">
          {/* Title & Country */}
          <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors truncate leading-snug">
            {place.title}
          </h3>

          <div className="flex items-center gap-1 text-slate-400 text-xs mt-1 min-w-0">
            <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
            <span className="truncate">{place.country}</span>
          </div>

          {/* Notes Preview (compact line-clamp-1) */}
          {place.notes && (
            <p className="text-[11px] text-slate-400/90 mt-2 truncate italic leading-normal">
              &quot;{place.notes}&quot;
            </p>
          )}
        </div>

        {/* Compact Metadata & Footer Row */}
        <div className="pt-2.5 mt-3 border-t border-white/10 flex items-center justify-between text-xs min-w-0 gap-1.5">
          {/* Metadata badges (Budget & Year) */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            {place.budget !== null && place.budget !== undefined && place.budget > 0 ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 truncate min-w-0">
                <IndianRupee className="w-3 h-3 shrink-0" />
                <span className="truncate">{place.budget.toLocaleString('en-IN')}</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 truncate">Flex budget</span>
            )}

            {place.targetYear && (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded-md border border-amber-400/20 shrink-0">
                <Calendar className="w-2.5 h-2.5" />
                <span>{place.targetYear}</span>
              </span>
            )}
          </div>

          {/* Action buttons (Edit & Delete) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(place)}
              aria-label="Edit destination"
              title="Edit destination"
              className="p-1 rounded-md text-slate-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDelete}
              aria-label="Delete place"
              title="Delete place"
              className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
