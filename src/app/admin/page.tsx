"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Eye,
  Phone,
  MessageCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Failed to load analytics", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-neutral-500">جاري تحميل المؤشرات والتحليلات...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalOrders: 0,
    totalSales: 0,
    productsCount: 0,
    lowStockCount: 0,
    statusCounts: {},
  };

  const statusCounts = stats.statusCounts || {};

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eeeeee]">
        <div>
          <span className="text-[11px] font-bold text-[#c5a253] uppercase tracking-widest block mb-1">
            نظرة عامة على المتجر
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
            لوحة الإحصائيات والأداء
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products?action=new"
            className="bg-black hover:bg-neutral-800 text-white px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2"
          >
            <span>+ إضافة عطر جديد</span>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white border border-[#e5e5e5] hover:border-black text-black px-4 py-2.5 text-xs font-bold transition-colors"
          >
            <span>عرض كل الطلبات</span>
          </Link>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="bg-[#fafafa] border border-[#eeeeee] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500">إجمالي المبيعات المؤكدة</span>
            <div className="w-8 h-8 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#c5a253]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-black">
            {stats.totalSales.toLocaleString()} <span className="text-xs font-normal text-neutral-500">ج.م</span>
          </div>
          <p className="text-[11px] text-neutral-400">من كافة الطلبات غير الملغاة</p>
        </div>

        {/* Total Orders */}
        <div className="bg-[#fafafa] border border-[#eeeeee] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500">إجمالي عدد الطلبات</span>
            <div className="w-8 h-8 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#c5a253]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-black">
            {stats.totalOrders} <span className="text-xs font-normal text-neutral-500">طلب</span>
          </div>
          <p className="text-[11px] text-neutral-400">سجل الطلبات الكلي في المتجر</p>
        </div>

        {/* Products in Catalog */}
        <div className="bg-[#fafafa] border border-[#eeeeee] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500">كتالوج العطور المتاح</span>
            <div className="w-8 h-8 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center">
              <Package className="w-4 h-4 text-[#c5a253]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-black">
            {stats.productsCount} <span className="text-xs font-normal text-neutral-500">عطر</span>
          </div>
          <p className="text-[11px] text-neutral-400">عطور معروضة للبيع</p>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-[#fafafa] border border-[#eeeeee] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700">تنبيهات انخفاض المخزون</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-black">
            {stats.lowStockCount} <span className="text-xs font-normal text-neutral-500">عطور</span>
          </div>
          <p className="text-[11px] text-amber-700">تحتاج لتوريد كميات جديدة</p>
        </div>
      </div>

      {/* Orders Status Grid */}
      <div className="space-y-4">
        <h2 className="font-bold text-sm text-black">حالات وتوزيع الطلبات</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-white border border-[#eeeeee] text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>طلبات جديدة</span>
            </div>
            <span className="text-xl font-bold text-black">{statusCounts["NEW"] || 0}</span>
          </div>

          <div className="p-3 bg-white border border-[#eeeeee] text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>تم التأكيد</span>
            </div>
            <span className="text-xl font-bold text-black">{statusCounts["CONFIRMED"] || 0}</span>
          </div>

          <div className="p-3 bg-white border border-[#eeeeee] text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 mb-1">
              <Package className="w-3.5 h-3.5 text-purple-600" />
              <span>جاري التجهيز</span>
            </div>
            <span className="text-xl font-bold text-black">{statusCounts["PREPARING"] || 0}</span>
          </div>

          <div className="p-3 bg-white border border-[#eeeeee] text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 mb-1">
              <Truck className="w-3.5 h-3.5 text-indigo-600" />
              <span>تم الشحن</span>
            </div>
            <span className="text-xl font-bold text-black">{statusCounts["SHIPPED"] || 0}</span>
          </div>

          <div className="p-3 bg-white border border-[#eeeeee] text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>تم التسليم</span>
            </div>
            <span className="text-xl font-bold text-black">{statusCounts["DELIVERED"] || 0}</span>
          </div>

          <div className="p-3 bg-white border border-[#eeeeee] text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 mb-1">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>ملغية</span>
            </div>
            <span className="text-xl font-bold text-black">{statusCounts["CANCELLED"] || 0}</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-[#fafafa] border border-[#eeeeee] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
            <h3 className="font-bold text-sm text-black">أحدث الطلبات الواردة</h3>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1"
            >
              <span>إدارة كافة الطلبات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(!data?.recentOrders || data.recentOrders.length === 0) ? (
            <p className="text-xs text-neutral-400 py-6 text-center">لا توجد طلبات مسجلة بعد</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-white border-b border-[#eeeeee] text-neutral-400 font-normal">
                  <tr>
                    <th className="p-3">رقم الطلب</th>
                    <th className="p-3">العميل</th>
                    <th className="p-3">المحافظة</th>
                    <th className="p-3">المبلغ</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeeee] bg-white">
                  {data.recentOrders.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-[#fafafa]">
                      <td className="p-3 font-mono font-bold text-black">
                        #{ord.orderNumber}
                      </td>
                      <td className="p-3 font-medium text-neutral-800">
                        {ord.customerName}
                      </td>
                      <td className="p-3 text-neutral-500">
                        {ord.governorate}
                      </td>
                      <td className="p-3 font-bold text-black">
                        {ord.total.toLocaleString()} ج.م
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-[#fcf9f2] text-[#c5a253] border border-[#c5a253]/30">
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link
                          href={`/admin/orders?view=${ord.orderNumber}`}
                          className="p-1.5 text-neutral-500 hover:text-black inline-block"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock & Bestsellers Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Watch */}
          <div className="bg-[#fafafa] border border-[#eeeeee] p-5 space-y-4">
            <h3 className="font-bold text-sm text-black flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>مخزون قارب على النفاد</span>
            </h3>

            {(!data?.lowStockProducts || data.lowStockProducts.length === 0) ? (
              <p className="text-xs text-neutral-400 py-3 text-center">المخزون بوضع ممتاز</p>
            ) : (
              <div className="space-y-3">
                {data.lowStockProducts.map((p: any) => (
                  <div key={p.id} className="p-3 bg-white border border-[#eeeeee] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-black block line-clamp-1">{p.name}</span>
                      <span className="text-[11px] text-neutral-400">{p.price} ج.م</span>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0">
                      متبقي {p.stockQuantity} فقط
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bestsellers Watch */}
          <div className="bg-[#fafafa] border border-[#eeeeee] p-5 space-y-4">
            <h3 className="font-bold text-sm text-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c5a253]" />
              <span>العطور الأكثر طلباً</span>
            </h3>

            {(!data?.bestsellers || data.bestsellers.length === 0) ? (
              <p className="text-xs text-neutral-400 py-3 text-center">لا توجد عطور محددة كأكثر مبيعاً</p>
            ) : (
              <div className="space-y-3">
                {data.bestsellers.map((b: any) => (
                  <div key={b.id} className="p-3 bg-white border border-[#eeeeee] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-black block line-clamp-1">{b.name}</span>
                      <span className="text-[11px] text-[#c5a253]">{b.category?.name}</span>
                    </div>
                    <span className="font-bold text-black">{b.price.toLocaleString()} ج.م</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
