"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu, X, Compass, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const VALID_SLUGS = ["oriental", "winter", "summer", "best-seller", "bundles"];
  const displayCategories = categories.filter((c) => VALID_SLUGS.includes(c.slug));

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Fragrances", href: "/shop" },
    ...displayCategories.map((cat) => ({
      label: cat.name,
      href: `/category/${cat.slug}`,
    })),
    { label: "Track Order", href: "/track-order" },
    { label: "Our Story", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e8e6e1] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-black hover:text-[#c5a253] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Logo & Brand Identity */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/" className="inline-block group">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] text-[#0d0d0d] font-bold uppercase transition-transform group-hover:scale-[1.01]">
                    VITORIA
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c5a253]"></span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.35em] text-[#7a776e] uppercase">
                  HAUTE PARFUMERIE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[12px] uppercase tracking-[0.14em] transition-all relative py-1.5 ${
                    isActive
                      ? "text-black font-bold"
                      : "text-[#55524b] hover:text-black font-medium"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a253]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-[#2c2a27] hover:text-[#c5a253] transition-colors rounded-full hover:bg-[#f6f5f1]"
              aria-label="Search Fragrances"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-[#2c2a27] hover:text-[#c5a253] transition-colors rounded-full hover:bg-[#f6f5f1] flex items-center"
              aria-label="Shopping Bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#0d0d0d] text-[#c5a253] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#c5a253]/30">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Collapsible */}
        {searchOpen && (
          <div className="py-4 border-t border-[#e8e6e1] animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by fragrance name, olfactory note (Oud, Vanilla, Leather)..."
                  className="w-full bg-[#f6f5f1] border border-[#dedad2] px-4 py-2.5 pl-10 text-xs focus:bg-white focus:outline-none focus:border-[#c5a253] transition-colors"
                  autoFocus
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
              <button
                type="submit"
                className="bg-[#0d0d0d] hover:bg-[#222222] text-[#faf9f6] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2.5 text-neutral-400 hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[115px] z-50 bg-[#faf9f6] border-t border-[#e8e6e1] flex flex-col p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#e8e6e1]">
              <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.2em]">
                Collections
              </span>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium tracking-wide text-neutral-800 hover:text-black py-2.5 border-b border-[#f0eee9]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#e8e6e1] space-y-4">
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black"
            >
              <Compass className="w-4 h-4 text-[#c5a253]" />
              <span>Track Your Consignment</span>
            </Link>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-[#c5a253]" />
              <span>100% Authentic Niche Extraits • Guaranteed Longevity</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
