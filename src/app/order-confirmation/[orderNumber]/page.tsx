import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { prisma } from "@/lib/prisma";
import {
  CheckCircle,
  Phone,
  MessageCircle,
  Truck,
  Printer,
  Compass,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { PrintButton } from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) {
    notFound();
  }

  const settings = await prisma.storeSettings.findUnique({
    where: { id: "default" },
    select: { whatsappNumber: true, phone: true },
  });

  const whatsapp = settings?.whatsappNumber || "201098765432";
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Hello VITORIA, I would like to confirm my order #${order.orderNumber} placed under ${order.customerName}.`
  )}`;

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col selection:bg-[#c5a253]/20">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Banner */}
          <div className="bg-white border border-[#e8e6e1] p-8 sm:p-12 text-center mb-8 relative shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-700">
              <CheckCircle className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block mb-1">
              Consignment Confirmed
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#0d0d0d] mb-2">
              Thank You for Curating with VITORIA
            </h1>
            <p className="text-xs sm:text-sm text-[#66635c] max-w-lg mx-auto leading-relaxed">
              Your fragrance order has been securely registered in our atelier. It will be hand-inspected, boxed with our signature gold seal, and dispatched swiftly.
            </p>

            {/* Order Number Badge */}
            <div className="mt-6 inline-flex items-center gap-3 bg-[#faf9f6] border border-[#dedad2] px-6 py-3 shadow-xs">
              <span className="text-xs text-[#736f66] uppercase tracking-wider font-semibold">Your Consignment Reference:</span>
              <span className="font-mono font-bold text-base text-[#0d0d0d] tracking-wider">
                #{order.orderNumber}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 no-print">
            <div className="flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebc59] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm via WhatsApp</span>
              </a>

              <PrintButton />
            </div>

            <Link
              href={`/track-order?orderNumber=${order.orderNumber}&phone=${order.customerPhone}`}
              className="inline-flex items-center gap-2 bg-[#0d0d0d] hover:bg-[#252525] text-[#faf9f6] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              <Compass className="w-4 h-4 text-[#c5a253]" />
              <span>Track Consignment</span>
            </Link>
          </div>

          {/* Printable Order Details / Invoice */}
          <div className="border border-[#e8e6e1] bg-white p-6 sm:p-10 space-y-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#f0eee9] gap-4">
              <div>
                <span className="font-serif font-extrabold text-2xl tracking-[0.25em] text-[#0d0d0d] block">
                  VITORIA
                </span>
                <span className="text-[10px] font-semibold tracking-[0.3em] text-[#c5a253] uppercase">
                  HAUTE PARFUMERIE
                </span>
              </div>
              <div className="text-right text-xs text-[#736f66] space-y-1">
                <p>Date: {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                <p>Status: <span className="font-bold text-[#0d0d0d] uppercase">Registered / Under Curation</span></p>
                <p>Payment: <span className="font-bold text-[#0d0d0d] uppercase">{order.paymentMethod === "COD" ? "Cash on Delivery" : "InstaPay Direct"}</span></p>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#faf9f6] p-6 border border-[#e8e6e1] text-xs">
              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-sm text-[#0d0d0d] mb-2">Recipient:</h3>
                <p><span className="text-[#736f66]">Name:</span> <strong className="text-black">{order.customerName}</strong></p>
                <p><span className="text-[#736f66]">Phone:</span> <strong className="text-black font-mono inline-block">{order.customerPhone}</strong></p>
                {order.customerEmail && (
                  <p><span className="text-[#736f66]">Email:</span> {order.customerEmail}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-sm text-[#0d0d0d] mb-2">Delivery Destination:</h3>
                <p><span className="text-[#736f66]">Governorate:</span> <strong className="text-black">{order.governorate}</strong></p>
                <p><span className="text-[#736f66]">City / Area:</span> <strong className="text-black">{order.city}</strong></p>
                <p><span className="text-[#736f66]">Street Address:</span> {order.address}</p>
                {order.landmark && (
                  <p><span className="text-[#736f66]">Landmark:</span> {order.landmark}</p>
                )}
                {order.notes && (
                  <p><span className="text-[#736f66]">Instructions:</span> {order.notes}</p>
                )}
              </div>
            </div>

            {/* Order Items Table */}
            <div>
              <h3 className="font-serif font-bold text-base text-[#0d0d0d] mb-4">Curated Fragrances:</h3>
              <div className="border border-[#e8e6e1] divide-y divide-[#ece9e2]">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3.5">
                      {item.productImage && (
                        <div className="w-12 h-14 bg-[#faf9f6] border border-[#e8e6e1] overflow-hidden shrink-0">
                          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <span className="font-serif font-bold text-sm text-[#0d0d0d] block">{item.productName}</span>
                        <span className="text-[11px] text-[#736f66] font-mono">Volume: {item.selectedSize}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[#736f66] block font-mono">{item.quantity} × {item.unitPrice.toLocaleString()} EGP</span>
                      <span className="font-serif font-bold text-[#0d0d0d] block mt-0.5">{item.totalPrice.toLocaleString()} EGP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="bg-[#faf9f6] p-6 border border-[#e8e6e1] space-y-2.5 text-xs max-w-sm ml-auto">
              <div className="flex justify-between text-[#66635c]">
                <span className="uppercase tracking-wider">Subtotal:</span>
                <span className="font-serif font-bold text-[#0d0d0d]">{order.subtotal.toLocaleString()} EGP</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Privilege ({order.couponCode || "COUPON"}):</span>
                  <span>-{order.discountAmount.toLocaleString()} EGP</span>
                </div>
              )}

              <div className="flex justify-between text-[#66635c]">
                <span className="uppercase tracking-wider">Shipping & Handling:</span>
                <span className="font-serif font-bold text-[#0d0d0d]">
                  {order.deliveryFee === 0 ? "Complimentary" : `${order.deliveryFee.toLocaleString()} EGP`}
                </span>
              </div>

              <div className="pt-3 border-t border-[#dedad2] flex justify-between items-baseline text-sm">
                <span className="font-serif font-bold text-base text-[#0d0d0d]">Total Amount:</span>
                <span className="font-serif font-bold text-xl text-[#0d0d0d]">{order.total.toLocaleString()} EGP</span>
              </div>
            </div>
          </div>

          {/* Bottom Link */}
          <div className="text-center pt-8 no-print">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#55524b] hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#c5a253]" />
              <span>Return to VITORIA Fragrance Atelier</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
