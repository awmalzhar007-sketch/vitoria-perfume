"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Tag,
  Settings,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "نظرة عامة والتحليلات", href: "/admin", icon: LayoutDashboard },
  { label: "إدارة العطور والمنتجات", href: "/admin/products", icon: Package },
  { label: "إدارة ومتابعة الطلبات", href: "/admin/orders", icon: ShoppingBag },
  { label: "الأقسام والتصنيفات", href: "/admin/categories", icon: FolderTree },
  { label: "الكوبونات والخصومات", href: "/admin/coupons", icon: Tag },
  { label: "إعدادات المتجر والواجهة", href: "/admin/settings", icon: Settings },
  { label: "فريق الإدارة والمديرين", href: "/admin/admins", icon: Users },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on login page, render children directly without layout
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.admin) {
          setAdmin(data.admin);
        }
      })
      .catch(() => {
        router.push("/admin/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-500">جاري التحقق من الصلاحيات والوصول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col lg:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-l border-[#eeeeee] min-h-screen shrink-0">
        {/* Brand */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-[#eeeeee]">
          <Link href="/admin" className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl tracking-wider text-black uppercase">
              VITORIA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a253]"></span>
            <span className="text-[10px] font-semibold text-neutral-400 mr-1">
              الإدارة
            </span>
          </Link>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#fcf9f2] text-[#c5a253] border border-[#c5a253]/30">
            {admin?.role === "superadmin" ? "مدير عام" : "مدير"}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 text-xs font-semibold rounded-none transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-neutral-600 hover:bg-[#f8f8f8] hover:text-black"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#c5a253]" : "text-neutral-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#eeeeee] space-y-2 bg-[#fafafa]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-black hover:bg-white border border-[#e5e5e5] transition-colors"
          >
            <span>زيارة المتجر</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Mobile Header Bar */}
        <header className="lg:hidden h-16 bg-white border-b border-[#eeeeee] flex items-center justify-between px-4 sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-black hover:text-[#c5a253]"
            aria-label="القائمة"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/admin" className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg tracking-wider text-black uppercase">
              VITORIA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a253]"></span>
            <span className="text-[10px] text-neutral-400 font-semibold">الإدارة</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </header>

        {/* Mobile Slide-out Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 top-16 z-40 bg-white border-t border-[#eeeeee] p-4 flex flex-col justify-between overflow-y-auto">
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-black text-white"
                        : "text-neutral-700 hover:bg-[#f8f8f8]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-[#eeeeee] space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 p-3 text-xs font-bold text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        )}

        {/* Desktop Top Header Info */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-[#eeeeee] bg-white">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>مرحباً بعودتك،</span>
            <strong className="text-black font-bold">{admin?.name || "المدير"}</strong>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="px-2.5 py-1 bg-[#fafafa] border border-[#eeeeee] text-neutral-600 font-mono text-[11px]">
              {admin?.email}
            </span>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-neutral-600 hover:text-black font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>المتجر العام</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Admin Sub-pages */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
