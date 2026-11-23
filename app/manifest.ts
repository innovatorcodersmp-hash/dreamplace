import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dream Places Bucket List",
    short_name: "DreamPlaces",
    description: "Curate, explore, and conquer your ultimate worldwide travel destinations with cheerful flair and joyful milestone celebrations.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#f43f5e",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

