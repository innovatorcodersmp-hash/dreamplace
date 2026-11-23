"use client";

import React, { useState, useEffect, useMemo } from "react";
import { StatsHeader } from "./components/StatsHeader";
import { FilterBar } from "./components/FilterBar";
import { PlaceCard } from "./components/PlaceCard";
import { AddPlaceModal } from "./components/AddPlaceModal";
import { EditPlaceModal } from "./components/EditPlaceModal";
import { Place, StatusFilter } from "./types/place";
import { Compass, Plus, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Fetch places from database
  const fetchPlaces = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/places");
      if (res.ok) {
        const data = await res.json();
        setPlaces(data);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handlePlaceAdded = (newPlace: Place) => {
    setPlaces((prev) => [newPlace, ...prev]);
  };

  const handlePlaceUpdated = (updatedPlace: Place) => {
    setPlaces((prev) =>
      prev.map((p) => (p.id === updatedPlace.id ? updatedPlace : p))
    );
  };

  const handlePlaceDeleted = (id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = place.title.toLowerCase().includes(query);
        const matchesCountry = place.country.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCountry) return false;
      }

      if (statusFilter !== "ALL" && place.status !== statusFilter) {
        return false;
      }

      if (selectedCategory !== "ALL" && place.category !== selectedCategory) {
        return false;
      }

      if (onlyFavorites && !place.isFavorite) {
        return false;
      }

      return true;
    });
  }, [places, searchQuery, statusFilter, selectedCategory, onlyFavorites]);

  return (
    <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-7 space-y-3 sm:space-y-4 overflow-x-hidden max-w-full min-w-0">
      {/* Inline Compact Header Stats */}
      <StatsHeader
        places={places}
        onOpenAddModal={() => setIsModalOpen(true)}
      />

      {/* Streamlined Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onlyFavorites={onlyFavorites}
        onToggleFavorites={() => setOnlyFavorites(!onlyFavorites)}
        totalFiltered={filteredPlaces.length}
      />

      {/* High-Density Places Grid */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
          <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-slate-400 font-medium text-xs animate-pulse">
            Loading your dream destinations...
          </p>
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="py-14 flex flex-col items-center justify-center text-center px-4 rounded-2xl glass-card border border-white/10 w-full min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-white/15 flex items-center justify-center text-pink-400 mb-3 shadow-inner">
            <Compass className="w-7 h-7 stroke-[1.8] animate-float" />
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            {places.length === 0
              ? "Your Passport is Empty!"
              : "No destinations match your filters"}
          </h3>

          <p className="text-slate-400 max-w-sm text-xs mb-4">
            {places.length === 0
              ? "Start pinning the world's most breathtaking places right now."
              : "Try adjusting your search keywords, clearing tags, or resetting filters."}
          </p>

          {places.length === 0 ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-semibold text-xs shadow-md shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Destination</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setSelectedCategory("ALL");
                setOnlyFavorites(false);
              }}
              className="px-4 py-1.5 rounded-lg glass-pill text-slate-200 text-xs font-medium hover:bg-white/10 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0 max-w-full">
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onUpdate={handlePlaceUpdated}
              onDelete={handlePlaceDeleted}
              onEdit={(target) => setEditingPlace(target)}
            />
          ))}
        </div>
      )}

      {/* Thumb-Friendly Floating Action Button for Mobile */}
      <button
        onClick={() => setIsModalOpen(true)}
        aria-label="Add New Place"
        className="fixed bottom-5 right-5 sm:hidden z-40 flex items-center justify-center gap-1.5 px-4 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-semibold text-sm shadow-xl shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
        <span>Add Place</span>
      </button>

      {/* Compact Add Place Modal */}
      <AddPlaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlaceAdded={handlePlaceAdded}
      />

      {/* Compact Edit Place Modal */}
      <EditPlaceModal
        isOpen={editingPlace !== null}
        place={editingPlace}
        onClose={() => setEditingPlace(null)}
        onPlaceUpdated={(updated) => {
          handlePlaceUpdated(updated);
          setEditingPlace(null);
        }}
      />
    </main>
  );
}
