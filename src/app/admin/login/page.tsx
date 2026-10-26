"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "بيانات الدخول غير صحيحة");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError("حدث خطأ أثناء تسجيل الدخول");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-[#eeeeee] p-8 sm:p-10 shadow-xs space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="font-extrabold text-2xl tracking-[0.2em] text-black uppercase">
              VITORIA
            </span>
            <span className="w-2 h-2 rounded-full bg-[#c5a253]"></span>
          </div>
          <span className="text-[11px] font-medium tracking-[0.25em] text-neutral-500 uppercase block">
            بوابة الإدارة المركزية
          </span>
          <p className="text-xs text-neutral-400 pt-1">
            تسجيل دخول إدارة متجر فيتوريا VITORIA
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-xs text-neutral-500 text-center">استخدم بيانات المدير التي أعددتها عند تهيئة المتجر.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="awmalzhar@gmail.com"
                className="w-full bg-[#fafafa] border border-[#e5e5e5] px-4 py-2.5 pr-10 text-xs focus:bg-white focus:outline-none focus:border-black dir-ltr text-right"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#fafafa] border border-[#e5e5e5] px-4 py-2.5 pr-10 text-xs focus:bg-white focus:outline-none focus:border-black dir-ltr text-right"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white py-3.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-[#c5a253]" />
                <span>دخول لوحة التحكم</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#eeeeee] text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لمتجر العطور</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
