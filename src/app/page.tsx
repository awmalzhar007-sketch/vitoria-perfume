import React from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  Compass,
  Gift,
  CheckCircle,
  Gem,
  Flame,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch real data from persistent database with safe fallback
  let categories: any[] = [];
  let featuredProducts: any[] = [];
  let bestsellers: any[] = [];
  let allProducts: any[] = [];
  let settings: any = null;
  let activeCoupon: any = null;

  try {
    const data = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        include: {
          _count: { select: { products: true } },
        },
      }),
      prisma.product.findMany({
        where: { isPublished: true, isFeatured: true },
        include: {
          category: true,
          images: { orderBy: { order: "asc" } },
          sizes: true,
        },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isPublished: true, isBestseller: true },
        include: {
          category: true,
          images: { orderBy: { order: "asc" } },
          sizes: true,
        },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isPublished: true },
        include: {
          category: true,
          images: { orderBy: { order: "asc" } },
          sizes: true,
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.storeSettings.findUnique({
        where: { id: "default" },
      }),
      prisma.coupon.findFirst({
        where: {
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    categories = data[0] || [];
    featuredProducts = data[1] || [];
    bestsellers = data[2] || [];
    allProducts = data[3] || [];
    settings = data[4] || null;
    activeCoupon = data[5] || null;
  } catch (err) {
    console.error("HomePage database query error:", err);
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col selection:bg-[#c5a253]/20">
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-[#faf9f6] border-b border-[#e8e6e1] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#c5a253_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Text column */}
              <div className="lg:col-span-7 space-y-7 text-left">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#f5f2e8] border border-[#c5a253]/35 rounded-full text-[11px] font-semibold tracking-[0.2em] uppercase text-[#967527]">
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a253]" />
                  <span>
                    {settings?.heroSubtitle || "ROYAL NICHE BLENDS — 24H+ LONGEVITY"}
                  </span>
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[#0d0d0d] tracking-tight leading-[1.08] whitespace-pre-line">
                  {settings?.heroTitle || "THE ESSENCE OF NOBILITY\nAN UNFORGETTABLE SILLAGE"}
                </h1>

                <p className="text-sm sm:text-base text-[#615e57] leading-relaxed max-w-xl font-normal">
                  {settings?.heroDescription || settings?.tagLine ||
                    "VITORIA Haute Parfumerie crafts rare, evocative olfactory portraits. More than a fragrance—an indelible aura of presence and distinction."}
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href={settings?.heroPrimaryBtnLink || "/shop"}
                    className="inline-flex items-center gap-3 bg-[#0d0d0d] hover:bg-[#242424] text-[#faf9f6] px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 shadow-md group"
                  >
                    <span>{settings?.heroPrimaryBtnText || "Explore Collection"}</span>
                    <ArrowRight className="w-4 h-4 text-[#c5a253] group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {Boolean(settings?.heroSecondaryBtnText) && (
                    <Link
                      href={settings?.heroSecondaryBtnLink || "/shop?sort=bestseller"}
                      className="inline-flex items-center gap-2 bg-white hover:bg-[#f6f5f1] text-[#0d0d0d] border border-[#dedad2] px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                    >
                      <span>{settings?.heroSecondaryBtnText || "Discover Bestsellers"}</span>
                    </Link>
                  )}
                </div>

                {/* Highlights */}
                <div className="pt-8 border-t border-[#e8e6e1] grid grid-cols-3 gap-6 max-w-lg">
                  <div>
                    <span className="font-serif font-bold text-2xl text-[#0d0d0d] block">100%</span>
                    <span className="text-[11px] uppercase tracking-wider text-[#736f66]">Pure Niche Oils</span>
                  </div>
                  <div>
                    <span className="font-serif font-bold text-2xl text-[#0d0d0d] block">+24 Hours</span>
                    <span className="text-[11px] uppercase tracking-wider text-[#736f66]">Tested Sillage</span>
                  </div>
                  <div>
                    <span className="font-serif font-bold text-2xl text-[#0d0d0d] block">Express</span>
                    <span className="text-[11px] uppercase tracking-wider text-[#736f66]">Egypt Delivery</span>
                  </div>
                </div>
              </div>

              {/* Image column */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/5] bg-white border border-[#dedad2] p-4 shadow-xl">
                  <img
                    src={
                      settings?.heroImage ||
                      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop"
                    }
                    alt={settings?.heroTitle?.replace(/\n/g, " ") || "VITORIA Royal Parfums"}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Prestige Floating Badge */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-5 border border-[#e8e6e1] shadow-2xl max-w-[240px]">
                    <div className="flex items-center gap-1 text-[#c5a253] mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#c5a253]" />
                      ))}
                    </div>
                    <p className="font-serif font-bold text-sm text-[#0d0d0d]">
                      {settings?.heroBadgeTitle || "VITORIA Royal Parfums"}
                    </p>
                    <p className="text-[10px] text-[#78756e] uppercase tracking-wider mt-0.5">
                      {settings?.heroBadgeSubtitle || "Extrait de Parfum • Pure Niche Blends"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="py-20 bg-white border-b border-[#e8e6e1]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block mb-1.5">
                    Curated Repertoire
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0d0d0d]">
                    Explore By Olfactory Collection
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:text-[#c5a253] group transition-colors"
                >
                  <span>View All Fragrances</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="group relative bg-[#faf9f6] border border-[#e8e6e1] hover:border-[#c5a253] p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-lg"
                  >
                    <div className="aspect-square bg-white mb-4 overflow-hidden relative border border-[#f0eee9]">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                          <Gift className="w-8 h-8 text-[#c5a253]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#0d0d0d] group-hover:text-[#c5a253] transition-colors mb-1">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-[#78756e]">
                        {cat._count.products} {cat._count.products === 1 ? "Creation" : "Creations"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Fragrances Section */}
        {featuredProducts.length > 0 && (
          <section className="py-20 bg-[#faf9f6] border-b border-[#e8e6e1]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block mb-2">
                  Exquisite Creations
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0d0d0d] mb-3">
                  Featured Masterpieces
                </h2>
                <p className="text-xs sm:text-sm text-[#6b6861] leading-relaxed">
                  Handcrafted with the world’s rarest natural essences, formulated for those who demand nothing less than supreme distinction.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Brand Philosophy / Olfactory Pillars */}
        <section className="py-20 bg-[#0d0d0d] text-[#faf9f6] border-b border-[#242424]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-center lg:text-left">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1c1a16] border border-[#332f28] flex items-center justify-center mx-auto lg:mx-0">
                  <Gem className="w-5 h-5 text-[#c5a253]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#f5f3ef]">Noble Botanical Extracts</h3>
                <p className="text-xs text-[#9c978d] leading-relaxed">
                  Sourced directly from private estates in Grasse, Madagascar, and ancient Cambodian forests, distilled to ultimate purity.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1c1a16] border border-[#332f28] flex items-center justify-center mx-auto lg:mx-0">
                  <Clock className="w-5 h-5 text-[#c5a253]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#f5f3ef]">Extended Maceration</h3>
                <p className="text-xs text-[#9c978d] leading-relaxed">
                  Each formulation rests in temperature-controlled darkness for months, allowing essential oils to harmonize into unrivaled richness.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1c1a16] border border-[#332f28] flex items-center justify-center mx-auto lg:mx-0">
                  <Sparkles className="w-5 h-5 text-[#c5a253]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#f5f3ef]">Heavyweight Crystal Flacons</h3>
                <p className="text-xs text-[#9c978d] leading-relaxed">
                  Housed in polished French glass flacons featuring custom magnetic caps and hand-embossed brass badges.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bestsellers Section */}
        {bestsellers.length > 0 && (
          <section className="py-20 bg-white border-b border-[#e8e6e1]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block mb-1.5">
                    Connoisseur’s Choice
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0d0d0d]">
                    Most Coveted Fragrances
                  </h2>
                </div>
                <Link
                  href="/shop?sort=bestseller"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:text-[#c5a253] group transition-colors"
                >
                  <span>Explore Bestsellers</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestsellers.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Promotional Banner Box (Dynamic based on active coupon) */}
        {activeCoupon && (
          <section className="py-16 bg-[#faf9f6] border-b border-[#e8e6e1]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="border border-[#dedad2] p-8 sm:p-14 relative overflow-hidden bg-white shadow-sm">
                <div className="max-w-xl space-y-4 relative z-10 text-left">
                  <span className="inline-block px-3 py-1 bg-[#0d0d0d] text-[#c5a253] text-[10px] font-bold uppercase tracking-[0.2em] border border-[#c5a253]/30">
                    VIP Privilege & Exclusive Offer
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#0d0d0d]">
                    Enjoy an Extra {activeCoupon.discountType === "PERCENTAGE" ? `${activeCoupon.discountValue}%` : `${activeCoupon.discountValue} ${settings?.currency || "EGP"}`} Privilege
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5f5c55] leading-relaxed">
                    Use promotional code{" "}
                    <span className="font-mono font-bold text-[#0d0d0d] border border-dashed border-[#c5a253] px-2.5 py-1 bg-[#faf8f3] select-all tracking-wider">
                      {activeCoupon.code}
                    </span>{" "}
                    at checkout to receive an instant courtesy reduction
                    {activeCoupon.minOrderValue > 0 ? ` on orders of ${activeCoupon.minOrderValue} ${settings?.currency || "EGP"} or more` : ""}
                    {settings?.enableFreeShipping !== false && Number(settings?.freeShippingThreshold) > 0 ? `, plus complimentary nationwide shipping on orders over ${settings?.freeShippingThreshold} ${settings?.currency || "EGP"}` : ""}
                    .
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2.5 bg-[#0d0d0d] hover:bg-[#252525] text-[#faf9f6] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                    >
                      <span>Claim Privilege & Shop Now</span>
                      <ArrowRight className="w-4 h-4 text-[#c5a253]" />
                    </Link>
                  </div>
                </div>

                <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block w-72 h-72 border border-[#dedad2] opacity-40">
                  <img
                    src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop"
                    alt="VITORIA Luxury Perfumes"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Complete Catalog Preview Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block mb-1.5">
                  Complete Atelier
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0d0d0d]">
                  All Fragrance Creations
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#0d0d0d] text-[#faf9f6] hover:bg-[#252525] px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <span>Browse Full Boutique</span>
                <ArrowRight className="w-4 h-4 text-[#c5a253]" />
              </Link>
            </div>

            {allProducts.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-[#dedad2] bg-[#faf9f6]">
                <p className="font-serif text-base font-bold text-[#0d0d0d] mb-1">
                  New VITORIA Formulations Arriving Soon
                </p>
                <p className="text-xs text-[#78756e]">
                  Manage and add new fragrances anytime via your administrative atelier.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {allProducts.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
