import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dream Places | Wanderlust Bucket List",
  description:
    "Curate, explore, and conquer your ultimate worldwide travel destinations with cheerful flair and joyful milestone celebrations.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="relative bg-slate-950 text-slate-100 antialiased min-h-screen selection:bg-pink-500 selection:text-white">
        {/* Ambient Glowing Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="ambient-glow-1" />
          <div className="ambient-glow-2" />
          <div className="ambient-glow-3" />
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}

