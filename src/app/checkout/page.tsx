"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { useCart } from "@/context/CartContext";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Tag,
  AlertCircle,
  ArrowRight,
  Lock,
} from "lucide-react";

const GOVERNORATES_LIST = [
  { en: "Cairo", ar: "القاهرة" },
  { en: "Giza", ar: "الجيزة" },
  { en: "Alexandria", ar: "الإسكندرية" },
  { en: "Qalyubia", ar: "القليوبية" },
  { en: "Sharqia", ar: "الشرقية" },
  { en: "Dakahlia", ar: "الدقهلية" },
  { en: "Gharbia", ar: "الغربية" },
  { en: "Monufia", ar: "المنوفية" },
  { en: "Damietta", ar: "دمياط" },
  { en: "Kafr El Sheikh", ar: "كفر الشيخ" },
  { en: "Beheira", ar: "البحيرة" },
  { en: "Ismailia", ar: "الإسماعيلية" },
  { en: "Suez", ar: "السويس" },
  { en: "Port Said", ar: "بورسعيد" },
  { en: "Fayoum", ar: "الفيوم" },
  { en: "Beni Suef", ar: "بني سويف" },
  { en: "Minya", ar: "المنيا" },
  { en: "Assiut", ar: "أسيوط" },
  { en: "Sohag", ar: "سوهاج" },
  { en: "Qena", ar: "قنا" },
  { en: "Luxor", ar: "الأقصر" },
  { en: "Aswan", ar: "أسوان" },
  { en: "Red Sea (Hurghada)", ar: "البحر الأحمر (الغردقة)" },
  { en: "South Sinai (Sharm)", ar: "جنوب سيناء (شرم الشيخ)" },
  { en: "North Sinai", ar: "شمال سيناء" },
  { en: "Matrouh & North Coast", ar: "مطروح والساحل الشمالي" },
  { en: "New Valley", ar: "الوادي الجديد" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    governorate: "القاهرة",
    city: "",
    address: "",
    landmark: "",
    notes: "",
    paymentMethod: "COD",
  });

  // Settings & Fees
  const [settings, setSettings] = useState<any>({
    defaultDeliveryFee: 50,
    freeShippingThreshold: 1500,
    enableFreeShipping: true,
    enableCashOnDelivery: true,
    enableInstapay: true,
    instapayInstructions: "حول لحساب إنستاباي مع إرسال الإشعار واتساب",
  });
  const [govFees, setGovFees] = useState<Record<string, number>>({});

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
          if (data.settings.governorateFees) {
            try {
              setGovFees(JSON.parse(data.settings.governorateFees));
            } catch (e) {
              console.error(e);
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  // Calculate delivery fee
  const defaultDeliveryFee = settings.defaultDeliveryFee || 50;
  const freeThreshold = typeof settings.freeShippingThreshold === "number" ? settings.freeShippingThreshold : parseFloat(settings.freeShippingThreshold) || 0;
  const isFreeShippingActive = settings.enableFreeShipping !== false && freeThreshold > 0;
  let currentDeliveryFee = govFees[formData.governorate] ?? defaultDeliveryFee;
  if (isFreeShippingActive && subtotal >= freeThreshold) {
    currentDeliveryFee = 0;
  }

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + currentDeliveryFee);

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
        setCouponError(data.error || "كود الخصم غير صالح");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data.coupon);
        setCouponError("");
      }
    } catch {
      setCouponError("حدث خطأ أثناء فحص الكود");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Your shopping bag is empty. Please select your fragrances first.");
      return;
    }

    if (!formData.customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    // Validate Egyptian Phone
    const cleanPhone = formData.customerPhone.replace(/[\s\-\+]/g, "");
    const isValidPhone = /^01[0125][0-9]{8}$/.test(cleanPhone) || /^201[0125][0-9]{8}$/.test(cleanPhone);
    if (!isValidPhone) {
      setErrorMessage("Please enter a valid 11-digit Egyptian phone number (e.g. 010, 011, 012, or 015).");
      return;
    }

    if (!formData.city.trim() || !formData.address.trim()) {
      setErrorMessage("Please complete your delivery address details (city/district and street address).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          customerPhone: formData.customerPhone.trim(),
          customerEmail: formData.customerEmail?.trim() || null,
          governorate: formData.governorate,
          city: formData.city.trim(),
          address: formData.address.trim(),
          landmark: formData.landmark?.trim() || null,
          notes: formData.notes?.trim() || null,
          paymentMethod: formData.paymentMethod,
          couponCode: appliedCoupon?.code || null,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            size: i.size,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "An error occurred while creating your consignment. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Order created successfully!
      clearCart();
      router.push(`/order-confirmation/${data.order.orderNumber}`);
    } catch (err) {
      console.error(err);
      setErrorMessage("Network connection error. Please check your internet and retry.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col selection:bg-[#c5a253]/20">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b border-[#e8e6e1] pb-6 mb-10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block mb-1">
                Secure Consignment Checkout
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#0d0d0d]">
                Shipping & Client Details
              </h1>
            </div>
            <Link
              href="/cart"
              className="text-xs font-semibold text-[#55524b] hover:text-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <span>Review Bag</span>
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="py-20 text-center border border-[#e8e6e1] bg-white p-10 max-w-lg mx-auto shadow-sm">
              <p className="font-serif text-lg font-bold text-[#0d0d0d] mb-4">Your Shopping Bag is Empty</p>
              <Link
                href="/shop"
                className="inline-block bg-[#0d0d0d] text-[#faf9f6] px-7 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-[#252525] transition-colors"
              >
                Explore Fragrance Atelier
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Form Fields Column */}
              <div className="lg:col-span-7 space-y-8">
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 1. Customer Info */}
                <div className="bg-white border border-[#e8e6e1] p-6 sm:p-7 space-y-5 shadow-sm">
                  <h3 className="font-serif font-bold text-base text-[#0d0d0d] border-b border-[#f0eee9] pb-3 flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#0d0d0d] text-[#c5a253] text-[10px] flex items-center justify-center font-bold">
                      1
                    </span>
                    <span>Recipient Information</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#55524b] mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        placeholder="e.g. Tarek Al-Masry"
                        className="w-full bg-[#faf9f6] border border-[#dedad2] px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-[#c5a253] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#55524b] mb-1.5">
                          Phone Number (For Courier) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.customerPhone}
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                          placeholder="e.g. 01012345678"
                          className="w-full bg-[#faf9f6] border border-[#dedad2] px-4 py-2.5 text-xs font-mono focus:bg-white focus:outline-none focus:border-[#c5a253] transition-colors"
                        />
                        <span className="text-[10px] text-neutral-400 mt-1 block">
                          Courier will contact you on this number
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#55524b] mb-1.5">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                          placeholder="To receive digital invoice"
                          className="w-full bg-[#faf9f6] border border-[#dedad2] px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-[#c5a253] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Delivery Address */}
                <div className="bg-white border border-[#e8e6e1] p-6 sm:p-7 space-y-5 shadow-sm">
                  <h3 className="font-serif font-bold text-base text-[#0d0d0d] border-b border-[#f0eee9] pb-3 flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#0d0d0d] text-[#c5a253] text-[10px] flex items-center justify-center font-bold">
                      2
                    </span>
                    <span>Delivery Address in Egypt</span>
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#55524b] mb-1.5">
                          Governorate <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.governorate}
                          onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                          className="w-full bg-[#faf9f6] border border-[#dedad2] px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-[#c5a253] font-medium"
                        >
                          {GOVERNORATES_LIST.map((gov) => (
                            <option key={gov.ar} value={gov.ar}>
                              {gov.en} ({gov.ar})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#55524b] mb-1.5">
                          City / District / Area <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g. New Cairo / Maadi / Smouha"
                          className="w-full bg-[#faf9f6] border border-[#dedad2] px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-[#c5a253]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#55524b] mb-1.5">
                        Detailed Street Address (Building, Floor, Apt) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="e.g. 45 North 90th Street, 3rd Floor, Apt 6"
                        className="w-full bg-[#faf9f6] border border-[#dedad2] px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-[#c5a253]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#55524b] mb-1.5">
                        Prominent Nearby Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                        placeholder="e.g. Near Dusit Thani or in front of El Ezaby Pharmacy"
                        className="w-full bg-[#faf9f6] border border-[#dedad2] px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-[#c5a253]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#55524b] mb-1.5">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="e.g. Please call 30 minutes before arrival, delivery after 3 PM preferred"
                        className="w-full bg-[#faf9f6] border border-[#dedad2] p-3 text-xs focus:bg-white focus:outline-none focus:border-[#c5a253] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div className="bg-white border border-[#e8e6e1] p-6 sm:p-7 space-y-5 shadow-sm">
                  <h3 className="font-serif font-bold text-base text-[#0d0d0d] border-b border-[#f0eee9] pb-3 flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#0d0d0d] text-[#c5a253] text-[10px] flex items-center justify-center font-bold">
                      3
                    </span>
                    <span>Payment Method</span>
                  </h3>

                  <div className="space-y-3">
                    {settings.enableCashOnDelivery && (
                      <label
                        className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all ${
                          formData.paymentMethod === "COD"
                            ? "border-[#0d0d0d] bg-[#faf9f6] shadow-xs"
                            : "border-[#e8e6e1] bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={formData.paymentMethod === "COD"}
                          onChange={() => setFormData({ ...formData, paymentMethod: "COD" })}
                          className="mt-1 accent-[#0d0d0d]"
                        />
                        <div className="flex-1">
                          <span className="font-serif font-bold text-sm text-[#0d0d0d] block">
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-xs text-[#66635c] block mt-0.5">
                            Inspect your fragrance package upon arrival and pay cash directly to the courier.
                          </span>
                        </div>
                      </label>
                    )}

                    {settings.enableInstapay && (
                      <label
                        className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-all ${
                          formData.paymentMethod === "INSTAPAY"
                            ? "border-[#0d0d0d] bg-[#faf9f6] shadow-xs"
                            : "border-[#e8e6e1] bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="INSTAPAY"
                          checked={formData.paymentMethod === "INSTAPAY"}
                          onChange={() => setFormData({ ...formData, paymentMethod: "INSTAPAY" })}
                          className="mt-1 accent-[#0d0d0d]"
                        />
                        <div className="flex-1">
                          <span className="font-serif font-bold text-sm text-[#0d0d0d] block">
                            Instant Bank Transfer (InstaPay)
                          </span>
                          <span className="text-xs text-[#66635c] block mt-0.5">
                            {settings.instapayInstructions ||
                              "Transfer instantly via InstaPay to vitoria@instapay and send the receipt to WhatsApp."}
                          </span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items & Summary Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-[#e8e6e1] p-6 sm:p-7 space-y-6 sticky top-24 shadow-sm">
                  <h3 className="font-serif font-bold text-base text-[#0d0d0d] border-b border-[#f0eee9] pb-3">
                    Consignment Manifest ({items.length})
                  </h3>

                  {/* Items mini list */}
                  <div className="max-h-64 overflow-y-auto divide-y divide-[#ece9e2] pr-1">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.size}`}
                        className="py-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 bg-[#faf9f6] border border-[#e8e6e1] shrink-0 overflow-hidden">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <span className="font-serif font-bold text-[#0d0d0d] block line-clamp-1">
                              {item.nameEn || item.name}
                            </span>
                            <span className="text-[11px] text-[#736f66] font-mono">
                              {item.size} × {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-serif font-bold text-[#0d0d0d] shrink-0">
                          {(item.price * item.quantity).toLocaleString()} EGP
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Form */}
                  <div className="pt-2 border-t border-[#f0eee9]">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Privilege Code (optional)"
                        className="flex-1 bg-[#faf9f6] border border-[#dedad2] px-3 py-2 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-[#c5a253]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="bg-[#0d0d0d] hover:bg-[#252525] disabled:bg-neutral-300 text-[#faf9f6] px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
                    )}
                    {appliedCoupon && (
                      <p className="text-[11px] text-emerald-800 font-semibold mt-1 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#c5a253]" />
                        <span>Code {appliedCoupon.code} applied (-{discountAmount} EGP)</span>
                      </p>
                    )}
                  </div>

                  {/* Totals Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-[#f0eee9] text-xs">
                    <div className="flex justify-between text-[#66635c]">
                      <span className="uppercase tracking-wider">Subtotal</span>
                      <span className="font-serif font-bold text-sm text-[#0d0d0d]">{subtotal.toLocaleString()} EGP</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-800 font-semibold">
                        <span>Privilege Discount</span>
                        <span>-{discountAmount.toLocaleString()} EGP</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#66635c] items-center">
                      <span className="uppercase tracking-wider">Delivery ({formData.governorate})</span>
                      <span className="font-serif font-bold text-[#0d0d0d]">
                        {currentDeliveryFee === 0 ? (
                          <span className="text-emerald-800 font-bold uppercase tracking-wider">Complimentary</span>
                        ) : (
                          `${currentDeliveryFee} EGP`
                        )}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-[#f0eee9] flex justify-between items-baseline text-sm">
                      <span className="font-serif font-bold text-base text-[#0d0d0d]">Total Due</span>
                      <span className="font-serif font-bold text-2xl text-[#0d0d0d]">
                        {finalTotal.toLocaleString()} EGP
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0d0d0d] hover:bg-[#252525] disabled:bg-neutral-400 text-[#faf9f6] py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#c5a253] border-t-transparent rounded-full animate-spin" />
                        <span>Confirming Consignment...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-[#c5a253]" />
                        <span>Confirm Order Now</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#736f66] pt-1">
                    <Lock className="w-3.5 h-3.5 text-[#c5a253]" />
                    <span>100% Encrypted & Confidential Consignment</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
