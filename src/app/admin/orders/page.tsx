"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Eye,
  Phone,
  MessageCircle,
  Printer,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  XCircle,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  NEW: { label: "جديد", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  CONFIRMED: { label: "تم التأكيد", color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle2 },
  PREPARING: { label: "جاري التجهيز", color: "bg-purple-50 text-purple-700 border-purple-200", icon: Package },
  SHIPPED: { label: "تم الشحن", color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: Truck },
  DELIVERED: { label: "تم التسليم", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  CANCELLED: { label: "ملغي", color: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
};

function OrdersManagementContent() {
  const searchParams = useSearchParams();
  const initialViewNumber = searchParams.get("view");

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    if (initialViewNumber && orders.length > 0) {
      const matched = orders.find((o) => o.orderNumber === initialViewNumber);
      if (matched) openOrderDetails(matched);
    }
  }, [initialViewNumber, orders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = "/api/orders";
      if (statusFilter !== "ALL") {
        url += `?status=${statusFilter}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setAdminNotes(order.internalNotes || "");
    setStatusSuccess("");
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          internalNotes: adminNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.order);
        setStatusSuccess("تم تحديث حالة الطلب بنجاح!");
        fetchOrders();
        setTimeout(() => setStatusSuccess(""), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const saveAdminNotes = async () => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internalNotes: adminNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.order);
        setStatusSuccess("تم حفظ الملاحظات بنجاح!");
        fetchOrders();
        setTimeout(() => setStatusSuccess(""), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Export to CSV with UTF-8 BOM
  const exportToCSV = () => {
    if (orders.length === 0) return;

    const headers = [
      "رقم الطلب",
      "اسم العميل",
      "رقم الهاتف",
      "المحافظة",
      "المدينة",
      "العنوان",
      "العلامة المميزة",
      "المجموع الفرعي",
      "الشحن",
      "الخصم",
      "الإجمالي الكلي",
      "طريقة الدفع",
      "الحالة",
      "تاريخ الطلب",
      "ملاحظات العميل",
    ];

    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.governorate}"`,
      `"${o.city}"`,
      `"${o.address}"`,
      `"${o.landmark || ""}"`,
      o.subtotal,
      o.deliveryFee,
      o.discountAmount,
      o.total,
      `"${o.paymentMethod}"`,
      `"${o.status}"`,
      `"${new Date(o.createdAt).toLocaleString("ar-EG")}"`,
      `"${o.notes || ""}"`,
    ]);

    // Prepend UTF-8 BOM for Excel Arabic character support
    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders-vitoria-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      const matchGov = o.governorate.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchGov) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eeeeee]">
        <div>
          <span className="text-[11px] font-bold text-[#c5a253] uppercase tracking-widest block mb-1">
            إدارة المبيعات والتسليم
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
            قائمة ومتابعة الطلبات ({orders.length})
          </h1>
        </div>

        <button
          onClick={exportToCSV}
          className="bg-white border border-[#e5e5e5] hover:border-black text-black px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-[#c5a253]" />
          <span>تصدير الطلبات (Excel / CSV)</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#fafafa] border border-[#eeeeee] p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم الطلب، اسم العميل، الهاتف، أو المحافظة..."
            className="w-full bg-white border border-[#e5e5e5] px-3.5 py-2 pr-9 text-xs focus:outline-none focus:border-black"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-56 bg-white border border-[#e5e5e5] px-3 py-2 text-xs focus:outline-none focus:border-black font-semibold"
        >
          <option value="ALL">جميع الحالات</option>
          <option value="NEW">جديد (New)</option>
          <option value="CONFIRMED">تم التأكيد (Confirmed)</option>
          <option value="PREPARING">جاري التجهيز (Preparing)</option>
          <option value="SHIPPED">تم الشحن (Shipped)</option>
          <option value="DELIVERED">تم التسليم (Delivered)</option>
          <option value="CANCELLED">ملغي (Cancelled)</option>
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-neutral-500">جاري تحميل الطلبات...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center border border-[#eeeeee] bg-[#fafafa] p-8">
          <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-bold text-sm text-black mb-1">لا توجد طلبات مطابقة</h3>
          <p className="text-xs text-neutral-500">جرب تغيير معايير البحث أو تصفية الحالة</p>
        </div>
      ) : (
        <div className="border border-[#eeeeee] bg-white overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-[#fafafa] border-b border-[#eeeeee] text-neutral-500 font-semibold">
              <tr>
                <th className="p-3.5">رقم الطلب</th>
                <th className="p-3.5">العميل</th>
                <th className="p-3.5">الهاتف والتواصل</th>
                <th className="p-3.5">المحافظة والعنوان</th>
                <th className="p-3.5">الإجمالي</th>
                <th className="p-3.5">طريقة الدفع</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5">التاريخ</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeee]">
              {filteredOrders.map((ord) => {
                const statusMeta = STATUS_CONFIG[ord.status] || STATUS_CONFIG.NEW;
                const cleanPhone = ord.customerPhone.replace(/[^0-9]/g, "");

                return (
                  <tr key={ord.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-black">
                      #{ord.orderNumber}
                    </td>

                    <td className="p-3.5 font-bold text-neutral-900">
                      {ord.customerName}
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${ord.customerPhone}`}
                          className="font-mono text-neutral-700 hover:text-black dir-ltr text-right"
                          title="اتصال هاتفياً"
                        >
                          {ord.customerPhone}
                        </a>
                        <a
                          href={`https://wa.me/${cleanPhone.startsWith("0") ? "2" + cleanPhone : cleanPhone}?text=${encodeURIComponent(
                            `مرحباً ${ord.customerName}، بخصوص طلبك رقم #${ord.orderNumber} من متجر فيتوريا VITORIA...`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-[#25D366] hover:bg-emerald-50 rounded"
                          title="محادثة واتساب"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-black block">{ord.governorate}</span>
                      <span className="text-[11px] text-neutral-400 line-clamp-1">{ord.city} - {ord.address}</span>
                    </td>

                    <td className="p-3.5 font-bold text-black">
                      {ord.total.toLocaleString()} ج.م
                    </td>

                    <td className="p-3.5 text-neutral-600">
                      {ord.paymentMethod === "COD" ? "كاش عند الاستلام" : "إنستاباي"}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] font-bold border ${statusMeta.color}`}
                      >
                        {statusMeta.label}
                      </span>
                    </td>

                    <td className="p-3.5 text-[11px] text-neutral-500">
                      {new Date(ord.createdAt).toLocaleDateString("ar-EG")}
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => openOrderDetails(ord)}
                        className="bg-black hover:bg-neutral-800 text-white px-3 py-1.5 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#c5a253]" />
                        <span>فتح الطلب</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white border border-[#eeeeee] max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl my-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#eeeeee] bg-[#fafafa]">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#c5a253]" />
                <div>
                  <h2 className="font-bold text-base text-black">
                    تفاصيل الطلب #{selectedOrder.orderNumber}
                  </h2>
                  <span className="text-xs text-neutral-500">
                    تاريخ الطلب: {new Date(selectedOrder.createdAt).toLocaleString("ar-EG")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-white border border-[#e5e5e5] hover:border-black text-black px-3 py-1.5 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[#c5a253]" />
                  <span>طباعة البوليصة</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-neutral-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {statusSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{statusSuccess}</span>
                </div>
              )}

              {/* Status Update Quick Bar */}
              <div className="p-4 bg-[#fafafa] border border-[#eeeeee] space-y-2">
                <label className="text-xs font-bold text-neutral-800 block">
                  تحديث حالة هذا الطلب:
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => updateOrderStatus(key)}
                      className={`px-3 py-1.5 text-xs font-bold border transition-all ${
                        selectedOrder.status === key
                          ? "bg-black text-white border-black shadow-xs"
                          : "bg-white text-neutral-700 border-[#e5e5e5] hover:border-black"
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer and Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer card */}
                <div className="p-4 border border-[#eeeeee] space-y-2 text-xs bg-white">
                  <h4 className="font-bold text-sm text-black border-b border-[#eeeeee] pb-1.5">
                    بيانات العميل
                  </h4>
                  <p><span className="text-neutral-500">الاسم:</span> <strong className="text-black">{selectedOrder.customerName}</strong></p>
                  <p className="flex items-center gap-2">
                    <span className="text-neutral-500">الهاتف:</span>
                    <a href={`tel:${selectedOrder.customerPhone}`} className="font-bold text-black dir-ltr hover:underline">
                      {selectedOrder.customerPhone}
                    </a>
                    <a
                      href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `مرحباً ${selectedOrder.customerName}، بخصوص طلبك رقم #${selectedOrder.orderNumber} من متجر فيتوريا VITORIA...`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 bg-[#25D366] text-white text-[10px] font-bold rounded flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>واتساب</span>
                    </a>
                  </p>
                  {selectedOrder.customerEmail && (
                    <p><span className="text-neutral-500">البريد:</span> {selectedOrder.customerEmail}</p>
                  )}
                </div>

                {/* Shipping address card */}
                <div className="p-4 border border-[#eeeeee] space-y-2 text-xs bg-white">
                  <h4 className="font-bold text-sm text-black border-b border-[#eeeeee] pb-1.5">
                    عنوان التوصيل
                  </h4>
                  <p><span className="text-neutral-500">المحافظة:</span> <strong className="text-black">{selectedOrder.governorate}</strong></p>
                  <p><span className="text-neutral-500">المدينة / الحي:</span> {selectedOrder.city}</p>
                  <p><span className="text-neutral-500">العنوان بالتفصيل:</span> {selectedOrder.address}</p>
                  {selectedOrder.landmark && (
                    <p><span className="text-neutral-500">علامة مميزة:</span> <strong className="text-amber-800">{selectedOrder.landmark}</strong></p>
                  )}
                  {selectedOrder.notes && (
                    <p><span className="text-neutral-500">ملاحظات العميل:</span> {selectedOrder.notes}</p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-black">العطور المطلوبة</h4>
                <div className="border border-[#eeeeee] divide-y divide-[#eeeeee]">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {item.productImage && (
                          <div className="w-10 h-12 bg-[#fafafa] border border-[#f0f0f0] overflow-hidden shrink-0">
                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-black block">{item.productName}</span>
                          <span className="text-[11px] text-neutral-500">الحجم: {item.selectedSize}</span>
                        </div>
                      </div>
                      <div className="text-left font-bold text-black">
                        {item.quantity} × {item.unitPrice.toLocaleString()} = {item.totalPrice.toLocaleString()} ج.م
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="bg-[#fafafa] border border-[#eeeeee] p-4 text-xs space-y-2 max-w-sm mr-auto">
                <div className="flex justify-between text-neutral-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-black">{selectedOrder.subtotal.toLocaleString()} ج.م</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>خصم الكوبون ({selectedOrder.couponCode}):</span>
                    <span>-{selectedOrder.discountAmount.toLocaleString()} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>مصاريف التوصيل:</span>
                  <span className="font-bold text-black">
                    {selectedOrder.deliveryFee === 0 ? "شحن مجاني" : `${selectedOrder.deliveryFee} ج.م`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#eeeeee] flex justify-between text-sm font-extrabold text-black">
                  <span>الإجمالي المطلوب تحصيله:</span>
                  <span className="text-base">{selectedOrder.total.toLocaleString()} ج.م</span>
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div className="space-y-2 pt-2 border-t border-[#eeeeee]">
                <label className="text-xs font-bold text-neutral-800 block">
                  ملاحظات الإدارة الداخلية (لا تظهر للعميل):
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="مثال: تم التأكيد هاتفياً، المندوب كابتن محمد استلم الشحنة..."
                  className="w-full bg-[#fafafa] border border-[#e5e5e5] p-3 text-xs focus:bg-white focus:outline-none focus:border-black resize-none"
                />
                <button
                  type="button"
                  onClick={saveAdminNotes}
                  disabled={updatingStatus}
                  className="px-4 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-colors"
                >
                  حفظ الملاحظة
                </button>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#eeeeee]">
                  <h4 className="text-xs font-bold text-neutral-700">سجل تغيرات الحالة:</h4>
                  <div className="space-y-1.5">
                    {selectedOrder.statusHistory.map((h: any) => (
                      <div key={h.id} className="text-[11px] text-neutral-500 flex items-center justify-between bg-[#fafafa] p-2 border border-[#f0f0f0]">
                        <span>{h.status} - {h.comment || "تغيير حالة"}</span>
                        <span>{new Date(h.createdAt).toLocaleString("ar-EG")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrdersManagementContent />
    </Suspense>
  );
}
