"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, Trash2, X, Check, AlertCircle, Shield } from "lucide-react";

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admins");
      const data = await res.json();
      if (data.admins) setAdmins(data.admins);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    if (!name.trim() || !email.trim() || !password) {
      setFormError("يرجى ملء جميع الحقول");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "فشل إضافة المدير");
        setSaving(false);
        return;
      }

      setFormSuccess("تم إضافة المدير بنجاح!");
      fetchAdmins();
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess("");
        setName("");
        setEmail("");
        setPassword("");
      }, 1000);
    } catch {
      setFormError("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الحساب الإداري؟")) return;

    try {
      const res = await fetch(`/api/admins?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "لا يمكن حذف هذا الحساب");
      } else {
        fetchAdmins();
      }
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
            صلاحيات الحسابات
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
            فريق الإدارة والمسؤولين ({admins.length})
          </h1>
        </div>

        <button
          onClick={() => {
            setName("");
            setEmail("");
            setPassword("");
            setFormError("");
            setIsModalOpen(true);
          }}
          className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 text-xs font-bold transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#c5a253]" />
          <span>إضافة مدير جديد</span>
        </button>
      </div>

      {/* Admins Table */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-neutral-500">جاري تحميل قائمة المديرين...</p>
        </div>
      ) : (
        <div className="border border-[#eeeeee] bg-white overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-[#fafafa] border-b border-[#eeeeee] text-neutral-500 font-semibold">
              <tr>
                <th className="p-3.5">الاسم</th>
                <th className="p-3.5">البريد الإلكتروني</th>
                <th className="p-3.5">نوع الصلاحية</th>
                <th className="p-3.5">تاريخ الإنشاء</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeee]">
              {admins.map((adm) => (
                <tr key={adm.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="p-3.5 font-bold text-black flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center text-neutral-600 font-bold text-xs">
                      {adm.name.slice(0, 1)}
                    </div>
                    <span>{adm.name}</span>
                  </td>
                  <td className="p-3.5 font-mono text-neutral-600 dir-ltr text-right">
                    {adm.email}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-bold border ${
                        adm.role === "superadmin"
                          ? "bg-[#fcf9f2] text-[#c5a253] border-[#c5a253]/30"
                          : "bg-neutral-100 text-neutral-700 border-neutral-300"
                      }`}
                    >
                      {adm.role === "superadmin" ? "مدير عام (Super Admin)" : "مسؤول طلبات (Manager)"}
                    </span>
                  </td>
                  <td className="p-3.5 text-neutral-500">
                    {new Date(adm.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="p-3.5 text-center">
                    {adm.role !== "superadmin" ? (
                      <button
                        onClick={() => handleDelete(adm.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-neutral-400">حساب رئيسي</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white border border-[#eeeeee] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <h3 className="font-bold text-sm text-black">إضافة حساب مدير جديد</h3>
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

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  اسم المدير <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: كريم عبد الله"
                  className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vitoria.com"
                  className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  كلمة المرور <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">الصلاحية</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3 py-2 text-xs focus:outline-none focus:border-black font-semibold"
                >
                  <option value="manager">مسؤول طلبات وعطور (Manager)</option>
                  <option value="superadmin">مدير عام لكافة الصلاحيات (Super Admin)</option>
                </select>
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
                  {saving ? "جاري الإضافة..." : "إضافة المدير"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
