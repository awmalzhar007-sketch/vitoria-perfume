"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Check, AlertCircle, Truck, Store, CreditCard, MessageSquare, Image as ImageIcon, Upload, RotateCcw, Sparkles } from "lucide-react";

export default function StoreSettingsPage() {
  const [settings, setSettings] = useState<any>({
    storeName: "فيتوريا | VITORIA",
    storeNameEn: "VITORIA LUXURY PARFUMS",
    logoText: "VITORIA",
    tagLine: "دار فيتوريا للعطور الفاخرة — فخامة تدوم وحضور لا يُنسى",
    announcementBarText: "✨ شحن مجاني لكافة محافظات مصر للطلبات أكثر من 1500 ج.م + عينة فاخرة مع كل طلب",
    showAnnouncementBar: true,
    phone: "0220488620",
    whatsappNumber: "01026673838",
    email: "abdoelssayer@gmail.com",
    address: "شارع التسعين الشمالي، التجمع الخامس، القاهرة، مصر",
    enableFreeShipping: true,
    freeShippingThreshold: 1000,
    defaultDeliveryFee: 50,
    enableCashOnDelivery: true,
    enableInstapay: true,
    instapayInstructions: "يرجى التحويل إلى عنوان الدفع اللحظي: 01026673838 ثم إرسال صورة إشعار التحويل عبر الواتساب لتأكيد الطلب فوراً.",
    heroImage: "/uploads/WhatsAppImage2026-10-18at125321-1792916211201-qpjkk5.jpeg",
    heroTitle: "THE ESSENCE OF NOBILITY\nAN UNFORGETTABLE SILLAGE",
    heroSubtitle: "ROYAL NICHE BLENDS — 24H+ LONGEVITY",
    heroDescription: "VITORIA Haute Parfumerie crafts rare, evocative olfactory portraits. More than a fragrance—an indelible aura of presence and distinction.",
    heroBadgeTitle: "VITORIA Royal Parfums",
    heroBadgeSubtitle: "Extrait de Parfum • Pure Niche Blends",
    heroPrimaryBtnText: "Explore Collection",
    heroPrimaryBtnLink: "/shop",
    heroSecondaryBtnText: "Discover Bestsellers",
    heroSecondaryBtnLink: "/shop?filter=bestsellers",
    aboutImage: "/uploads/WhatsAppImage2026-10-25at155928-1793009151963-h30pff.jpeg",
    aboutTitle: "VITORIA Haute Parfumerie — Where Scent Becomes Art",
    aboutSubtitle: "Our Heritage & Philosophy",
    aboutDescription: "Born from a deep passion for rare perfume oils and timeless elegance, VITORIA creates fragrances of unmatched nobility, longevity, and depth.",
  });

  const [govFees, setGovFees] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
        if (data.settings.governorateFees) {
          try {
            setGovFees(JSON.parse(data.settings.governorateFees));
          } catch (e) {
            console.error(e);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGovFeeChange = (gov: string, val: string) => {
    setGovFees((prev) => ({
      ...prev,
      [gov]: parseFloat(val) || 0,
    }));
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHeroImage(true);
    setError("");
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setSettings((prev: any) => ({ ...prev, heroImage: data.url }));
        setSuccess("تم رفع صورة البانر بنجاح! لا تنسَ الضغط على 'حفظ التعديلات'.");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.error || "فشل رفع الصورة");
      }
    } catch {
      setError("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAboutImage(true);
    setError("");
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setSettings((prev: any) => ({ ...prev, aboutImage: data.url }));
        setSuccess("تم رفع صورة صفحة 'من نحن' بنجاح! لا تنسَ الضغط على 'حفظ التعديلات'.");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.error || "فشل رفع الصورة");
      }
    } catch {
      setError("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploadingAboutImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          governorateFees: JSON.stringify(govFees),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "فشل حفظ الإعدادات");
      } else {
        setSuccess("تم حفظ كافة إعدادات المتجر بنجاح!");
        setTimeout(() => setSuccess(""), 4000);
      }
    } catch {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-neutral-500">جاري تحميل إعدادات المتجر...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eeeeee]">
        <div>
          <span className="text-[11px] font-bold text-[#c5a253] uppercase tracking-widest block mb-1">
            التهيئة وتخصيص المتجر
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
            إعدادات المتجر والشحن والدفع
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white px-6 py-2.5 text-xs font-bold transition-colors flex items-center gap-2"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4 text-[#c5a253]" />
          )}
          <span>حفظ التعديلات</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Identity & Branding */}
        <div className="bg-[#fafafa] border border-[#eeeeee] p-6 space-y-4">
          <h2 className="text-sm font-bold text-black border-b border-[#eeeeee] pb-2 flex items-center gap-2">
            <Store className="w-4 h-4 text-[#c5a253]" />
            <span>الهوية واسم المتجر</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                اسم المتجر بالعربية
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                اسم المتجر بالإنجليزية
              </label>
              <input
                type="text"
                value={settings.storeNameEn}
                onChange={(e) => setSettings({ ...settings, storeNameEn: e.target.value })}
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black dir-ltr text-right"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                نص الشعار المختصر (Logo Text)
              </label>
              <input
                type="text"
                value={settings.logoText}
                onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                الشعار اللفظي (Slogan / Tagline)
              </label>
              <input
                type="text"
                value={settings.tagLine}
                onChange={(e) => setSettings({ ...settings, tagLine: e.target.value })}
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* 2. Hero Section & Main Image */}
        <div className="bg-[#fafafa] border border-[#eeeeee] p-6 space-y-6">
          <div className="border-b border-[#eeeeee] pb-3">
            <h2 className="text-sm font-bold text-black flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#c5a253]" />
              <span>صورة وبانر الواجهة الرئيسية (Hero Section)</span>
            </h2>
            <p className="text-[11px] text-neutral-500 mt-1">
              تحكم بالصورة الكبيرة المعروضة في صدر المتجر الرئيسي وكافة العناوين والأزرار الترويجية.
            </p>
          </div>

          {/* Image Upload & Preview */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-black">
              صورة البانر الرئيسية (صورة زجاجة العطر / الواجهة)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-white border border-[#e5e5e5]">
              <div className="relative w-32 h-40 bg-[#f9f9f9] border border-[#e5e5e5] overflow-hidden shrink-0 flex items-center justify-center">
                {settings.heroImage ? (
                  <img
                    src={settings.heroImage}
                    alt="معاينة صورة الواجهة"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-neutral-300" />
                )}
                {uploadingHeroImage && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-3 flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer bg-black hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold transition-colors inline-flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-[#c5a253]" />
                    <span>{uploadingHeroImage ? "جاري الرفع..." : "اختر صورة جديدة من جهازك"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      disabled={uploadingHeroImage}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        heroImage:
                          "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop",
                      })
                    }
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3.5 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                    <span>استعادة الصورة الأصلية</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    أو ضع رابط مباشر للصورة (URL)
                  </label>
                  <input
                    type="text"
                    value={settings.heroImage || ""}
                    onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-[#fcfcfc] border border-[#e5e5e5] px-3.5 py-1.5 text-xs focus:outline-none focus:border-black font-mono dir-ltr text-right"
                  />
                </div>
                <p className="text-[10px] text-neutral-400">
                  الحجم الموصى به: نسبة 4:5 أو مربعة بدقة عالية (مثل 1000×1250 بكسل).
                </p>
              </div>
            </div>
          </div>

          {/* Texts & Headings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                العنوان الرئيسي الكبير (Title)
              </label>
              <textarea
                rows={2}
                value={settings.heroTitle || ""}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                placeholder="فخامة الحضور..&#10;وأثر لا يُمحى"
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black font-bold"
              />
              <span className="text-[10px] text-neutral-400">يمكنك الضغط على Enter للنزول لسطر جديد</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                النص الترويجي أعلى العنوان (Badge / Subtitle)
              </label>
              <input
                type="text"
                value={settings.heroSubtitle || ""}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                placeholder="توليفات ملكية خاصة — ثبات يدوم أكثر من 24 ساعة"
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">
              الوصف الترويجي أسفل العنوان (Description)
            </label>
            <textarea
              rows={2}
              value={settings.heroDescription || ""}
              onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
              placeholder="دار فيتوريا VITORIA للعطور الملكية الفاخرة..."
              className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
            />
          </div>

          {/* Badge under image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#eeeeee]">
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                عنوان كارت التقييم أسفل الصورة
              </label>
              <input
                type="text"
                value={settings.heroBadgeTitle || ""}
                onChange={(e) => setSettings({ ...settings, heroBadgeTitle: e.target.value })}
                placeholder="VITORIA Royal Parfums"
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                وصف كارت التقييم أسفل الصورة
              </label>
              <input
                type="text"
                value={settings.heroBadgeSubtitle || ""}
                onChange={(e) => setSettings({ ...settings, heroBadgeSubtitle: e.target.value })}
                placeholder="خلاصات ملكية فريدة تدوم طويلاً"
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#eeeeee]">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-black">
                الزر الأساسي (الأسود)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={settings.heroPrimaryBtnText || ""}
                  onChange={(e) => setSettings({ ...settings, heroPrimaryBtnText: e.target.value })}
                  placeholder="نص الزر: تسوق الآن"
                  className="w-full bg-white border border-[#e5e5e5] px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                />
                <input
                  type="text"
                  value={settings.heroPrimaryBtnLink || ""}
                  onChange={(e) => setSettings({ ...settings, heroPrimaryBtnLink: e.target.value })}
                  placeholder="الرابط: /shop"
                  className="w-full bg-white border border-[#e5e5e5] px-3 py-1.5 text-xs focus:outline-none focus:border-black dir-ltr text-right font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-black">
                الزر الثانوي (الأبيض)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={settings.heroSecondaryBtnText || ""}
                  onChange={(e) => setSettings({ ...settings, heroSecondaryBtnText: e.target.value })}
                  placeholder="نص الزر: تشكيلة العطور"
                  className="w-full bg-white border border-[#e5e5e5] px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                />
                <input
                  type="text"
                  value={settings.heroSecondaryBtnLink || ""}
                  onChange={(e) => setSettings({ ...settings, heroSecondaryBtnLink: e.target.value })}
                  placeholder="الرابط: /shop"
                  className="w-full bg-white border border-[#e5e5e5] px-3 py-1.5 text-xs focus:outline-none focus:border-black dir-ltr text-right font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. About Page Customization & Image */}
        <div className="bg-[#fafafa] border border-[#eeeeee] p-6 space-y-6">
          <div className="border-b border-[#eeeeee] pb-3">
            <h2 className="text-sm font-bold text-black flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#c5a253]" />
              <span>صورة ومحتوى صفحة من نحن (About Us)</span>
            </h2>
            <p className="text-[11px] text-neutral-500 mt-1">
              تحكم بالصورة المميزة المعروضة في صفحة (من نحن) وعناوين القصة والفلسفة.
            </p>
          </div>

          {/* Image Upload & Preview */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-black">
              الصورة الرئيسية لصفحة (من نحن)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-white border border-[#e5e5e5]">
              <div className="relative w-44 aspect-[16/9] bg-[#f9f9f9] border border-[#e5e5e5] overflow-hidden shrink-0 flex items-center justify-center">
                {settings.aboutImage ? (
                  <img
                    src={settings.aboutImage}
                    alt="معاينة صورة من نحن"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-neutral-300" />
                )}
                {uploadingAboutImage && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-3 flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer bg-black hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold transition-colors inline-flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-[#c5a253]" />
                    <span>{uploadingAboutImage ? "جاري الرفع..." : "اختر صورة جديدة من جهازك"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAboutImageUpload}
                      disabled={uploadingAboutImage}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        aboutImage:
                          "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1200&auto=format&fit=crop",
                      })
                    }
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3.5 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                    <span>استعادة الصورة الأصلية</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    أو ضع رابط مباشر للصورة (URL)
                  </label>
                  <input
                    type="text"
                    value={settings.aboutImage || ""}
                    onChange={(e) => setSettings({ ...settings, aboutImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-[#fcfcfc] border border-[#e5e5e5] px-3.5 py-1.5 text-xs focus:outline-none focus:border-black font-mono dir-ltr text-right"
                  />
                </div>
                <p className="text-[10px] text-neutral-400">
                  الحجم الموصى به: نسبة عرض إلى ارتفاع 16:9 وبدقة عالية (مثل 1200×675 بكسل).
                </p>
              </div>
            </div>
          </div>

          {/* About Headings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                عنوان صفحة من نحن (Title)
              </label>
              <input
                type="text"
                value={settings.aboutTitle || ""}
                onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                placeholder="فيتوريا VITORIA.. حين يتحول العطر إلى لغة"
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                النص الترويجي أعلى العنوان (Subtitle)
              </label>
              <input
                type="text"
                value={settings.aboutSubtitle || ""}
                onChange={(e) => setSettings({ ...settings, aboutSubtitle: e.target.value })}
                placeholder="قصة الدار وفلسفتنا"
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">
              الوصف والقصة في بداية الصفحة (Description)
            </label>
            <textarea
              rows={3}
              value={settings.aboutDescription || ""}
              onChange={(e) => setSettings({ ...settings, aboutDescription: e.target.value })}
              placeholder="انطلقت دار فيتوريا VITORIA من شغف عميق بفنون العطارة النادرة..."
              className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* 4. Announcement Bar */}
        <div className="bg-[#fafafa] border border-[#eeeeee] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
            <h2 className="text-sm font-bold text-black flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#c5a253]" />
              <span>شريط الإعلانات الترويجي أعلى الموقع</span>
            </h2>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
              <input
                type="checkbox"
                checked={settings.showAnnouncementBar}
                onChange={(e) => setSettings({ ...settings, showAnnouncementBar: e.target.checked })}
                className="accent-black w-4 h-4"
              />
              <span>إظهار الشريط</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">
              نص الإعلان الترويجي
            </label>
            <input
              type="text"
              value={settings.announcementBarText}
              onChange={(e) => setSettings({ ...settings, announcementBarText: e.target.value })}
              className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* 4. Contact & WhatsApp */}
        <div className="bg-[#fafafa] border border-[#eeeeee] p-6 space-y-4">
          <h2 className="text-sm font-bold text-black border-b border-[#eeeeee] pb-2">
            أرقام التواصل وخدمة العملاء
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                رقم الواتساب لاستقبال الطلبات
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                رقم الهاتف الأرضي / المحمول
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                البريد الإلكتروني للشكاوى
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black dir-ltr text-right"
              />
            </div>
          </div>
        </div>

        {/* 4. Shipping & Delivery Fees */}
        <div className="bg-[#fafafa] border border-[#eeeeee] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#eeeeee] gap-3">
            <h2 className="text-sm font-bold text-black flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#c5a253]" />
              <span>إعدادات الشحن ومصاريف التوصيل للمحافظات</span>
            </h2>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold bg-white px-3 py-1.5 border border-[#e5e5e5] rounded select-none">
              <input
                type="checkbox"
                checked={settings.enableFreeShipping !== false}
                onChange={(e) => setSettings({ ...settings, enableFreeShipping: e.target.checked })}
                className="accent-black w-4 h-4"
              />
              <span>تفعيل عرض الشحن المجاني التلقائي</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={settings.enableFreeShipping === false ? "opacity-50" : ""}>
              <label className="block text-xs font-bold text-black mb-1">
                حد الشحن المجاني بالجنيه (الحد الأدنى لقيمة الطلب)
              </label>
              <input
                type="number"
                disabled={settings.enableFreeShipping === false}
                value={settings.freeShippingThreshold ?? 1500}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black font-bold"
                placeholder="1500"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">
                {settings.enableFreeShipping === false
                  ? "❌ عرض الشحن المجاني معطل حالياً — سيتم احتساب رسوم التوصيل على كل الطلبات."
                  : "✓ عندما تتخطى سلة العميل هذا المبلغ، يُعفى من مصاريف الشحن ويظهر له شريط المكافأة."}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                مصاريف الشحن الافتراضية لأي محافظة غير محددة (ج.م)
              </label>
              <input
                type="number"
                value={settings.defaultDeliveryFee}
                onChange={(e) => setSettings({ ...settings, defaultDeliveryFee: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 text-xs focus:outline-none focus:border-black font-bold"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">
                تطبق على المحافظات التي لم يُحدد لها سعر خاص في الجدول أدناه.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-neutral-800 mb-2">
              جدول مصاريف التوصيل لكل محافظة (ج.م):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(govFees).map(([gov, fee]) => (
                <div key={gov} className="flex items-center justify-between p-2 bg-white border border-[#e5e5e5] text-xs">
                  <span className="font-semibold text-neutral-800 truncate">{gov}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={fee}
                      onChange={(e) => handleGovFeeChange(gov, e.target.value)}
                      className="w-16 bg-[#fafafa] border border-[#e5e5e5] p-1 text-xs text-center font-bold"
                    />
                    <span className="text-[10px] text-neutral-400">ج.م</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Payment Methods */}
        <div className="bg-[#fafafa] border border-[#eeeeee] p-6 space-y-4">
          <h2 className="text-sm font-bold text-black border-b border-[#eeeeee] pb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#c5a253]" />
            <span>طرق الدفع المفعلة</span>
          </h2>

          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
              <input
                type="checkbox"
                checked={settings.enableCashOnDelivery}
                onChange={(e) => setSettings({ ...settings, enableCashOnDelivery: e.target.checked })}
                className="accent-black w-4 h-4"
              />
              <span>تفعيل الدفع عند الاستلام (كاش)</span>
            </label>

            <div className="space-y-2 pt-2 border-t border-[#eeeeee]">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                <input
                  type="checkbox"
                  checked={settings.enableInstapay}
                  onChange={(e) => setSettings({ ...settings, enableInstapay: e.target.checked })}
                  className="accent-black w-4 h-4"
                />
                <span>تفعيل الدفع اللحظي عبر إنستاباي (InstaPay)</span>
              </label>

              {settings.enableInstapay && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    تعليمات التحويل للعميل:
                  </label>
                  <textarea
                    rows={2}
                    value={settings.instapayInstructions}
                    onChange={(e) => setSettings({ ...settings, instapayInstructions: e.target.value })}
                    className="w-full bg-white border border-[#e5e5e5] p-2.5 text-xs focus:outline-none focus:border-black resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white px-8 py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
          >
            {saving ? "جاري الحفظ..." : "حفظ التعديلات والإعدادات"}
          </button>
        </div>
      </form>
    </div>
  );
}
