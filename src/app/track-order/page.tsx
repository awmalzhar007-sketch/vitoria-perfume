"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import {
  Compass,
  Search,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Phone,
} from "lucide-react";

const ORDER_STEPS = [
  { key: "NEW", title: "Order Placed", desc: "Registered and awaiting curation confirmation", icon: Clock },
  { key: "CONFIRMED", title: "Confirmed", desc: "Address and flacon selection verified", icon: CheckCircle2 },
  { key: "PREPARING", title: "Atelier Preparation", desc: "Bottling, packaging & seal inspection", icon: Package },
  { key: "SHIPPED", title: "In Transit", desc: "Entrusted to our express delivery courier", icon: Truck },
  { key: "DELIVERED", title: "Delivered", desc: "Successfully delivered into your hands", icon: CheckCircle },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialOrderNumber && initialPhone) {
      handleTrack(initialOrderNumber, initialPhone);
    }
  }, [initialOrderNumber, initialPhone]);

  const handleTrack = async (ordNum?: string, ph?: string) => {
    const num = ordNum || orderNumber;
    const tel = ph || phone;

    if (!num.trim() || !tel.trim()) {
      setError("Please enter both your order number and registered phone number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: num.trim(), phone: tel.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to locate your order with provided credentials.");
        setOrder(null);
      } else {
        setOrder(data.order);
        setError("");
      }
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === "CANCELLED") return -1;
    return ORDER_STEPS.findIndex((s) => s.key === status);
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col selection:bg-[#c5a253]/20">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="w-12 h-12 rounded-full bg-[#faf6ec] border border-[#c5a253]/35 flex items-center justify-center mx-auto mb-3">
              <Compass className="w-5 h-5 text-[#c5a253]" />
            </div>
            <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block mb-1">
              Private Client Care
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0d0d0d] mb-2">
              Track Your Consignment
            </h1>
            <p className="text-xs text-[#66635c] leading-relaxed">
              Enter your order number and registered phone number to follow your fragrance dispatch live.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white border border-[#e8e6e1] p-6 sm:p-8 mb-10 shadow-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTrack();
              }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4"
            >
              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#55524b] mb-1.5">
                  Order Number
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. ORD-2025-1001"
                  className="w-full bg-[#faf9f6] border border-[#dedad2] px-3.5 py-2.5 text-xs uppercase font-mono tracking-wider focus:bg-white focus:outline-none focus:border-[#c5a253]"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#55524b] mb-1.5">
                  Registered Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01012345678"
                  className="w-full bg-[#faf9f6] border border-[#dedad2] px-3.5 py-2.5 text-xs font-mono focus:bg-white focus:outline-none focus:border-[#c5a253]"
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0d0d0d] hover:bg-[#252525] disabled:bg-neutral-400 text-[#faf9f6] h-10 px-4 text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5 text-[#c5a253]" />
                      <span>Track</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Order Details & Progress if Found */}
          {order && (
            <div className="border border-[#e8e6e1] bg-white p-6 sm:p-10 space-y-10 shadow-sm animate-in fade-in duration-300">
              {/* Order Status Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#f0eee9] gap-4">
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider">Consignment Reference</span>
                  <h2 className="font-serif text-2xl font-bold text-[#0d0d0d]">#{order.orderNumber}</h2>
                  <span className="text-xs text-[#736f66]">
                    Ordered: {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>

                <div>
                  {order.status === "CANCELLED" ? (
                    <span className="inline-block px-3.5 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
                      Order Cancelled
                    </span>
                  ) : (
                    <span className="inline-block px-3.5 py-1 bg-[#faf6ec] text-[#967527] border border-[#c5a253]/35 text-xs font-bold uppercase tracking-wider">
                      {ORDER_STEPS.find((s) => s.key === order.status)?.title || order.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Steps Timeline */}
              {order.status !== "CANCELLED" ? (
                <div>
                  <h3 className="font-serif font-bold text-xs uppercase tracking-widest text-[#736f66] mb-6">
                    Fulfillment Milestones
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                    {ORDER_STEPS.map((step, idx) => {
                      const Icon = step.icon;
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div
                          key={step.key}
                          className={`p-4 border transition-all text-center flex flex-col items-center justify-between ${
                            isCurrent
                              ? "border-[#0d0d0d] bg-[#faf9f6] shadow-xs"
                              : isCompleted
                              ? "border-[#dedad2] bg-white"
                              : "border-[#f0eee9] bg-white opacity-40"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center mb-2.5 ${
                              isCurrent
                                ? "bg-[#0d0d0d] text-[#c5a253]"
                                : isCompleted
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-neutral-100 text-neutral-400"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div>
                            <h4
                              className={`text-xs font-bold mb-1 ${
                                isCurrent ? "text-black" : "text-[#55524b]"
                              }`}
                            >
                              {step.title}
                            </h4>
                            <p className="text-[10px] text-neutral-500 line-clamp-2">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-800">
                  This consignment has been cancelled. If you believe this is in error, please contact our concierge via WhatsApp.
                </div>
              )}

              {/* Order Info & Delivery Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#faf9f6] p-6 border border-[#e8e6e1] text-xs">
                <div className="space-y-1.5">
                  <h4 className="font-serif font-bold text-sm text-[#0d0d0d] mb-2">Recipient & Delivery</h4>
                  <p><span className="text-[#736f66]">Name:</span> {order.customerName}</p>
                  <p><span className="text-[#736f66]">Governorate:</span> {order.governorate}</p>
                  <p><span className="text-[#736f66]">Address:</span> {order.city} - {order.address}</p>
                  {order.landmark && (
                    <p><span className="text-[#736f66]">Landmark:</span> {order.landmark}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-serif font-bold text-sm text-[#0d0d0d] mb-2">Payment Details</h4>
                  <p><span className="text-[#736f66]">Method:</span> {order.paymentMethod === "COD" ? "Cash on Delivery" : "InstaPay Direct"}</p>
                  <p><span className="text-[#736f66]">Status:</span> {order.paymentStatus === "PAID" ? "Settled" : "Pay Upon Inspection"}</p>
                  <p><span className="text-[#736f66]">Total Due:</span> <strong className="font-serif font-bold text-sm text-[#0d0d0d]">{order.total.toLocaleString()} EGP</strong></p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-serif font-bold text-xs uppercase tracking-widest text-[#736f66] mb-3">
                  Manifested Fragrances
                </h4>
                <div className="border border-[#e8e6e1] divide-y divide-[#ece9e2]">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-serif font-bold text-[#0d0d0d] block">{item.productName}</span>
                        <span className="text-[11px] text-[#736f66] font-mono">Volume: {item.selectedSize} × {item.quantity}</span>
                      </div>
                      <span className="font-serif font-bold text-[#0d0d0d]">{item.totalPrice.toLocaleString()} EGP</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support Help */}
              <div className="pt-4 border-t border-[#f0eee9] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#736f66]">Need to reschedule or update delivery address?</span>
                <a
                  href={`https://wa.me/201026673838?text=${encodeURIComponent(`Hello VITORIA Concierge, I would like to inquire about my order #${order.orderNumber}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#85631c] hover:underline"
                >
                  <MessageCircle className="w-4 h-4 text-[#c5a253]" />
                  <span>Contact Maison Concierge (WhatsApp)</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
