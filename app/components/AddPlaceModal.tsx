"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UploadCloud,
  Compass,
  MapPin,
  Calendar,
  IndianRupee,
  FileText,
  Loader2,
  Sparkles,
  Camera,
  Check,
} from "lucide-react";
import { Place } from "../types/place";

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceAdded: (place: Place) => void;
}

const CATEGORY_OPTIONS = [
  "Beach",
  "Mountains",
  "Historic",
  "City",
  "Hidden Gem",
  "Road Trip",
];

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  isOpen,
  onClose,
  onPlaceAdded,
}) => {
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("Beach");
  const [targetYear, setTargetYear] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [status, setStatus] = useState<"WISHLIST" | "PLANNING" | "VISITED">("WISHLIST");
  const [notes, setNotes] = useState("");

  // Local File Upload & Preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }
    setErrorMsg(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCountry("");
    setCategory("Beach");
    setTargetYear("");
    setBudget("");
    setStatus("WISHLIST");
    setNotes("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !country.trim()) {
      setErrorMsg("Destination name and country are required.");
      return;
    }
    if (!selectedFile) {
      setErrorMsg("Please upload a photo for your dream place.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Upload photo to /api/upload
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.json();
        throw new Error(uploadErr.error || "Failed to upload photo");
      }

      const uploadData = await uploadRes.json();

      // 2. Post new place
      const placePayload = {
        title: title.trim(),
        country: country.trim(),
        category,
        targetYear: targetYear ? parseInt(targetYear, 10) : null,
        budget: budget ? parseFloat(budget) : null,
        status,
        isFavorite: false,
        imageUrl: uploadData.url,
        notes: notes.trim() || null,
      };

      const placeRes = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(placePayload),
      });

      if (!placeRes.ok) {
        const placeErr = await placeRes.json();
        throw new Error(placeErr.error || "Failed to save place");
      }

      const createdPlace = await placeRes.json();
      onPlaceAdded(createdPlace);
      resetForm();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            className="relative max-w-lg w-full mx-3 max-h-[92vh] overflow-y-auto rounded-2xl glass-card bg-slate-900/95 border border-white/20 p-4 sm:p-5 shadow-2xl z-10"
          >
            {/* Top gradient highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400" />

            {/* Streamlined Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-400 text-white shadow-sm shadow-rose-500/25">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight leading-none">
                    Add Dream Destination
                  </h2>
                  <p className="text-[12px] text-slate-400 mt-1 leading-none">
                    Pin a new breathtaking spot to your bucket list
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Compact Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              {/* Compact Image Upload Zone */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                    Destination Photo <span className="text-rose-400">*</span>
                  </label>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-medium text-rose-400 hover:text-rose-300 underline"
                    >
                      Change Photo
                    </button>
                  )}
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-xl border border-dashed transition-all duration-200 overflow-hidden flex items-center justify-center ${
                    isDragging
                      ? "border-rose-400 bg-rose-500/10 scale-[1.01]"
                      : "border-white/20 bg-slate-950/40 hover:border-white/35 hover:bg-slate-950/60"
                  } ${previewUrl ? "h-28" : "h-24"}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="relative w-full h-full group">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-semibold text-white">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Click to switch image</span>
                      </div>
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-4">
                      <div className="p-2 rounded-lg bg-pink-500/15 text-pink-400 border border-pink-500/25 shrink-0">
                        <UploadCloud className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-200">
                          Click to browse or drop photo
                        </p>
                        <p className="text-[11px] text-slate-400">
                          JPG, PNG, or WEBP from local device
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2-Column Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Title */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Place Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Compass className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Amalfi Coast"
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg glass-input text-xs sm:text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Country / Region <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Italy"
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg glass-input text-xs sm:text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg glass-input text-xs sm:text-sm bg-slate-900 cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg glass-input text-xs sm:text-sm bg-slate-900 cursor-pointer"
                  >
                    <option value="WISHLIST" className="bg-slate-900 text-white">📌 Wishlist</option>
                    <option value="PLANNING" className="bg-slate-900 text-white">✈️ Planning</option>
                    <option value="VISITED" className="bg-slate-900 text-white">🏆 Visited</option>
                  </select>
                </div>

                {/* Target Year */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Target Year
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="number"
                      min={new Date().getFullYear()}
                      max={2050}
                      value={targetYear}
                      onChange={(e) => setTargetYear(e.target.value)}
                      placeholder={`e.g. ${new Date().getFullYear() + 1}`}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg glass-input text-xs sm:text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Est. Budget (₹ INR)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. 150000"
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg glass-input text-xs sm:text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Highlights & Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Must-try local cuisine, top viewpoints..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg glass-input text-xs sm:text-sm resize-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Streamlined Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg glass-pill text-slate-300 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-500/20 transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>Save Place</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
