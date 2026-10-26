import React from "react";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | VITORIA Haute Parfumerie",
  description: "Our steadfast commitment to confidentiality, client data protection, and privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col selection:bg-[#c5a253]/20">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="border-b border-[#e8e6e1] pb-6">
            <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block mb-1">
              Confidentiality & Discretion
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0d0d0d]">
              Privacy & Client Data Policy
            </h1>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-[#55524b] leading-relaxed">
            <div className="bg-white border border-[#e8e6e1] p-7 space-y-3 shadow-sm">
              <h2 className="font-serif font-bold text-base text-[#0d0d0d] flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-[#c5a253]" />
                <span>1. Information We Collect</span>
              </h2>
              <p>
                At VITORIA Haute Parfumerie, safeguarding your private information is of paramount importance. When placing a consignment via our boutique, we gather only essential information required for order fulfillment and delivery: your full name, telephone number, physical delivery address, and optional email for digital invoicing.
              </p>
              <p className="font-semibold text-[#0d0d0d]">
                * We do not solicit, collect, or store payment card numbers or banking secrets on our servers.
              </p>
            </div>

            <div className="bg-white border border-[#e8e6e1] p-7 space-y-3 shadow-sm">
              <h2 className="font-serif font-bold text-base text-[#0d0d0d]">2. Purpose of Data Utilization</h2>
              <p>
                Your details are utilized strictly to dispatch your fragrant creations directly to your residence, update you regarding transit status via telephone or WhatsApp concierge, and address bespoke inquiries.
              </p>
            </div>

            <div className="bg-white border border-[#e8e6e1] p-7 space-y-3 shadow-sm">
              <h2 className="font-serif font-bold text-base text-[#0d0d0d]">3. Absolute Non-Disclosure</h2>
              <p>
                We pledge unconditionally never to sell, lease, or disseminate your personal records to third-party marketing brokers or advertising networks, with the singular exception of our bonded courier partners solely for physical transit.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
