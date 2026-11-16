"use client";

import React from "react";
import { Search, Heart, Sparkles, X } from "lucide-react";
import { StatusFilter } from "../types/place";

export const CATEGORIES = [
  { label: "All", value: "ALL", emoji: "✨" },
  { label: "Beach", value: "Beach", emoji: "🏖️" },
  { label: "Mountains", value: "Mountains", emoji: "🏔️" },
  { label: "Historic", value: "Historic", emoji: "🏛️" },
  { label: "City", value: "City", emoji: "🌆" },
  { label: "Hidden Gem", value: "Hidden Gem", emoji: "💎" },
  { label: "Road Trip", value: "Road Trip", emoji: "🚗" },
];

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  onlyFavorites,
  onToggleFavorites,
  totalFiltered,
}) => {
  const statusTabs: { label: string; value: StatusFilter; emoji: string }[] = [
    { label: "All", value: "ALL", emoji: "🌟" },
    { label: "Wishlist", value: "WISHLIST", emoji: "📌" },
    { label: "Planning", value: "PLANNING", emoji: "✈️" },
    { label: "Visited", value: "VISITED", emoji: "🏆" },
  ];

  return (
    <div className="w-full space-y-2.5">
      {/* Top Search + Status Tabs + Favorite Toggle Row */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Compact Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search place, country..."
            className="w-full pl-8 pr-7 py-1.5 rounded-lg glass-input text-xs sm:text-sm placeholder:text-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Streamlined Status Segmented Control */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl glass-panel overflow-x-auto self-start sm:self-auto">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onStatusChange(tab.value)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-sm shadow-rose-500/25"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Compact Favorites Toggle */}
        <button
          onClick={onToggleFavorites}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border self-start sm:self-auto ${
            onlyFavorites
              ? "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20"
              : "glass-pill text-slate-300 border-white/10 hover:bg-white/10"
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              onlyFavorites ? "fill-rose-400 text-rose-400" : "text-slate-400"
            }`}
          />
          <span>Favorites</span>
        </button>
      </div>

      {/* Streamlined Category Filter Badges */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap border ${
                  isSelected
                    ? "bg-amber-400/20 text-amber-200 border-amber-400/50 shadow-sm"
                    : "glass-pill text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Counter indicator */}
        <div className="text-[11px] font-medium text-slate-400 whitespace-nowrap flex items-center gap-1 shrink-0 pl-2">
          <Sparkles className="w-3 h-3 text-rose-400" />
          <span>{totalFiltered} {totalFiltered === 1 ? "spot" : "spots"}</span>
        </div>
      </div>
    </div>
  );
};
