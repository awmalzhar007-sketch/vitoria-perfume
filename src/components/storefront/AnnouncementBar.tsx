"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Phone, MessageCircle } from "lucide-react";

export function AnnouncementBar() {
  const [text, setText] = useState("✨ Complimentary Express Delivery • Free Luxury Sample with every order");
  const [whatsapp, setWhatsapp] = useState("201098765432");
  const [phone, setPhone] = useState("01098765432");
  const [show, setShow] = useState(true);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.announcementBarText) setText(data.settings.announcementBarText);
          if (data.settings.whatsappNumber) setWhatsapp(data.settings.whatsappNumber);
          if (data.settings.phone) setPhone(data.settings.phone);
          if (data.settings.showAnnouncementBar !== undefined) setShow(data.settings.showAnnouncementBar);
        }
      })
      .catch(() => {});
  }, []);

  if (!show) return null;

  return (
    <div className="bg-[#0f0e0c] text-[#e8e4dc] border-b border-[#2a2722] text-[11px] tracking-widest uppercase py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a253] animate-pulse"></span>
          <span className="text-[#e2ded6]">{text}</span>
        </div>

        <div className="flex items-center gap-4 text-[#a39f97] text-[11px]">
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello VITORIA, I would like to inquire about your luxury perfumes.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#c5a253] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#c5a253]" />
            <span>Concierge WhatsApp</span>
          </a>
          <span className="text-[#3a3731]">|</span>
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 hover:text-[#c5a253] transition-colors font-mono tracking-normal"
          >
            <Phone className="w-3 h-3 text-[#c5a253]" />
            <span>{phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
