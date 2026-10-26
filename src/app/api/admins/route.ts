import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Admins GET error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب قائمة المديرين" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const current = await getCurrentAdmin();
    if (!current || current.role !== "superadmin") {
      return NextResponse.json(
        { error: "غير مصرح لك بإضافة مدراء جدد، الصلاحية للمدير العام فقط" },
        { status: 403 }
      );
    }

    const { name, email, password, role = "manager" } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "يرجى استكمال جميع الحقول (الاسم، البريد، كلمة المرور)" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مسجل بالفعل لمدير آخر" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.adminUser.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, admin: newAdmin });
  } catch (error) {
    console.error("Admin POST error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة المدير" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const current = await getCurrentAdmin();
    if (!current || current.role !== "superadmin") {
      return NextResponse.json(
        { error: "غير مصرح لك بحذف المدراء" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "معرف المدير مطلوب" }, { status: 400 });
    }

    if (id === current.id) {
      return NextResponse.json({ error: "لا يمكنك حذف حسابك الحالي" }, { status: 400 });
    }

    await prisma.adminUser.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "تم حذف المدير بنجاح" });
  } catch (error) {
    console.error("Admin DELETE error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف المدير" },
      { status: 500 }
    );
  }
}
