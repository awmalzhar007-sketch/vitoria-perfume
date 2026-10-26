import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderNumber, phone } = await req.json();

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { error: "يرجى إدخال رقم الطلب ورقم الهاتف المسجل به" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s\-\+]/g, "").slice(-10); // match last 10 digits
    const cleanOrderNumber = orderNumber.trim().toUpperCase();

    const orders = await prisma.order.findMany({
      where: {
        orderNumber: {
          contains: cleanOrderNumber,
        },
      },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const matched = orders.find((ord) => {
      const orderPhoneClean = ord.customerPhone.replace(/[\s\-\+]/g, "").slice(-10);
      return orderPhoneClean === cleanPhone;
    });

    if (!matched) {
      return NextResponse.json(
        { error: "لم يتم العثور على طلب يطابق هذا الرقم ورقم الهاتف المدخلين. يرجى التحقق وإعادة المحاولة." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: matched.orderNumber,
        customerName: matched.customerName,
        status: matched.status,
        governorate: matched.governorate,
        city: matched.city,
        address: matched.address,
        landmark: matched.landmark,
        items: matched.items,
        total: matched.total,
        deliveryFee: matched.deliveryFee,
        discountAmount: matched.discountAmount,
        paymentMethod: matched.paymentMethod,
        paymentStatus: matched.paymentStatus,
        createdAt: matched.createdAt,
        statusHistory: matched.statusHistory,
      },
    });
  } catch (error) {
    console.error("Order track error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تتبع الطلب" },
      { status: 500 }
    );
  }
}
