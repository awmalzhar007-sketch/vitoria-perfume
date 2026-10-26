"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Check,
  Phone,
  MessageCircle,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Share2,
  Heart,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { FragrancePyramid } from "@/components/storefront/FragrancePyramid";
import { ProductCard } from "@/components/storefront/ProductCard";

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
  whatsappNumber: string;
}

export function ProductDetailClient({
  product,
  relatedProducts,
  whatsappNumber,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: "/uploads/1 million royal.jpeg" }];

  const [selectedImage, setSelectedImage] = useState(images[0]?.url);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.find((s: any) => s.isDefault)?.size || product.sizes?.[0]?.size || "100ml"
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Active size data
  const currentSizeObj = product.sizes?.find((s: any) => s.size === selectedSize) || product.sizes?.[0];
  const activePrice = currentSizeObj?.price || product.price;
  const activeOriginalPrice = currentSizeObj?.originalPrice || product.originalPrice;

  const discountPercent =
    activeOriginalPrice && activeOriginalPrice > activePrice
      ? Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        nameEn: product.nameEn || undefined,
        slug: product.slug,
        image: selectedImage || images[0]?.url,
        size: selectedSize,
        price: activePrice,
        originalPrice: activeOriginalPrice || undefined,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        nameEn: product.nameEn || undefined,
        slug: product.slug,
        image: selectedImage || images[0]?.url,
        size: selectedSize,
        price: activePrice,
        originalPrice: activeOriginalPrice || undefined,
      },
      quantity
    );
    router.push("/checkout");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription || product.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappInquiryUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Hello VITORIA Concierge, I would like to inquire about "${product.nameEn || product.name}".`
  )}`;

  return (
    <div className="space-y-16 selection:bg-[#c5a253]/20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#736f66] uppercase tracking-wider">
        <Link href="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <Link href="/shop" className="hover:text-black transition-colors">
          Atelier
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <Link
              href={`/category/${product.category.slug}`}
              className="hover:text-black transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-black font-semibold line-clamp-1">{product.nameEn || product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square bg-white border border-[#dedad2] shadow-sm overflow-hidden">
            <img
              src={selectedImage}
              alt={product.nameEn || product.name}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 bg-[#c5a253] text-black text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                Save {discountPercent}%
              </span>
            )}
            {product.isBestseller && (
              <span className="absolute top-4 right-4 bg-[#0d0d0d] text-[#c5a253] text-[10px] font-bold px-3 py-1 uppercase tracking-[0.16em] border border-[#c5a253]/30">
                Bestseller
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 bg-white border shrink-0 transition-all ${
                    selectedImage === img.url
                      ? "border-[#0d0d0d] ring-1 ring-[#0d0d0d]"
                      : "border-[#e8e6e1] opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} - ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Purchasing Column */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Brand & Category badges */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#faf6ec] text-[#9b7625] border border-[#c5a253]/30 font-semibold text-[10px] uppercase tracking-[0.18em]">
                {product.category?.name || "Haute Parfumerie"}
              </span>
              {product.brandCollection && (
                <span className="text-[#78756e] font-serif text-xs">
                  {product.brandCollection}
                </span>
              )}
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-neutral-500 hover:text-black transition-colors"
              title="Share Fragrance"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-wider">{copied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>

          {/* Titles */}
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0d0d0d] mb-1">
              {product.nameEn || product.name}
            </h1>
            {product.nameEn && product.name !== product.nameEn && (
              <p className="text-sm font-serif text-[#8f8b82]">
                {product.name}
              </p>
            )}
          </div>

          {/* Concentration & Inspiration info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#55524b] bg-white p-3.5 border border-[#e8e6e1]">
            <div>
              <span className="text-[#8c887f] uppercase text-[10px] tracking-wider block">Concentration</span>
              <span className="font-serif font-bold text-sm text-[#0d0d0d]">{product.concentration || "Extrait de Parfum (Pure Parfum)"}</span>
            </div>
            {product.inspiration && (
              <>
                <span className="text-[#dedad2]">|</span>
                <div>
                  <span className="text-[#8c887f] uppercase text-[10px] tracking-wider block">Inspiration</span>
                  <span className="font-medium text-[#1a1917]">{product.inspiration}</span>
                </div>
              </>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 py-3 border-y border-[#e8e6e1]">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#0d0d0d]">
              {activePrice.toLocaleString()} EGP
            </span>
            {activeOriginalPrice && activeOriginalPrice > activePrice && (
              <span className="text-base text-neutral-400 line-through">
                {activeOriginalPrice.toLocaleString()} EGP
              </span>
            )}
            <span className="text-xs text-[#736f66] ml-auto uppercase tracking-wider">
              Taxes Included
            </span>
          </div>

          {/* Stock Availability status */}
          <div>
            {product.stockQuantity > 3 ? (
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>In Stock — Ready for immediate dispatch across Egypt</span>
              </div>
            ) : product.stockQuantity > 0 ? (
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>Limited Stock: Only {product.stockQuantity} flacons remain in the reserve</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                <span>Macerating New Batch: Sold Out Temporarily</span>
              </div>
            )}
          </div>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-black block">Choose Flacon Volume:</span>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((sz: any) => (
                  <button
                    key={sz.size}
                    type="button"
                    onClick={() => setSelectedSize(sz.size)}
                    className={`px-4 py-2.5 text-xs font-semibold border transition-all ${
                      selectedSize === sz.size
                        ? "border-[#0d0d0d] bg-[#0d0d0d] text-[#c5a253]"
                        : "border-[#dedad2] bg-white text-[#111111] hover:border-black"
                    }`}
                  >
                    <span>{sz.size}</span>
                    <span className="ml-2 text-[10px] opacity-75 font-mono">
                      ({sz.price.toLocaleString()} EGP)
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity counter */}
              <div className="flex items-center border border-[#dedad2] bg-white h-12">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 h-full hover:bg-[#faf9f6] text-neutral-600 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-black min-w-[36px] text-center font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 h-full hover:bg-[#faf9f6] text-neutral-600 font-bold transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className={`flex-1 h-12 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
                  product.stockQuantity <= 0
                    ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                    : added
                    ? "bg-emerald-800 text-white"
                    : "bg-[#0d0d0d] hover:bg-[#252525] text-[#faf9f6]"
                }`}
              >
                {product.stockQuantity <= 0 ? (
                  <span>Sold Out</span>
                ) : added ? (
                  <>
                    <Check className="w-4 h-4 text-[#c5a253]" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#c5a253]" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Checkout button */}
            {product.stockQuantity > 0 && (
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-12 border border-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-[#faf9f6] text-[#0d0d0d] text-xs font-bold uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2"
              >
                <span>Instant Checkout (Cash on Delivery or InstaPay)</span>
              </button>
            )}

            {/* WhatsApp Quick Order */}
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 bg-[#faf6ec] hover:bg-[#f3edd9] text-[#7d5e1c] border border-[#c5a253]/35 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#c5a253]" />
              <span>Inquire with Maison Concierge (WhatsApp)</span>
            </a>
          </div>

          {/* Delivery & Assurance info */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#e8e6e1] text-xs text-[#66635c]">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#c5a253] shrink-0" />
              <span>Express Delivery in 24-48 Hours</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#c5a253] shrink-0" />
              <span>Inspect Flacon Upon Delivery</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#c5a253] shrink-0" />
              <span>100% Authentic Niche Oils</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#c5a253] shrink-0" />
              <span>Complimentary Discovery Vial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fragrance Description & Notes Pyramid */}
      <div className="space-y-8 pt-8 border-t border-[#e8e6e1]">
        {/* Full Description */}
        <div className="bg-white border border-[#e8e6e1] p-6 sm:p-10 shadow-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#0d0d0d] border-b border-[#f0eee9] pb-4">
            The Olfactory Narrative
          </h2>
          <div className="text-xs sm:text-sm text-[#4d4a44] leading-relaxed whitespace-pre-line font-normal">
            {product.description}
          </div>
        </div>

        {/* Fragrance Pyramid Visual */}
        <FragrancePyramid
          topNotes={product.topNotes}
          heartNotes={product.heartNotes}
          baseNotes={product.baseNotes}
        />
      </div>

      {/* Related Perfumes Recommendations */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#e8e6e1] space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block mb-1">
                You May Also Appreciate
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d0d0d]">
                Companions from this Collection
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:text-[#c5a253] transition-colors"
            >
              View Atelier
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
