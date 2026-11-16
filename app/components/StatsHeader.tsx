"use client";

import React from "react";
import { Compass, Trophy, PlaneTakeoff, Heart, IndianRupee, Sparkles } from "lucide-react";
import { Place } from "../types/place";

interface StatsHeaderProps {
  places: Place[];
  onOpenAddModal: () => void;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({ places, onOpenAddModal }) => {
  const totalCount = places.length;
  const visitedCount = places.filter((p) => p.status === "VISITED").length;
  const planningCount = places.filter((p) => p.status === "PLANNING").length;
  const wishlistCount = places.filter((p) => p.status === "WISHLIST").length;
  const favoritesCount = places.filter((p) => p.isFavorite).length;

  const percentExplored = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;
  const totalBudget = places.reduce((sum, p) => sum + (p.budget || 0), 0);

  return (
    <div className="w-full space-y-4">
      {/* Streamlined Brand Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 shadow-md shadow-pink-500/20">
            <Compass className="w-6 h-6 text-white stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gradient-candy leading-none">
              Dream Places
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Curate, wander, and conquer your worldwide bucket list ✈️
            </p>
          </div>
        </div>

        {/* Compact Add Button */}
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-500/20 transition-all duration-200 hover:scale-102 active:scale-95 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Add Destination</span>
        </button>
      </div>

      {/* High-Density Inline Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Card 1: Explored Progress */}
        <div className="glass-card rounded-xl p-3 sm:p-3.5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[11px] uppercase font-bold tracking-wider text-rose-300">
              Explored
            </span>
            <Trophy className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white">{percentExplored}%</span>
            <span className="text-[11px] text-slate-400">({visitedCount}/{totalCount})</span>
          </div>
          {/* Inline mini progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-500"
              style={{ width: `${percentExplored}%` }}
            />
          </div>
        </div>

        {/* Card 2: In-Flight & Planning */}
        <div className="glass-card rounded-xl p-3 sm:p-3.5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[11px] uppercase font-bold tracking-wider text-purple-300">
              Planning
            </span>
            <PlaneTakeoff className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white">{planningCount}</span>
            <span className="text-[11px] text-purple-300/80">in progress</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 truncate">
            {wishlistCount} saved on wishlist
          </p>
        </div>

        {/* Card 3: Starred Favorites */}
        <div className="glass-card rounded-xl p-3 sm:p-3.5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[11px] uppercase font-bold tracking-wider text-pink-300">
              Favorites
            </span>
            <Heart className="w-3.5 h-3.5 fill-pink-500/40 text-pink-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-white">{favoritesCount}</span>
            <span className="text-[11px] text-pink-300/80">starred spots</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 truncate">
            Top priority journeys
          </p>
        </div>

        {/* Card 4: Estimated Budget */}
        <div className="glass-card rounded-xl p-3 sm:p-3.5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[11px] uppercase font-bold tracking-wider text-cyan-300">
              Total Budget
            </span>
            <IndianRupee className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-0.5">
            <span className="text-xl sm:text-2xl font-black text-white">
              ₹{totalBudget.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 truncate">
            Across active bucket spots
          </p>
        </div>
      </div>
    </div>
  );
};
