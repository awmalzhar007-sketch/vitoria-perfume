import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const [
      totalOrders,
      ordersByStatus,
      productsCount,
      lowStockProducts,
      recentOrders,
      allOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.product.count(),
      prisma.product.findMany({
        where: {
          stockQuantity: { lte: 5 },
        },
        include: {
          images: { take: 1, orderBy: { order: "asc" } },
        },
        take: 10,
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.order.findMany({
        select: {
          total: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    // Calculate total sales from valid orders
    const validOrders = allOrders.filter((o) => o.status !== "CANCELLED");
    const totalSales = validOrders.reduce((sum, o) => sum + o.total, 0);

    const statusCounts: Record<string, number> = {
      NEW: 0,
      CONFIRMED: 0,
      PREPARING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    ordersByStatus.forEach((item) => {
      statusCounts[item.status] = item._count.id;
    });

    // Top selling products
    const bestsellers = await prisma.product.findMany({
      where: { isBestseller: true },
      include: {
        images: { take: 1, orderBy: { order: "asc" } },
        category: true,
      },
      take: 5,
    });

    return NextResponse.json({
      stats: {
        totalOrders,
        totalSales,
        productsCount,
        lowStockCount: lowStockProducts.length,
        statusCounts,
      },
      lowStockProducts,
      bestsellers,
      recentOrders,
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الإحصائيات" },
      { status: 500 }
    );
  }
}
