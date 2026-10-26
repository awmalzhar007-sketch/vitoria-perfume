"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Truck, RefreshCw, Award, Lock, ArrowRight } from "lucide-react";

export function Footer() {
  const [settings, setSettings] = useState<any>({
    phone: "0220488620",
    whatsappNumber: "01026673838",
    email: "abdoelssayer@gmail.com",
    address: "شارع التسعين الشمالي، التجمع الخامس، القاهرة، مصر",
  });

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#0d0c0a] border-t border-[#22201c] text-[#e8e4dc]">
      {/* Brand Value Pillars */}
      <div className="border-b border-[#22201c] bg-[#12110e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            <div className="flex items-center gap-4 justify-start">
              <div className="w-12 h-12 rounded-full bg-[#1c1a16] border border-[#332f28] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#c5a253]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#f5f3ef]">100% Authentic Niche</h4>
                <p className="text-xs text-[#9c978d] mt-0.5">Pure French & Oriental essences</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-start">
              <div className="w-12 h-12 rounded-full bg-[#1c1a16] border border-[#332f28] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#c5a253]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#f5f3ef]">Express Nationwide Delivery</h4>
                <p className="text-xs text-[#9c978d] mt-0.5">
                  {settings.enableFreeShipping !== false && Number(settings.freeShippingThreshold) > 0
                    ? `Complimentary over ${Number(settings.freeShippingThreshold).toLocaleString()} EGP`
                    : "Fast delivery to all governorates"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-start">
              <div className="w-12 h-12 rounded-full bg-[#1c1a16] border border-[#332f28] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#c5a253]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#f5f3ef]">Unmatched 24H+ Sillage</h4>
                <p className="text-xs text-[#9c978d] mt-0.5">High concentration Extraits</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-start">
              <div className="w-12 h-12 rounded-full bg-[#1c1a16] border border-[#332f28] flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-[#c5a253]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#f5f3ef]">Cash on Delivery & InstaPay</h4>
                <p className="text-xs text-[#9c978d] mt-0.5">Inspect parcel upon delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-2">
                <span className="font-serif font-extrabold text-2xl tracking-[0.25em] text-[#faf9f6] uppercase">
                  VITORIA
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a253]"></span>
              </div>
              <span className="text-[10px] font-semibold tracking-[0.35em] text-[#c5a253] uppercase block mt-1">
                HAUTE PARFUMERIE
              </span>
            </Link>
            <p className="text-xs text-[#a39e94] leading-relaxed max-w-sm">
              An illustrious fragrance house reimagining the secrets of rare oriental perfumery with contemporary Parisian elegance. We formulate imperial reserves that captivate and endure.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/${(settings.whatsappNumber || "01026673838").replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1c1a16] hover:bg-[#c5a253] hover:text-black flex items-center justify-center text-[#d4cfc5] transition-all"
                aria-label="WhatsApp Concierge"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${settings.phone || "0220488620"}`}
                className="w-9 h-9 rounded-full bg-[#1c1a16] hover:bg-[#c5a253] hover:text-black flex items-center justify-center text-[#d4cfc5] transition-all"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings.email || "contact@vitoria.com"}`}
                className="w-9 h-9 rounded-full bg-[#1c1a16] hover:bg-[#c5a253] hover:text-black flex items-center justify-center text-[#d4cfc5] transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Fragrance Collections */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c5a253] mb-4">
              Collections
            </h3>
            <ul className="space-y-2.5 text-xs text-[#a39e94]">
              <li>
                <Link href="/shop" className="hover:text-[#faf9f6] transition-colors">
                  All Fragrances
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-[#faf9f6] transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Care */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c5a253] mb-4">
              Client Care
            </h3>
            <ul className="space-y-2.5 text-xs text-[#a39e94]">
              <li>
                <Link href="/track-order" className="hover:text-[#faf9f6] transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#faf9f6] transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#faf9f6] transition-colors">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#faf9f6] transition-colors">
                  Private Concierge
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-[#faf9f6] transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#faf9f6] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#faf9f6] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Maison Contact */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c5a253] mb-4">
              Maison Address
            </h3>
            <ul className="space-y-3 text-xs text-[#a39e94]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c5a253] shrink-0 mt-0.5" />
                <span>{settings.address || "North 90th Street, New Cairo, Egypt"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#c5a253] shrink-0" />
                <span className="font-mono">{settings.phone || "0220488620"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#c5a253] shrink-0" />
                <span>{settings.email || "contact@vitoria.com"}</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-[#22201c]">
              <span className="text-[10px] uppercase tracking-wider text-[#736f66] block mb-2">Accepted Payments</span>
              <div className="flex flex-wrap gap-1.5 text-[10px] text-[#c7c3ba]">
                <span className="px-2 py-1 bg-[#1c1a16] rounded border border-[#2f2b24]">Cash on Delivery</span>
                <span className="px-2 py-1 bg-[#1c1a16] rounded border border-[#2f2b24]">InstaPay</span>
                <span className="px-2 py-1 bg-[#1c1a16] rounded border border-[#2f2b24]">Mobile Wallets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#22201c] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#736f66]">
          <p>© {new Date().getFullYear()} VITORIA Haute Parfumerie. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 text-[#736f66] hover:text-[#c5a253] transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
