"use client";

import React, { useState, useEffect } from "react";
import { FolderTree, Plus, Edit, Trash2, X, Check, AlertCircle, Upload } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories?all=true");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setDisplayOrder("0");
    setIsActive(true);
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setDisplayOrder(cat.displayOrder?.toString() || "0");
    setIsActive(cat.isActive !== false);
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setImage(data.url);
      } else {
        setFormError(data.error || "فشل رفع الصورة");
      }
    } catch {
      setFormError("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    if (!name.trim()) {
      setFormError("اسم القسم مطلوب");
      setSaving(false);
      return;
    }

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || null,
          image: image.trim() || null,
          displayOrder: parseInt(displayOrder || "0", 10),
          isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "فشل حفظ القسم");
        setSaving(false);
        return;
      }

      setFormSuccess(editingCategory ? "تم تعديل القسم بنجاح!" : "تم إضافة القسم الجديد بنجاح!");
      fetchCategories();
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess("");
      }, 1000);
    } catch {
      setFormError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "لا يمكن حذف هذا القسم");
      } else {
        fetchCategories();
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
            هيكلة المتجر
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
            إدارة الأقسام والتصنيفات ({categories.length})
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 text-xs font-bold transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#c5a253]" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      {/* Categories Table */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-neutral-500">جاري تحميل الأقسام...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-16 text-center border border-[#eeeeee] bg-[#fafafa] p-8">
          <FolderTree className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-bold text-sm text-black mb-1">لا توجد أقسام مسجلة</h3>
          <p className="text-xs text-neutral-500 mb-4">أنشئ أقساماً لتنظيم عطورك</p>
          <button onClick={openAddModal} className="px-5 py-2 bg-black text-white text-xs font-bold">
            + إضافة قسم
          </button>
        </div>
      ) : (
        <div className="border border-[#eeeeee] bg-white overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-[#fafafa] border-b border-[#eeeeee] text-neutral-500 font-semibold">
              <tr>
                <th className="p-3.5">الصورة</th>
                <th className="p-3.5">اسم القسم</th>
                <th className="p-3.5">الاسم اللطيف (Slug)</th>
                <th className="p-3.5">عدد العطور</th>
                <th className="p-3.5">ترتيب العرض</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeee]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="p-3.5">
                    <div className="w-12 h-12 bg-[#fafafa] border border-[#eeeeee] overflow-hidden">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-300">
                          لا صورة
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-black">{cat.name}</td>
                  <td className="p-3.5 font-mono text-neutral-400">{cat.slug}</td>
                  <td className="p-3.5 font-bold text-black">{cat._count?.products || 0} عطور</td>
                  <td className="p-3.5 font-mono text-neutral-600">{cat.displayOrder}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      نشط
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-neutral-600 hover:text-black transition-colors"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white border border-[#eeeeee] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <h3 className="font-bold text-sm text-black">
                {editingCategory ? "تعديل القسم" : "إضافة قسم جديد"}
              </h3>
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

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  اسم القسم بالعربية <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: عطور النيش الملكية"
                  className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  الاسم اللطيف (Slug بالإنجليزية)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="مثال: niche-perfumes"
                  className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  وصف القسم
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف مختصر لمحتويات القسم..."
                  className="w-full bg-[#fafafa] border border-[#e5e5e5] p-2.5 text-xs focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  صورة القسم
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="رابط الصورة أو ارفع صورة جديدة"
                    className="flex-1 bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black dir-ltr text-right"
                  />
                  <label className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 border border-[#e5e5e5] text-xs font-bold cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "..." : "رفع"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
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
                  {saving ? "جاري الحفظ..." : "حفظ القسم"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
