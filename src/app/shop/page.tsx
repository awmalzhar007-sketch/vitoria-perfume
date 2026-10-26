"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "newest";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(3500);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?sort=${sort}`;
      if (selectedCategory && selectedCategory !== "all") {
        url += `&category=${selectedCategory}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearch("");
    setSort("newest");
    setInStockOnly(false);
    setMaxPrice(3500);
  };

  // Client-side filtering for fast interactive response
  const filteredProducts = products.filter((p) => {
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchEn = p.nameEn?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchNotes =
        p.topNotes?.toLowerCase().includes(q) ||
        p.heartNotes?.toLowerCase().includes(q) ||
        p.baseNotes?.toLowerCase().includes(q);
      if (!matchName && !matchEn && !matchDesc && !matchNotes) return false;
    }
    if (inStockOnly && p.stockQuantity <= 0) return false;
    if (p.price > maxPrice) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col selection:bg-[#c5a253]/20">
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />

      <main className="flex-1 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b border-[#e8e6e1] pb-10 mb-10 text-center sm:text-left">
            <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block mb-2">
              The Complete Atelier
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0d0d0d]">
              All Fragrance Formulations
            </h1>
            <p className="text-xs sm:text-sm text-[#66635c] mt-2 max-w-2xl leading-relaxed">
              Explore our imperial repertoire of niche perfumes, compounded with rare extracts and aged essential oils for extraordinary sillage and elegance.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="bg-white border border-[#e8e6e1] p-5 sm:p-7 mb-10 shadow-sm space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search */}
              <div className="md:col-span-5">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, note (Oud, Vanilla, Amber), or collection..."
                    className="w-full bg-[#faf9f6] border border-[#dedad2] px-4 py-2.5 pl-10 text-xs focus:bg-white focus:outline-none focus:border-[#c5a253] transition-colors"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </form>
              </div>

              {/* Category Filter */}
              <div className="md:col-span-4 flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#faf9f6] border border-[#dedad2] px-3 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#c5a253] uppercase tracking-wider"
                >
                  <option value="all">All Fragrance Collections</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="md:col-span-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full bg-[#faf9f6] border border-[#dedad2] px-3 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#c5a253] uppercase tracking-wider"
                >
                  <option value="newest">Latest Releases</option>
                  <option value="bestseller">Bestsellers First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Quick Category Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#f0eee9]">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`text-[11px] uppercase tracking-wider px-3.5 py-1.5 font-medium border transition-colors ${
                  selectedCategory === "all"
                    ? "bg-[#0d0d0d] text-[#c5a253] border-[#0d0d0d]"
                    : "bg-[#faf9f6] text-neutral-600 border-[#e8e6e1] hover:border-black"
                }`}
              >
                All ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`text-[11px] uppercase tracking-wider px-3.5 py-1.5 font-medium border transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-[#0d0d0d] text-[#c5a253] border-[#0d0d0d]"
                      : "bg-[#faf9f6] text-neutral-600 border-[#e8e6e1] hover:border-black"
                  }`}
                >
                  {cat.name}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-5">
                <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#0d0d0d] w-3.5 h-3.5"
                  />
                  <span>In Stock Only</span>
                </label>

                {(selectedCategory !== "all" || search || inStockOnly) && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#c5a253]" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-[#736f66] mb-8 uppercase tracking-wider">
            <span>Showing {filteredProducts.length} {filteredProducts.length === 1 ? "Creation" : "Creations"}</span>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-8 h-8 border-2 border-[#0d0d0d] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Consulting Fragrance Archives...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center border border-[#e8e6e1] bg-white p-10">
              <Sparkles className="w-10 h-10 text-[#c5a253] mx-auto mb-4" />
              <h3 className="font-serif text-lg font-bold text-[#0d0d0d] mb-1">No Matching Formulations Found</h3>
              <p className="text-xs text-neutral-500 mb-6 max-w-sm mx-auto">Try adjusting your olfactory search keywords or clearing your active filters.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#0d0d0d] text-[#faf9f6] text-xs font-semibold uppercase tracking-widest hover:bg-[#222222] transition-colors"
              >
                Browse All Fragrances
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
