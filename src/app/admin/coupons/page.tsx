"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, Trash2, X, Check, AlertCircle, Calendar } from "lucide-react";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("10");
  const [minOrderValue, setMinOrderValue] = useState("500");
  const [maxUsageCount, setMaxUsageCount] = useState("1000");
  const [expiresAt, setExpiresAt] = useState("");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/coupons");
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    if (!code.trim() || !discountValue) {
      setFormError("كود الخصم وقيمة الخصم حقول إجبارية");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discountType,
          discountValue: parseFloat(discountValue),
          minOrderValue: parseFloat(minOrderValue || "0"),
          maxUsageCount: maxUsageCount ? parseInt(maxUsageCount, 10) : null,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "فشل إنشاء الكوبون");
        setSaving(false);
        return;
      }

      setFormSuccess("تم إنشاء كود الخصم بنجاح!");
      fetchCoupons();
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess("");
        setCode("");
      }, 1000);
    } catch {
      setFormError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكوبون؟")) return;

    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (res.ok) fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eeeeee]">
        <div>
          <span className="text-[11px] font-bold text-[#c5a253] uppercase tracking-widest block mb-1">
            العروض والحملات التسويقية
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
            إدارة كوبونات وأكواد الخصم ({coupons.length})
          </h1>
        </div>

        <button
          onClick={() => {
            setCode("");
            setFormError("");
            setIsModalOpen(true);
          }}
          className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 text-xs font-bold transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#c5a253]" />
          <span>إنشاء كود خصم جديد</span>
        </button>
      </div>

      {/* Coupons Table */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-neutral-500">جاري تحميل الكوبونات...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="py-16 text-center border border-[#eeeeee] bg-[#fafafa] p-8">
          <Tag className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-bold text-sm text-black mb-1">لا توجد كوبونات خصم حالياً</h3>
          <p className="text-xs text-neutral-500 mb-4">أنشئ أكواد خصم لعملائك لزيادة المبيعات</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 bg-black text-white text-xs font-bold"
          >
            + إضافة كوبون
          </button>
        </div>
      ) : (
        <div className="border border-[#eeeeee] bg-white overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-[#fafafa] border-b border-[#eeeeee] text-neutral-500 font-semibold">
              <tr>
                <th className="p-3.5">كود الخصم</th>
                <th className="p-3.5">نوع وقيمة الخصم</th>
                <th className="p-3.5">الحد الأدنى للطلب</th>
                <th className="p-3.5">مرات الاستخدام</th>
                <th className="p-3.5">تاريخ الانتهاء</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeee]">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-black text-sm">
                    {c.code}
                  </td>
                  <td className="p-3.5 font-bold text-emerald-700">
                    {c.discountType === "PERCENTAGE"
                      ? `${c.discountValue}% خصم مئوي`
                      : `${c.discountValue} ج.م خصم ثابت`}
                  </td>
                  <td className="p-3.5 text-neutral-700">
                    {c.minOrderValue > 0 ? `${c.minOrderValue} ج.م` : "بدون حد أدنى"}
                  </td>
                  <td className="p-3.5 text-neutral-600">
                    <span className="font-bold text-black">{c.usedCount}</span>
                    {c.maxUsageCount ? ` / ${c.maxUsageCount}` : " (غير محدود)"}
                  </td>
                  <td className="p-3.5 text-neutral-500">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("ar-EG") : "صالح دائماً"}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      نشط
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white border border-[#eeeeee] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <h3 className="font-bold text-sm text-black">إنشاء كود خصم جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  كود الخصم (رمز الكوبون) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="مثال: ROYAL20"
                  className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs uppercase font-mono font-bold focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">نوع الخصم</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3 py-2 text-xs focus:outline-none focus:border-black font-semibold"
                  >
                    <option value="PERCENTAGE">نسبة مئوية (%)</option>
                    <option value="FIXED">مبلغ ثابت (ج.م)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    قيمة الخصم <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="مثال: 10 أو 100"
                    className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    الحد الأدنى للطلب (ج.م)
                  </label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    placeholder="500"
                    className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    أقصى عدد مرات استخدام
                  </label>
                  <input
                    type="number"
                    value={maxUsageCount}
                    onChange={(e) => setMaxUsageCount(e.target.value)}
                    placeholder="مثال: 500"
                    className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  تاريخ الانتهاء (اختياري)
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#e5e5e5] text-xs font-semibold hover:bg-[#f5f5f5]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs font-bold"
                >
                  {saving ? "جاري الإنشاء..." : "إنشاء الكوبون"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
