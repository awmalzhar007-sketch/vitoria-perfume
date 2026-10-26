"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Eye, Check, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    nameEn?: string | null;
    slug: string;
    price: number;
    originalPrice?: number | null;
    shortDescription?: string | null;
    concentration?: string;
    isFeatured?: boolean;
    isBestseller?: boolean;
    isNewArrival?: boolean;
    stockQuantity: number;
    category?: {
      name: string;
      slug: string;
    };
    images: Array<{
      url: string;
      isPrimary: boolean;
    }>;
    sizes: Array<{
      size: string;
      price: number;
      originalPrice?: number | null;
      isDefault: boolean;
    }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop";

  const hoverImage =
    product.images?.[1]?.url || primaryImage;

  const defaultSize =
    product.sizes?.find((s) => s.isDefault) || product.sizes?.[0];

  const [selectedSize, setSelectedSize] = useState(defaultSize?.size || "100ml");
  const currentSizeObj = product.sizes?.find((s) => s.size === selectedSize) || defaultSize;

  const activePrice = currentSizeObj?.price || product.price;
  const activeOriginalPrice = currentSizeObj?.originalPrice || product.originalPrice;

  const discountPercent =
    activeOriginalPrice && activeOriginalPrice > activePrice
      ? Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100)
      : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(
      {
        productId: product.id,
        name: product.name,
        nameEn: product.nameEn || undefined,
        slug: product.slug,
        image: primaryImage,
        size: selectedSize,
        price: activePrice,
        originalPrice: activeOriginalPrice || undefined,
      },
      1
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group relative bg-white border border-[#eeeeee] hover:border-[#c5a253]/50 transition-all duration-300 flex flex-col justify-between">
      {/* Product Image Box */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-[#fafafa] overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestseller && (
            <span className="bg-[#0d0d0d] text-[#c5a253] text-[9px] font-bold px-2 py-0.5 tracking-[0.18em] uppercase border border-[#c5a253]/30">
              Bestseller
            </span>
          )}
          {discountPercent && (
            <span className="bg-[#c5a253] text-black text-[9px] font-bold px-2 py-0.5 tracking-[0.14em] uppercase">
              Save {discountPercent}%
            </span>
          )}
          {product.isNewArrival && !product.isBestseller && (
            <span className="bg-[#1e1d1a] text-white text-[9px] font-medium px-2 py-0.5 tracking-[0.14em] uppercase">
              New In
            </span>
          )}
        </div>

        {/* Quick View Overlay on Desktop */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 text-black text-[11px] font-semibold tracking-wider uppercase px-4 py-2 flex items-center gap-2 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-[#c5a253]" />
            <span>Discover Fragrance</span>
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Concentration */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-2">
            <span className="text-[#c5a253] font-semibold">
              {product.category?.name || "Haute Parfumerie"}
            </span>
            <span className="text-neutral-500 font-mono">
              {product.concentration ? product.concentration.split("(")[0].trim() : "EDP"}
            </span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif font-bold text-base text-[#111111] group-hover:text-[#c5a253] transition-colors line-clamp-1 mb-1">
              {product.nameEn || product.name}
            </h3>
          </Link>

          {/* Arabic title as an authentic heritage subtitle if nameEn is used */}
          {product.nameEn && product.name !== product.nameEn && (
            <p className="text-[11px] text-[#8c887f] line-clamp-1 mb-2 font-serif">
              {product.name.split("|")[0].trim()}
            </p>
          )}

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-xs text-neutral-500 line-clamp-2 mb-3 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Size Selector if multiple sizes */}
          {product.sizes && product.sizes.length > 1 && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.sizes.map((sz) => (
                <button
                  key={sz.size}
                  type="button"
                  onClick={() => setSelectedSize(sz.size)}
                  className={`text-[10px] px-2 py-0.5 tracking-wider uppercase font-medium border transition-colors ${
                    selectedSize === sz.size
                      ? "border-[#0d0d0d] bg-[#0d0d0d] text-[#c5a253]"
                      : "border-[#e8e6e1] bg-[#faf9f6] text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  {sz.size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 border-t border-[#f0eee9]">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-base text-[#0d0d0d]">
                {activePrice.toLocaleString()} EGP
              </span>
              {activeOriginalPrice && activeOriginalPrice > activePrice && (
                <span className="text-xs text-neutral-400 line-through">
                  {activeOriginalPrice.toLocaleString()} EGP
                </span>
              )}
            </div>

            {product.stockQuantity <= 3 && product.stockQuantity > 0 && (
              <span className="text-[10px] text-amber-700 font-medium">
                Only {product.stockQuantity} left
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stockQuantity <= 0}
            className={`w-full py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
              product.stockQuantity <= 0
                ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                : added
                ? "bg-emerald-800 text-white"
                : "bg-[#0d0d0d] hover:bg-[#222222] text-[#faf9f6]"
            }`}
          >
            {product.stockQuantity <= 0 ? (
              <span>Sold Out</span>
            ) : added ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#c5a253]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#c5a253]" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
