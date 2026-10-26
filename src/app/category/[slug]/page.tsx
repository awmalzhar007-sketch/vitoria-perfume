import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { prisma } from "@/lib/prisma";
import fallbackData from "@/lib/fallback-data.json";
import { ArrowRight, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const VALID_PERFUME_SLUGS = (fallbackData.products as any[]).map((p: any) => p.slug);

  let category: any = null;
  try {
    category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isPublished: true, slug: { in: VALID_PERFUME_SLUGS } },
          include: {
            category: true,
            images: { orderBy: { order: "asc" } },
            sizes: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (category?.products) {
      category.products = category.products.filter((p: any) => VALID_PERFUME_SLUGS.includes(p.slug));
    }
  } catch (err) {
    console.error("CategoryPage database error:", err);
  }

  if (!category) {
    const fallbackCat = (fallbackData.categories as any[]).find(
      (c: any) => c.slug === slug
    );
    if (fallbackCat) {
      const catProducts = (fallbackData.products as any[]).filter(
        (p: any) => p.categoryId === fallbackCat.id
      );
      category = { ...fallbackCat, products: catProducts };
    }
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col selection:bg-[#c5a253]/20">
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />

      <main className="flex-1 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#736f66] uppercase tracking-wider mb-8">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <Link href="/shop" className="hover:text-black transition-colors">
              Collections
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-black font-semibold">{category.name}</span>
          </nav>

          {/* Category Banner */}
          <div className="bg-white border border-[#e8e6e1] p-8 sm:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="space-y-3 max-w-2xl text-left">
              <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block">
                Olfactory Repertoire
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0d0d0d]">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-xs sm:text-sm text-[#5c5952] leading-relaxed">
                  {category.description}
                </p>
              )}
              <span className="inline-block text-xs text-[#8c887f] font-mono uppercase tracking-wider">
                {category.products.length} {category.products.length === 1 ? "Creation" : "Creations"} Available
              </span>
            </div>

            {category.image && (
              <div className="w-36 h-36 sm:w-48 sm:h-48 shrink-0 bg-[#faf9f6] border border-[#dedad2] p-2 shadow-sm">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Products Grid */}
          {category.products.length === 0 ? (
            <div className="text-center py-24 bg-white border border-[#e8e6e1] p-8 shadow-sm">
              <p className="font-serif text-base font-bold text-[#0d0d0d] mb-3">
                No formulations available in this collection at present.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d0d0d] text-[#faf9f6] text-xs font-semibold uppercase tracking-widest hover:bg-[#252525] transition-colors"
              >
                <span>Browse Entire Boutique</span>
                <ArrowRight className="w-4 h-4 text-[#c5a253]" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.products.map((product: any) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
