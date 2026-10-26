import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || !code.trim()) {
      return NextResponse.json({ error: "يرجى إدخال كود الخصم" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "كود الخصم غير صالح أو منتهي الصلاحية" }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "عذراً، انتهت صلاحية كود الخصم هذا" }, { status: 400 });
    }

    if (coupon.maxUsageCount && coupon.usedCount >= coupon.maxUsageCount) {
      return NextResponse.json({ error: "عذراً، وصل هذا الكوبون للحد الأقصى لمرات الاستخدام" }, { status: 400 });
    }

    const currentSubtotal = parseFloat(subtotal || "0");
    if (currentSubtotal < coupon.minOrderValue) {
      return NextResponse.json(
        {
          error: `الحد الأدنى للطلب لتفعيل هذا الكوبون هو ${coupon.minOrderValue} ج.م (قيمة سلتك الحالية: ${currentSubtotal} ج.م)`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (currentSubtotal * coupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(coupon.discountValue, currentSubtotal);
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء فحص كود الخصم" },
      { status: 500 }
    );
  }
}
