import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                slug: true,
                images: { take: 1, orderBy: { order: "asc" } },
              },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order GET error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب تفاصيل الطلب" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const { status, paymentStatus, internalNotes, statusComment } = await req.json();

    const existingOrder = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    const isStatusChanged = status && status !== existingOrder.status;

    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: existingOrder.id },
        data: {
          status: status || undefined,
          paymentStatus: paymentStatus || undefined,
          internalNotes: internalNotes !== undefined ? internalNotes : undefined,
        },
        include: {
          items: true,
          statusHistory: { orderBy: { createdAt: "desc" } },
        },
      });

      if (isStatusChanged) {
        await tx.orderStatusHistory.create({
          data: {
            orderId: existingOrder.id,
            status,
            comment: statusComment || `تم تغيير حالة الطلب بواسطة ${admin.name}`,
          },
        });
      }

      return order;
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Order PATCH error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث حالة الطلب" },
      { status: 500 }
    );
  }
}
