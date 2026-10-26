"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag, Tag, CheckCircle2 } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, cartCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1500);
  const [enableFreeShipping, setEnableFreeShipping] = useState(true);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          if (typeof data.settings.freeShippingThreshold === "number") {
            setFreeShippingThreshold(data.settings.freeShippingThreshold);
          }
          if (typeof data.settings.enableFreeShipping === "boolean") {
            setEnableFreeShipping(data.settings.enableFreeShipping);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "كود الخصم غير صحيح");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data.coupon);
        setCouponError("");
      }
    } catch {
      setCouponError("حدث خطأ أثناء فحص الكوبون");
    } finally {
      setCouponLoading(false);
    }
  };

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col selection:bg-[#c5a253]/20">
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />

      <main className="flex-1 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-[#e8e6e1] pb-6 mb-8 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block mb-1">
                Your Selection
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#0d0d0d]">
                Shopping Bag ({cartCount})
              </h1>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-neutral-400 hover:text-red-600 transition-colors uppercase tracking-wider"
              >
                Clear Entire Bag
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="py-24 text-center border border-[#e8e6e1] bg-white p-10 max-w-xl mx-auto shadow-sm">
              <ShoppingBag className="w-12 h-12 text-[#c5a253] mx-auto mb-4" />
              <h2 className="font-serif text-xl font-bold text-[#0d0d0d] mb-2">Your Bag is Empty</h2>
              <p className="text-xs text-neutral-500 mb-8 max-w-sm mx-auto leading-relaxed">
                You have not curated any fragrances yet. Explore our imperial collections to discover your signature flacon.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#0d0d0d] hover:bg-[#252525] text-[#faf9f6] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
              >
                <span>Explore Fragrance Atelier</span>
                <ArrowRight className="w-4 h-4 text-[#c5a253]" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Items List */}
              <div className="lg:col-span-8 space-y-6">
                {/* Free Shipping Alert */}
                {enableFreeShipping && freeShippingThreshold > 0 && (
                  <div className="p-4 bg-[#f4f2ec] border border-[#e8e6e1]">
                    {remainingForFreeShipping > 0 ? (
                      <div>
                        <p className="text-xs text-[#524f48] mb-2 font-medium">
                          Add <span className="font-bold text-[#0d0d0d] font-mono">{remainingForFreeShipping.toFixed(0)} EGP</span> more to unlock <span className="text-[#c5a253] font-bold">Complimentary Express Delivery</span>!
                        </p>
                        <div className="w-full bg-[#dedad1] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#c5a253] h-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Privilege Unlocked: Complimentary express shipping applied to your consignment.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Table of items */}
                <div className="border border-[#e8e6e1] divide-y divide-[#ece9e2] bg-white shadow-sm">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-20 h-24 bg-[#faf9f6] border border-[#e8e6e1] shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 font-serif">
                              VITORIA
                            </div>
                          )}
                        </div>

                        <div className="text-left">
                          <Link
                            href={`/product/${item.slug}`}
                            className="font-serif font-bold text-sm text-[#0d0d0d] hover:text-[#c5a253] transition-colors"
                          >
                            {item.nameEn || item.name}
                          </Link>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[11px] text-[#55524b] bg-[#f0eee9] px-2 py-0.5 font-mono uppercase">
                              Volume: {item.size}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-neutral-400 font-mono">
                            Unit Price: {item.price.toLocaleString()} EGP
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#f0eee9]">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-[#dedad2] bg-white h-9">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                            className="px-2.5 h-full hover:bg-[#faf9f6] text-neutral-600 text-xs transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold text-black min-w-[28px] text-center font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                            className="px-2.5 h-full hover:bg-[#faf9f6] text-neutral-600 text-xs transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right font-serif font-bold text-base text-[#0d0d0d] min-w-[90px]">
                          {(item.price * item.quantity).toLocaleString()} EGP
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#55524b] hover:text-black uppercase tracking-wider transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Continue Exploring Fragrances</span>
                  </Link>
                </div>
              </div>

              {/* Order Summary Column */}
              <div className="lg:col-span-4">
                <div className="bg-white border border-[#e8e6e1] p-6 sm:p-7 space-y-6 shadow-sm">
                  <h3 className="font-serif font-bold text-base text-[#0d0d0d] border-b border-[#f0eee9] pb-3">
                    Order Summary
                  </h3>

                  {/* Coupon Input */}
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#55524b] block">
                      Privilege Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 bg-[#faf9f6] border border-[#dedad2] px-3 py-2 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-[#c5a253]"
                      />
                      <button
                        type="submit"
                        disabled={couponLoading || !couponCode.trim()}
                        className="bg-[#0d0d0d] hover:bg-[#252525] disabled:bg-neutral-300 text-[#faf9f6] px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600">{couponError}</p>
                    )}
                    {appliedCoupon && (
                      <p className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#c5a253]" />
                        <span>Code {appliedCoupon.code} applied successfully!</span>
                      </p>
                    )}
                  </form>

                  {/* Cost breakdown */}
                  <div className="space-y-3 pt-4 border-t border-[#f0eee9] text-xs">
                    <div className="flex justify-between text-[#66635c]">
                      <span className="uppercase tracking-wider">Subtotal</span>
                      <span className="font-serif font-bold text-sm text-[#0d0d0d]">{subtotal.toLocaleString()} EGP</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-800 font-semibold">
                        <span>Privilege Discount ({appliedCoupon.code})</span>
                        <span>-{discountAmount.toLocaleString()} EGP</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#66635c]">
                      <span className="uppercase tracking-wider">Estimated Shipping</span>
                      <span>
                        {enableFreeShipping && freeShippingThreshold > 0 && remainingForFreeShipping <= 0 ? (
                          <span className="text-emerald-800 font-bold uppercase tracking-wider">Complimentary</span>
                        ) : (
                          "Calculated at Checkout"
                        )}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#f0eee9] flex justify-between items-baseline text-sm">
                      <span className="font-serif font-bold text-base text-[#0d0d0d]">Estimated Total</span>
                      <span className="font-serif font-bold text-xl text-[#0d0d0d]">
                        {(subtotal - discountAmount).toLocaleString()} EGP
                      </span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 bg-[#0d0d0d] hover:bg-[#252525] text-[#faf9f6] py-4 text-xs font-semibold tracking-[0.18em] uppercase transition-colors shadow-sm"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#c5a253]" />
                  </Link>

                  <div className="text-center text-[11px] text-[#736f66]">
                    Cash on Delivery & InstaPay accepted across Egypt
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
