"use client";

import React, { useState } from "react";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSent(true);
    setTimeout(() => {
      setName("");
      setPhone("");
      setMessage("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col selection:bg-[#c5a253]/20">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-[#c5a253] uppercase tracking-[0.25em] block">
              Private Fragrance Concierge
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0d0d0d]">
              We Are At Your Service
            </h1>
            <p className="text-xs sm:text-sm text-[#66635c] leading-relaxed">
              Whether you seek a bespoke olfactory recommendation for a milestone or have inquiries regarding your order, our perfume curators are at your disposal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#e8e6e1] p-7 space-y-6 shadow-sm">
                <h3 className="font-serif font-bold text-base text-[#0d0d0d] border-b border-[#f0eee9] pb-3">
                  Direct Concierge Channels
                </h3>

                <div className="space-y-5 text-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#faf6ec] border border-[#c5a253]/35 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4 text-[#c5a253]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0d0d0d]">WhatsApp Concierge</h4>
                      <p className="text-[#736f66] mb-1">Instant assistance 24/7</p>
                      <a
                        href="https://wa.me/201026673838"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-bold text-[#8a6820] hover:underline inline-block"
                      >
                        +20 102 667 3838
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#faf6ec] border border-[#c5a253]/35 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-[#c5a253]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0d0d0d]">Client Direct Line</h4>
                      <p className="text-[#736f66] mb-1">Daily from 10:00 AM to 10:00 PM</p>
                      <a
                        href="tel:0220488620"
                        className="font-mono font-bold text-[#0d0d0d] hover:text-[#c5a253] inline-block"
                      >
                        0220488620
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#faf6ec] border border-[#c5a253]/35 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-[#c5a253]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0d0d0d]">Electronic Correspondence</h4>
                      <p className="text-[#736f66] mb-1">VIP inquiries & private orders</p>
                      <a
                        href="mailto:contact@vitoria.com"
                        className="font-semibold text-[#0d0d0d] hover:text-[#c5a253]"
                      >
                        contact@vitoria.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#faf6ec] border border-[#c5a253]/35 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[#c5a253]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0d0d0d]">Maison & Showroom</h4>
                      <p className="text-[#66635c] leading-relaxed">
                        North 90th Street, New Cairo, Egypt
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-[#e8e6e1] p-7 sm:p-9 space-y-6 shadow-sm">
                <h3 className="font-serif font-bold text-base text-[#0d0d0d] border-b border-[#f0eee9] pb-3">
                  Send a Private Inquiry
                </h3>

                {sent ? (
                  <div className="p-8 bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-serif font-bold text-base text-emerald-900">Message Dispatched Successfully</h4>
                    <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting VITORIA. One of our fragrance advisers will attend to your request shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#55524b] mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Omar Farouk"
                        className="w-full bg-[#faf9f6] border border-[#dedad2] px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-[#c5a253] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#55524b] mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 01012345678"
                        className="w-full bg-[#faf9f6] border border-[#dedad2] px-4 py-2.5 text-xs font-mono focus:bg-white focus:outline-none focus:border-[#c5a253] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#55524b] mb-1.5">
                        Message & Inquiry <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please write your questions or fragrance preferences in detail..."
                        className="w-full bg-[#faf9f6] border border-[#dedad2] p-3 text-xs focus:bg-white focus:outline-none focus:border-[#c5a253] transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#0d0d0d] hover:bg-[#252525] text-[#faf9f6] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5 text-[#c5a253]" />
                      <span>Send Inquiry</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
