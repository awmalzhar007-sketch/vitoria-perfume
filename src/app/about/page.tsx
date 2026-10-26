import React from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { Sparkles, ShieldCheck, Award, HeartHandshake, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Heritage | VITORIA Haute Parfumerie",
  description: "Discover the ethos of VITORIA Haute Parfumerie: an unyielding dedication to rare perfume oils, extended maceration, and unforgettable sillage.",
};

export default async function AboutPage() {
  const settings = await prisma.storeSettings.findUnique({
    where: { id: "default" },
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col selection:bg-[#c5a253]/20">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block">
              {settings?.aboutSubtitle || "Heritage & Olfactory Philosophy"}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0d0d0d]">
              {settings?.aboutTitle || "VITORIA Haute Parfumerie — Where Scent Becomes Art"}
            </h1>
            <p className="text-sm text-[#66635c] max-w-xl mx-auto leading-relaxed">
              {settings?.aboutDescription || "Born from a deep passion for rare perfume oils and timeless elegance, VITORIA creates fragrances of unmatched nobility, longevity, and depth."}
            </p>
          </div>

          {/* Visual Highlight */}
          <div className="aspect-[16/9] bg-white border border-[#dedad2] shadow-sm overflow-hidden p-2">
            <img
              src={
                settings?.aboutImage ||
                "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1200&auto=format&fit=crop"
              }
              alt={settings?.aboutTitle || "VITORIA Perfume Atelier"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Philosophy Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-xs sm:text-sm text-[#55524b] leading-relaxed">
            <div className="space-y-4 bg-white p-8 border border-[#e8e6e1] shadow-xs">
              <h2 className="font-serif text-xl font-bold text-[#0d0d0d] border-b border-[#f0eee9] pb-3">
                The Art of Indelible Presence
              </h2>
              <p>
                We believe that a fragrance is never a mere accessory; it is an intimate expression of individuality, an invisible halo that announces your entrance and lingers long after your departure.
              </p>
              <p>
                Every drop of natural extract is hand-selected from private botanical harvests across Grasse, Madagascar, and Cambodia, harmonized to evoke evocative emotional landscapes.
              </p>
            </div>

            <div className="space-y-4 bg-white p-8 border border-[#e8e6e1] shadow-xs">
              <h2 className="font-serif text-xl font-bold text-[#0d0d0d] border-b border-[#f0eee9] pb-3">
                Uncompromising Concentration
              </h2>
              <p>
                We formulate primarily in Extrait de Parfum and Eau de Parfum concentrations, ensuring an unbroken sillage that thrives through 24 hours while remaining refined and harmonious.
              </p>
              <p>
                Each flacon is individually inspected, dressed with custom weighted caps, and finished with our royal brass emblem before being dispatched into your collection.
              </p>
            </div>
          </div>

          {/* Core Values Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-7 bg-white border border-[#e8e6e1] text-center space-y-2 shadow-xs">
              <Sparkles className="w-6 h-6 text-[#c5a253] mx-auto mb-2" />
              <h3 className="font-serif font-bold text-base text-[#0d0d0d]">Pure Extraits</h3>
              <p className="text-xs text-[#736f66] leading-relaxed">
                100% authentic botanical and oriental oils, unadulterated and cruelty-free.
              </p>
            </div>

            <div className="p-7 bg-white border border-[#e8e6e1] text-center space-y-2 shadow-xs">
              <Award className="w-6 h-6 text-[#c5a253] mx-auto mb-2" />
              <h3 className="font-serif font-bold text-base text-[#0d0d0d]">Tested Longevity</h3>
              <p className="text-xs text-[#736f66] leading-relaxed">
                Compounded to ensure more than 24 hours of projection on textile and skin.
              </p>
            </div>

            <div className="p-7 bg-white border border-[#e8e6e1] text-center space-y-2 shadow-xs">
              <HeartHandshake className="w-6 h-6 text-[#c5a253] mx-auto mb-2" />
              <h3 className="font-serif font-bold text-base text-[#0d0d0d]">Bespoke Concierge</h3>
              <p className="text-xs text-[#736f66] leading-relaxed">
                Personalized olfactory recommendations and dedicated VIP delivery care.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 bg-[#0d0d0d] hover:bg-[#252525] text-[#faf9f6] px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors shadow-md"
            >
              <span>Explore The Fragrance Atelier</span>
              <ArrowRight className="w-4 h-4 text-[#c5a253]" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
