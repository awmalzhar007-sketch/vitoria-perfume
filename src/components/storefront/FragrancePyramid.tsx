"use client";

import React from "react";
import { Sparkles, Heart, Anchor, Wind } from "lucide-react";

interface FragrancePyramidProps {
  topNotes?: string | null;
  heartNotes?: string | null;
  baseNotes?: string | null;
}

export function FragrancePyramid({ topNotes, heartNotes, baseNotes }: FragrancePyramidProps) {
  if (!topNotes && !heartNotes && !baseNotes) return null;

  const parseNotes = (str?: string | null) => {
    if (!str) return [];
    return str.split(/[،,]/).map((s) => s.trim()).filter(Boolean);
  };

  const top = parseNotes(topNotes);
  const heart = parseNotes(heartNotes);
  const base = parseNotes(baseNotes);

  return (
    <div className="bg-white border border-[#e8e6e1] p-6 sm:p-10 shadow-sm">
      <div className="flex items-center gap-3 mb-8 border-b border-[#f0eee9] pb-5">
        <div className="w-10 h-10 rounded-full bg-[#faf6ec] border border-[#c5a253]/35 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#c5a253]" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-lg text-[#0d0d0d]">Olfactory Pyramid & Composition</h3>
          <p className="text-xs text-[#736f66]">The sensory evolution from the initial opening to the deep lingering base</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Top Notes */}
        {top.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-start gap-5 p-5 bg-[#faf9f6] border border-[#e8e6e1]">
            <div className="flex items-center gap-3 sm:w-48 shrink-0">
              <div className="w-8 h-8 rounded-full bg-white border border-[#dedad2] flex items-center justify-center">
                <Wind className="w-4 h-4 text-[#c5a253]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#0d0d0d]">Top Notes</h4>
                <span className="text-[10px] text-[#8c887f] font-mono">Opening (15-30 mins)</span>
              </div>
            </div>

            <div className="flex-1 flex flex-wrap gap-2">
              {top.map((note, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 bg-white text-xs font-medium text-[#1a1917] border border-[#dedad2] hover:border-[#c5a253] transition-colors"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Heart Notes */}
        {heart.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-start gap-5 p-5 bg-[#faf9f6] border border-[#e8e6e1]">
            <div className="flex items-center gap-3 sm:w-48 shrink-0">
              <div className="w-8 h-8 rounded-full bg-white border border-[#dedad2] flex items-center justify-center">
                <Heart className="w-4 h-4 text-[#c5a253]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#0d0d0d]">Heart Notes</h4>
                <span className="text-[10px] text-[#8c887f] font-mono">Core Body (3-6 hours)</span>
              </div>
            </div>

            <div className="flex-1 flex flex-wrap gap-2">
              {heart.map((note, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 bg-white text-xs font-medium text-[#1a1917] border border-[#dedad2] hover:border-[#c5a253] transition-colors"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Base Notes */}
        {base.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-start gap-5 p-5 bg-[#faf9f6] border border-[#e8e6e1]">
            <div className="flex items-center gap-3 sm:w-48 shrink-0">
              <div className="w-8 h-8 rounded-full bg-white border border-[#dedad2] flex items-center justify-center">
                <Anchor className="w-4 h-4 text-[#c5a253]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#0d0d0d]">Base Notes</h4>
                <span className="text-[10px] text-[#8c887f] font-mono">Longevity (8-24+ hours)</span>
              </div>
            </div>

            <div className="flex-1 flex flex-wrap gap-2">
              {base.map((note, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 bg-white text-xs font-medium text-[#1a1917] border border-[#dedad2] hover:border-[#c5a253] transition-colors"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
