import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { governorate: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الطلبات" },
      { status: 500 }
    );
  }
}

// Egyptian phone validation helper
function isValidEgyptianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\+]/g, "");
  // Accept: 010xxxxxxxx, 011xxxxxxxx, 012xxxxxxxx, 015xxxxxxxx, or 2010xxxxxxxx
  const localRegex = /^01[0125][0-9]{8}$/;
  const intlRegex = /^201[0125][0-9]{8}$/;
  return localRegex.test(cleaned) || intlRegex.test(cleaned);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      governorate,
      city,
      address,
      landmark,
      notes,
      items,
      couponCode,
      paymentMethod = "COD",
    } = body;

    // 1. Validation
    if (!customerName || !customerName.trim()) {
      return NextResponse.json({ error: "يرجى كتابة الاسم بالكامل" }, { status: 400 });
    }

    if (!customerPhone || !isValidEgyptianPhone(customerPhone)) {
      return NextResponse.json(
        { error: "يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678 أو 011xxxxxxxx)" },
        { status: 400 }
      );
    }

    if (!governorate || !city || !address) {
      return NextResponse.json(
        { error: "يرجى استكمال بيانات العنوان (المحافظة، المدينة، والعنوان بالتفصيل)" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "سلة التسوق فارغة" }, { status: 400 });
    }

    // 2. Fetch Store Settings for delivery calculation
    const settings = await prisma.storeSettings.findUnique({
      where: { id: "default" },
    });

    const defaultFee = settings?.defaultDeliveryFee || 50;
    const enableFreeShipping = settings?.enableFreeShipping ?? true;
    const freeThreshold = settings?.freeShippingThreshold ?? 1500;
    let govFeesMap: Record<string, number> = {};
    if (settings?.governorateFees) {
      try {
        govFeesMap = JSON.parse(settings.governorateFees);
      } catch (e) {
        console.error("Failed to parse governorateFees", e);
      }
    }

    // 3. Verify products, calculate exact server-side subtotal
    let calculatedSubtotal = 0;
    const orderItemsToCreate: Array<{
      productId: string;
      productName: string;
      productImage: string | null;
      selectedSize: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }> = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          sizes: true,
        },
      });

      if (!product || !product.isPublished) {
        return NextResponse.json(
          { error: `المنتج "${item.name || "عطر"}" غير متاح حالياً` },
          { status: 400 }
        );
      }

      // Check specific size price
      const matchedSize = product.sizes.find(
        (s) => s.size.toLowerCase() === (item.size || "").toLowerCase()
      );

      const unitPrice = matchedSize ? matchedSize.price : product.price;
      const quantity = Math.max(1, parseInt(item.quantity || 1, 10));
      const lineTotal = unitPrice * quantity;
      calculatedSubtotal += lineTotal;

      orderItemsToCreate.push({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0]?.url || null,
        selectedSize: item.size || "100ml",
        unitPrice,
        quantity,
        totalPrice: lineTotal,
      });
    }

    // 4. Validate coupon if provided
    let discountAmount = 0;
    let appliedCouponCode: string | null = null;

    if (couponCode && couponCode.trim()) {
      const code = couponCode.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({
        where: { code },
      });

      if (coupon && coupon.isActive) {
        const isNotExpired = !coupon.expiresAt || new Date(coupon.expiresAt) > new Date();
        const hasUsesLeft = !coupon.maxUsageCount || coupon.usedCount < coupon.maxUsageCount;
        const meetsMinOrder = calculatedSubtotal >= coupon.minOrderValue;

        if (isNotExpired && hasUsesLeft && meetsMinOrder) {
          appliedCouponCode = coupon.code;
          if (coupon.discountType === "PERCENTAGE") {
            discountAmount = (calculatedSubtotal * coupon.discountValue) / 100;
          } else {
            discountAmount = Math.min(coupon.discountValue, calculatedSubtotal);
          }
          // Increment used count
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    // 5. Calculate delivery fee
    let deliveryFee = govFeesMap[governorate] ?? defaultFee;
    if (enableFreeShipping && calculatedSubtotal >= freeThreshold) {
      deliveryFee = 0;
    }

    const finalTotal = Math.max(0, calculatedSubtotal - discountAmount + deliveryFee);

    // 6. Generate unique order number
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    // 7. Save Order in Transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail?.trim() || null,
          governorate,
          city: city.trim(),
          address: address.trim(),
          landmark: landmark?.trim() || null,
          notes: notes?.trim() || null,
          subtotal: calculatedSubtotal,
          deliveryFee,
          discountAmount,
          couponCode: appliedCouponCode,
          total: finalTotal,
          status: "NEW",
          paymentMethod,
          paymentStatus: "PENDING",
          items: {
            create: orderItemsToCreate,
          },
          statusHistory: {
            create: {
              status: "NEW",
              comment: "تم استلام الطلب بنجاح عبر المتجر الإلكتروني",
            },
          },
        },
        include: {
          items: true,
        },
      });

      // Decrement stock
      for (const item of orderItemsToCreate) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return created;
    });

    return NextResponse.json({
      success: true,
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        total: newOrder.total,
        subtotal: newOrder.subtotal,
        deliveryFee: newOrder.deliveryFee,
        discountAmount: newOrder.discountAmount,
        governorate: newOrder.governorate,
        city: newOrder.city,
        address: newOrder.address,
        landmark: newOrder.landmark,
        paymentMethod: newOrder.paymentMethod,
        items: newOrder.items,
        createdAt: newOrder.createdAt,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل طلبك، يرجى المحاولة مرة أخرى أو التواصل معنا عبر الواتساب" },
      { status: 500 }
    );
  }
}
