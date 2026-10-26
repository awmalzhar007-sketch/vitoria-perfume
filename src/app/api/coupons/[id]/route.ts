import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "تم حذف الكوبون بنجاح" });
  } catch (error) {
    console.error("Coupon DELETE error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف الكوبون" },
      { status: 500 }
    );
  }
}
