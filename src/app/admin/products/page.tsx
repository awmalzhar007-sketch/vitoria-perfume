"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Upload,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";

function ProductsManagementContent() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get("action");

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(initialAction === "new");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({
    name: "",
    nameEn: "",
    slug: "",
    description: "",
    shortDescription: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    concentration: "Eau de Parfum (EDP)",
    inspiration: "",
    brandCollection: "",
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    isPublished: true,
    stockQuantity: "15",
    lowStockAlert: "3",
    topNotes: "",
    heartNotes: "",
    baseNotes: "",
    images: [] as Array<{ url: string; isPrimary: boolean }>,
    sizes: [
      { size: "50ml", price: "1200", originalPrice: "1500", stock: "10", isDefault: true },
      { size: "100ml", price: "1850", originalPrice: "2300", stock: "5", isDefault: false },
    ],
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products?admin=true");
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {
      console.error(e);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      nameEn: "",
      slug: "",
      description: "",
      shortDescription: "",
      price: "",
      originalPrice: "",
      categoryId: categories[0]?.id || "",
      concentration: "Eau de Parfum (EDP)",
      inspiration: "",
      brandCollection: "",
      isFeatured: false,
      isBestseller: false,
      isNewArrival: true,
      isPublished: true,
      stockQuantity: "15",
      lowStockAlert: "3",
      topNotes: "",
      heartNotes: "",
      baseNotes: "",
      images: [],
      sizes: [
        { size: "50ml", price: "", originalPrice: "", stock: "10", isDefault: true },
        { size: "100ml", price: "", originalPrice: "", stock: "5", isDefault: false },
      ],
    });
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameEn: product.nameEn || "",
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription || "",
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : "",
      categoryId: product.categoryId,
      concentration: product.concentration || "Eau de Parfum (EDP)",
      inspiration: product.inspiration || "",
      brandCollection: product.brandCollection || "",
      isFeatured: product.isFeatured,
      isBestseller: product.isBestseller,
      isNewArrival: product.isNewArrival,
      isPublished: product.isPublished,
      stockQuantity: product.stockQuantity.toString(),
      lowStockAlert: product.lowStockAlert.toString(),
      topNotes: product.topNotes || "",
      heartNotes: product.heartNotes || "",
      baseNotes: product.baseNotes || "",
      images: (product.images || []).map((img: any) => ({
        url: img.url,
        isPrimary: img.isPrimary,
      })),
      sizes:
        product.sizes && product.sizes.length > 0
          ? product.sizes.map((s: any) => ({
              size: s.size,
              price: s.price.toString(),
              originalPrice: s.originalPrice ? s.originalPrice.toString() : "",
              stock: s.stock.toString(),
              isDefault: s.isDefault,
            }))
          : [{ size: "100ml", price: product.price.toString(), originalPrice: "", stock: "10", isDefault: true }],
    });
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  // Upload image handler
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
      if (!res.ok) {
        setFormError(data.error || "فشل رفع الصورة");
      } else {
        setFormData((prev: any) => ({
          ...prev,
          images: [
            ...prev.images,
            { url: data.url, isPrimary: prev.images.length === 0 },
          ],
        }));
      }
    } catch {
      setFormError("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev: any) => {
      const newImages = prev.images.filter((_: any, idx: number) => idx !== indexToRemove);
      if (newImages.length > 0 && !newImages.some((img: any) => img.isPrimary)) {
        newImages[0].isPrimary = true;
      }
      return { ...prev, images: newImages };
    });
  };

  const setPrimaryImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images.map((img: any, idx: number) => ({
        ...img,
        isPrimary: idx === index,
      })),
    }));
  };

  // Add / Remove Sizes
  const addSizeRow = () => {
    setFormData((prev: any) => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        { size: "30ml", price: prev.price || "1000", originalPrice: "", stock: "10", isDefault: false },
      ],
    }));
  };

  const removeSizeRow = (index: number) => {
    if (formData.sizes.length <= 1) return;
    setFormData((prev: any) => ({
      ...prev,
      sizes: prev.sizes.filter((_: any, idx: number) => idx !== index),
    }));
  };

  const updateSizeField = (index: number, field: string, val: any) => {
    setFormData((prev: any) => {
      const updated = [...prev.sizes];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, sizes: updated };
    });
  };

  // Save product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    if (!formData.name || !formData.price || !formData.categoryId || !formData.description) {
      setFormError("يرجى ملء الحقول الإلزامية (الاسم، السعر، القسم، الوصف)");
      setSaving(false);
      return;
    }

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "فشل حفظ العطر");
        setSaving(false);
        return;
      }

      setFormSuccess(editingProduct ? "تم تحديث العطر بنجاح!" : "تم إضافة العطر الجديد بنجاح!");
      fetchProducts();
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

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
        setDeleteConfirmId(null);
      }
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  // Filtered
  const filteredProducts = products.filter((p) => {
    if (selectedCat !== "all" && p.categoryId !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchEn = p.nameEn?.toLowerCase().includes(q);
      if (!matchName && !matchEn) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eeeeee]">
        <div>
          <span className="text-[11px] font-bold text-[#c5a253] uppercase tracking-widest block mb-1">
            إدارة المخزون والكتالوج
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
            كتالوج العطور والمنتجات ({products.length})
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 text-xs font-bold transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#c5a253]" />
          <span>إضافة عطر جديد</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#fafafa] border border-[#eeeeee] p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم العطر..."
            className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 pr-9 text-xs focus:outline-none focus:border-black"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="w-full sm:w-56 bg-white border border-[#e5e5e5] px-3 py-2 text-xs focus:outline-none focus:border-black font-semibold"
        >
          <option value="all">جميع الأقسام</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-neutral-500">جاري تحميل قائمة العطور...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center border border-[#eeeeee] bg-[#fafafa] p-8">
          <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-bold text-sm text-black mb-1">لا توجد عطور مطابقة للبحث</h3>
          <p className="text-xs text-neutral-500 mb-4">أضف عطوراً جديدة أو اضبط معايير الفلترة</p>
          <button
            onClick={openAddModal}
            className="px-5 py-2 bg-black text-white text-xs font-bold"
          >
            + إضافة أول عطر
          </button>
        </div>
      ) : (
        <div className="border border-[#eeeeee] bg-white overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-[#fafafa] border-b border-[#eeeeee] text-neutral-500 font-semibold">
              <tr>
                <th className="p-3.5">الصورة</th>
                <th className="p-3.5">اسم العطر</th>
                <th className="p-3.5">القسم</th>
                <th className="p-3.5">السعر</th>
                <th className="p-3.5">المخزون</th>
                <th className="p-3.5">الحالة والتصنيف</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeee]">
              {filteredProducts.map((p) => {
                const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url;

                return (
                  <tr key={p.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="p-3.5">
                      <div className="w-12 h-14 bg-[#fafafa] border border-[#eeeeee] overflow-hidden">
                        {primaryImg ? (
                          <img src={primaryImg} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-300">
                            لا صورة
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <strong className="font-bold text-black block">{p.name}</strong>
                      {p.nameEn && <span className="text-[11px] text-neutral-400 font-sans">{p.nameEn}</span>}
                    </td>

                    <td className="p-3.5 text-[#c5a253] font-medium">
                      {p.category?.name || "غير محدد"}
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-black block">{p.price.toLocaleString()} ج.م</span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          {p.originalPrice.toLocaleString()} ج.م
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      {p.stockQuantity <= 3 ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold">
                          منخفض ({p.stockQuantity})
                        </span>
                      ) : (
                        <span className="font-medium text-neutral-700">{p.stockQuantity} قطعة</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {p.isPublished ? (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            منشور
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 text-[10px]">
                            مخفي
                          </span>
                        )}
                        {p.isBestseller && (
                          <span className="px-1.5 py-0.5 bg-[#fcf9f2] text-[#c5a253] border border-[#c5a253]/30 text-[10px] font-bold">
                            أكثر مبيعاً
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`/product/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-neutral-400 hover:text-black transition-colors"
                          title="معاينة في المتجر"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-neutral-600 hover:text-black transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white border border-[#eeeeee] p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-black">هل أنت متأكد من حذف هذا العطر؟</h3>
            <p className="text-xs text-neutral-500">
              سيتم حذف العطر وصوره وكافة المقاسات التابعة له نهائياً من قاعدة البيانات والمتجر.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-[#e5e5e5] text-xs font-semibold hover:bg-[#f5f5f5]"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white border border-[#eeeeee] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl my-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#eeeeee]">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#c5a253]" />
                <h2 className="font-bold text-base text-black">
                  {editingProduct ? "تعديل بيانات العطر" : "إضافة عطر جديد للكتالوج"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6">
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

              {/* 1. Basic Info */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#c5a253] border-b border-[#eeeeee] pb-1">
                  1. البيانات الأساسية
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      اسم العطر بالعربية <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: سلطان العود الملكي"
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      الاسم الإنجليزي (اختياري)
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="مثال: Royal Oud Sultan"
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:border-black dir-ltr text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      القسم / التصنيف <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:border-black font-semibold"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      تركيز العطر
                    </label>
                    <select
                      value={formData.concentration}
                      onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:border-black"
                    >
                      <option value="Eau de Parfum (EDP)">Eau de Parfum (EDP)</option>
                      <option value="Extrait de Parfum (إكستريت)">Extrait de Parfum (إكستريت)</option>
                      <option value="Eau de Toilette (EDT)">Eau de Toilette (EDT)</option>
                      <option value="Discovery Collection">Discovery Collection (مجموعة عينات)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      المجموعة العطرية
                    </label>
                    <input
                      type="text"
                      value={formData.brandCollection}
                      onChange={(e) => setFormData({ ...formData, brandCollection: e.target.value })}
                      placeholder="مثال: المجموعة الملكية الخاصة"
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    تصنيف الإلهام (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.inspiration}
                    onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
                    placeholder="مثال: توليفة نيش حصرية خاصة بالدار / مستوحى من كلاسيكيات الشرق"
                    className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    الوصف التفصيلي الكامل للعطر <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="اكتب وصفاً شاعرياً يصف إحساس وثبات وطابع هذا العطر..."
                    className="w-full bg-[#fafafa] border border-[#e5e5e5] p-3 text-xs focus:bg-white focus:outline-none focus:border-black resize-none"
                  />
                </div>
              </div>

              {/* 2. Fragrance Notes Pyramid */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#c5a253] border-b border-[#eeeeee] pb-1">
                  2. الهرم العطري والمكونات
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      افتتاحية العطر (Top Notes)
                    </label>
                    <input
                      type="text"
                      value={formData.topNotes}
                      onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                      placeholder="مثال: البرغموت، الهيل، الزعفران"
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      قلب العطر (Heart Notes)
                    </label>
                    <input
                      type="text"
                      value={formData.heartNotes}
                      onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                      placeholder="مثال: الورد الدمشقي، خشب الأرز"
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      قاعدة العطر (Base Notes)
                    </label>
                    <input
                      type="text"
                      value={formData.baseNotes}
                      onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                      placeholder="مثال: العود الكمبودي، العنبر النقي"
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Pricing & Sizes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-1">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#c5a253]">
                    3. الأسعار والأحجام والمخزون
                  </h3>
                  <button
                    type="button"
                    onClick={addSizeRow}
                    className="text-xs font-bold text-black hover:text-[#c5a253] flex items-center gap-1"
                  >
                    <span>+ إضافة حجم آخر</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      السعر الأساسي الافتراضي (ج.م) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="مثال: 1250"
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      السعر قبل الخصم (اختياري)
                    </label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="مثال: 1600"
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      الكمية الإجمالية في المخزن
                    </label>
                    <input
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Sub sizes table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-neutral-700 block">
                    قائمة الأحجام المتوفرة وأسعارها:
                  </span>
                  <div className="border border-[#eeeeee] divide-y divide-[#eeeeee]">
                    {formData.sizes.map((sz: any, idx: number) => (
                      <div key={idx} className="p-3 bg-[#fafafa] flex items-center gap-3 text-xs">
                        <input
                          type="text"
                          value={sz.size}
                          onChange={(e) => updateSizeField(idx, "size", e.target.value)}
                          placeholder="الحجم (50ml)"
                          className="w-24 bg-white border border-[#e5e5e5] p-1.5 text-xs text-center font-bold"
                        />
                        <input
                          type="number"
                          value={sz.price}
                          onChange={(e) => updateSizeField(idx, "price", e.target.value)}
                          placeholder="السعر"
                          className="w-28 bg-white border border-[#e5e5e5] p-1.5 text-xs text-center"
                        />
                        <input
                          type="number"
                          value={sz.originalPrice}
                          onChange={(e) => updateSizeField(idx, "originalPrice", e.target.value)}
                          placeholder="سعر قبل الخصم"
                          className="w-28 bg-white border border-[#e5e5e5] p-1.5 text-xs text-center"
                        />
                        <input
                          type="number"
                          value={sz.stock}
                          onChange={(e) => updateSizeField(idx, "stock", e.target.value)}
                          placeholder="المخزون"
                          className="w-20 bg-white border border-[#e5e5e5] p-1.5 text-xs text-center"
                        />
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="defaultSize"
                            checked={sz.isDefault}
                            onChange={() => {
                              const updated = formData.sizes.map((s: any, i: number) => ({
                                ...s,
                                isDefault: i === idx,
                              }));
                              setFormData({ ...formData, sizes: updated });
                            }}
                          />
                          <span className="text-[11px] text-neutral-500">افتراضي</span>
                        </label>
                        {formData.sizes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSizeRow(idx)}
                            className="text-red-500 hover:text-red-700 mr-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Product Images */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#c5a253] border-b border-[#eeeeee] pb-1">
                  4. صور العطر والزجاجة
                </h3>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Upload button */}
                  <label className="w-24 h-28 border-2 border-dashed border-[#e5e5e5] hover:border-black flex flex-col items-center justify-center p-2 cursor-pointer transition-colors bg-[#fafafa]">
                    <Upload className="w-5 h-5 text-neutral-400 mb-1" />
                    <span className="text-[10px] font-bold text-neutral-600 text-center">
                      {uploadingImage ? "جاري الرفع..." : "رفع صورة"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded images list */}
                  {formData.images.map((img: any, idx: number) => (
                    <div
                      key={idx}
                      className={`relative w-24 h-28 bg-[#fafafa] border overflow-hidden group ${
                        img.isPrimary ? "border-black ring-1 ring-black" : "border-[#e5e5e5]"
                      }`}
                    >
                      <img src={img.url} alt="العطر" className="w-full h-full object-cover" />

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(idx)}
                          className="px-2 py-0.5 bg-white text-black text-[9px] font-bold"
                        >
                          {img.isPrimary ? "الرئيسية" : "اجعلها رئيسية"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="text-red-400 hover:text-red-200 text-[10px]"
                        >
                          حذف
                        </button>
                      </div>

                      {img.isPrimary && (
                        <span className="absolute top-1 right-1 bg-black text-white text-[8px] font-bold px-1.5 py-0.5">
                          الرئيسية
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Toggles */}
              <div className="pt-2 border-t border-[#eeeeee] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="accent-black w-4 h-4"
                  />
                  <span className="font-bold">نشر في المتجر</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-black w-4 h-4"
                  />
                  <span>عطر مميز (Featured)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="accent-black w-4 h-4"
                  />
                  <span>الأكثر مبيعاً</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="accent-black w-4 h-4"
                  />
                  <span>وصل حديثاً</span>
                </label>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-6 border-t border-[#eeeeee] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[#e5e5e5] text-xs font-semibold hover:bg-[#f5f5f5]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs font-bold transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <span>حفظ ونشر العطر</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsManagementContent />
    </Suspense>
  );
}
