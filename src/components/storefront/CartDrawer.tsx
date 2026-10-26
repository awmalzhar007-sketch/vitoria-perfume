"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, cartCount } = useCart();
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

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = freeShippingThreshold > 0 ? Math.min(100, (subtotal / freeShippingThreshold) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-[#faf9f6] h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 border-l border-[#e8e6e1]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e8e6e1] bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#c5a253]" />
            <h2 className="font-serif font-bold text-base tracking-wide text-[#0d0d0d]">
              Shopping Bag ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-[#f5f4f0] rounded-full text-neutral-500 hover:text-black transition-colors"
            aria-label="Close Bag"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {enableFreeShipping && freeShippingThreshold > 0 && items.length > 0 && (
          <div className="p-4 bg-[#f4f2ec] border-b border-[#e8e6e1]">
            {remainingForFreeShipping > 0 ? (
              <div>
                <p className="text-xs text-[#524f48] mb-2 font-medium">
                  Add <span className="font-bold text-[#0d0d0d] font-mono">{remainingForFreeShipping.toFixed(0)} EGP</span> more to enjoy <span className="text-[#c5a253] font-bold">Complimentary Delivery</span>!
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
                <span>Privilege Unlocked: Complimentary express shipping applied to your order.</span>
              </div>
            )}
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#ece9e2]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <div className="w-16 h-16 rounded-full bg-[#ece9e2] flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-[#8f8b82]" />
              </div>
              <p className="font-serif text-lg font-bold text-[#1a1917] mb-1">Your Bag is Empty</p>
              <p className="text-xs text-neutral-500 mb-6 max-w-xs">Explore our haute parfumerie collections and find your signature olfactory portrait.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-[#0d0d0d] text-[#faf9f6] text-xs font-semibold tracking-[0.16em] uppercase hover:bg-[#252525] transition-colors"
              >
                Explore Fragrances
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                <div className="relative w-20 h-24 bg-white border border-[#e8e6e1] overflow-hidden shrink-0">
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

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-serif font-bold text-sm text-[#0d0d0d] line-clamp-1">
                        {item.nameEn || item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#f0eee9] text-[#55524b] text-[10px] font-mono uppercase tracking-wider">
                      Flacon: {item.size}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#dedad2] bg-white">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="p-1.5 hover:bg-[#f6f5f1] text-neutral-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-black min-w-[24px] text-center font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="p-1.5 hover:bg-[#f6f5f1] text-neutral-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right font-serif font-bold text-sm text-[#0d0d0d]">
                      {(item.price * item.quantity).toLocaleString()} EGP
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#e8e6e1] bg-white space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#66635c] uppercase text-xs tracking-wider">Subtotal</span>
              <span className="font-serif text-lg font-bold text-[#0d0d0d]">{subtotal.toLocaleString()} EGP</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              * Delivery fees and promotional privileges are applied at checkout.
            </p>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#0d0d0d] hover:bg-[#252525] text-[#faf9f6] py-3.5 px-4 text-xs font-bold tracking-[0.16em] uppercase transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#c5a253]" />
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center bg-[#faf9f6] border border-[#dedad2] hover:border-black text-[#111111] py-2.5 px-4 text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                Review Full Bag
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
