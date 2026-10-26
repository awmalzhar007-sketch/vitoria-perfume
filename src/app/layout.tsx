import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "VITORIA | Haute Parfumerie & Royal Fragrances",
  description: "VITORIA Haute Parfumerie — An evocative world of imperial niche perfumes, rare botanical essences, and captivating 24H+ sillage. Handcrafted luxury flacons.",
  keywords: "VITORIA, luxury perfume, haute parfumerie, niche fragrances, oud, amber, royal perfumes, extrait de parfum",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={`${plusJakarta.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[#faf9f6] text-[#121212] font-sans antialiased selection:bg-[#c5a253]/25 selection:text-black overflow-x-hidden">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
