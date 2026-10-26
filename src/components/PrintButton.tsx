"use client";

import React from "react";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 bg-white border border-[#e5e5e5] hover:border-black text-black px-4 py-2.5 text-xs font-bold transition-colors"
    >
      <Printer className="w-4 h-4 text-[#c5a253]" />
      <span>Print Invoice</span>
    </button>
  );
}
