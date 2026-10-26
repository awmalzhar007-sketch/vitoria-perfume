import React from "react";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { Truck, RefreshCw, ShieldCheck, Clock } from "lucide-react";

export const metadata = {
  title: "Shipping & Returns | VITORIA Haute Parfumerie",
  description: "Learn about our nationwide express shipping, parcel inspection rights, and flacon return policy.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col selection:bg-[#c5a253]/20">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="border-b border-[#e8e6e1] pb-6">
            <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block mb-1">
              Client Protection & Transparency
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0d0d0d]">
              Shipping, Delivery & Returns Policy
            </h1>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-[#55524b] leading-relaxed">
            {/* Shipping Policy */}
            <section className="bg-white border border-[#e8e6e1] p-7 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 font-serif font-bold text-base text-[#0d0d0d]">
                <Truck className="w-5 h-5 text-[#c5a253]" />
                <h2>1. Express Nationwide Delivery</h2>
              </div>
              <ul className="space-y-2.5 list-disc list-inside text-[#66635c]">
                <li>We dispatch consignments to all governorates and metropolitan centers across Egypt.</li>
                <li>Estimated delivery for Greater Cairo & Alexandria: 24 to 48 business hours.</li>
                <li>Estimated delivery for Delta, Canal cities & Upper Egypt: 48 to 72 business hours.</li>
                <li>Complimentary express delivery on all qualifying orders exceeding the free shipping threshold.</li>
                <li>Our private delivery representative coordinates arrival time with you by phone prior to delivery.</li>
              </ul>
            </section>

            {/* Inspection before payment */}
            <section className="bg-white border border-[#e8e6e1] p-7 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 font-serif font-bold text-base text-[#0d0d0d]">
                <ShieldCheck className="w-5 h-5 text-[#c5a253]" />
                <h2>2. Parcel Inspection Upon Delivery</h2>
              </div>
              <p>
                We take immense pride in our flacons and artisanal packaging. You retain the absolute right to inspect the external seal and flacon integrity in the courier’s presence before remitting payment.
              </p>
              <p>
                Should any transit damage or discrepancy occur, you may decline the consignment on the spot without incurring any delivery or return charges.
              </p>
            </section>

            {/* Return & Exchange */}
            <section className="bg-white border border-[#e8e6e1] p-7 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 font-serif font-bold text-base text-[#0d0d0d]">
                <RefreshCw className="w-5 h-5 text-[#c5a253]" />
                <h2>3. Returns & Exchange Guidelines</h2>
              </div>
              <ul className="space-y-2.5 list-disc list-inside text-[#66635c]">
                <li>Unopened flacons with their cellophane seal intact may be exchanged or returned within 14 days of receipt, in accordance with consumer protection statutes for cosmetics and fragrance products.</li>
                <li>In the rare event of an atomizer defect or manufacturing fault, an immediate complimentary replacement will be dispatched at our expense.</li>
                <li>Refunds are processed to the original payment method or via InstaPay within 3 business days following laboratory inspection of the returned flacon.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
