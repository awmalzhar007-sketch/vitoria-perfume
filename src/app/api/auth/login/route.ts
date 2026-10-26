import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "يرجى إدخال البريد الإلكتروني وكلمة المرور" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const masterEmail = (process.env.ADMIN_EMAIL || "awmalzhar@gmail.com").toLowerCase().trim();
    const masterPassword = process.env.ADMIN_PASSWORD || "ahmedwaled007";

    const isMaster = cleanEmail === masterEmail && password === masterPassword;

    let admin: any = null;
    try {
      admin = await prisma.adminUser.findUnique({
        where: { email: cleanEmail },
      });
    } catch (err) {
      console.warn("Prisma admin lookup notice:", err);
    }

    if (isMaster) {
      if (!admin) {
        admin = {
          id: "master-admin",
          email: masterEmail,
          name: "مدير المتجر",
          role: "superadmin",
        };
      }
    } else {
      if (!admin) {
        return NextResponse.json(
          { error: "بيانات الدخول غير صحيحة" },
          { status: 401 }
        );
      }

      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "بيانات الدخول غير صحيحة" },
          { status: 401 }
        );
      }
    }

    const token = signAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    const isHttps = req.headers.get("x-forwarded-proto") === "https" || process.env.NODE_ENV === "production";

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة لاحقاً" },
      { status: 500 }
    );
  }
}
