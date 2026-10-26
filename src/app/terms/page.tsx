import React from "react";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";

export const metadata = {
  title: "Terms & Conditions | VITORIA Haute Parfumerie",
  description: "General terms and conditions governing purchases and interactions at VITORIA Haute Parfumerie.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col selection:bg-[#c5a253]/20">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="border-b border-[#e8e6e1] pb-6">
            <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block mb-1">
              Legal Framework
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0d0d0d]">
              General Terms & Conditions
            </h1>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#55524b] leading-relaxed">
            <div className="bg-white border border-[#e8e6e1] p-7 space-y-3 shadow-sm">
              <h2 className="font-serif font-bold text-base text-[#0d0d0d]">1. Preamble</h2>
              <p>
                Welcome to VITORIA Haute Parfumerie. By accessing this platform and placing an order, you agree unconditionally to abide by these Terms and Conditions.
              </p>
            </div>

            <div className="bg-white border border-[#e8e6e1] p-7 space-y-3 shadow-sm">
              <h2 className="font-serif font-bold text-base text-[#0d0d0d]">2. Curations & Pricing</h2>
              <p>
                All prices quoted in the boutique are in Egyptian Pounds (EGP) and inclusive of statutory duties. We endeavor to describe each olfactory formulation with utmost fidelity. We reserve the right to revise offerings and pricing without prior notice.
              </p>
            </div>

            <div className="bg-white border border-[#e8e6e1] p-7 space-y-3 shadow-sm">
              <h2 className="font-serif font-bold text-base text-[#0d0d0d]">3. Consignment Confirmation & Transit</h2>
              <p>
                Submitting an order constitutes a firm commitment to acquire the specified creations at the quoted total. Our courier will attempt delivery and establish contact; failure to establish contact within repeated attempts may lead to order cancellation.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
