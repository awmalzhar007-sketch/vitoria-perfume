import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import fallbackData from "@/lib/fallback-data.json";

const VALID_CATEGORY_SLUGS = ["oriental", "winter", "summer", "best-seller", "bundles"];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get("all") === "true";

    // Clean up any legacy dummy categories in the database
    try {
      await prisma.category.deleteMany({
        where: {
          slug: { notIn: VALID_CATEGORY_SLUGS },
        },
      });
    } catch {
      // ignore
    }

    const categories = await prisma.category.findMany({
      where: {
        slug: { in: VALID_CATEGORY_SLUGS },
        ...(includeAll ? {} : { isActive: true }),
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    let result = categories.filter((c) => VALID_CATEGORY_SLUGS.includes(c.slug));
    if (!result || result.length === 0) {
      result = (fallbackData.categories as any) || [];
    }
    return NextResponse.json({ categories: result });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ categories: (fallbackData.categories as any) || [] });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { name, slug, description, image, displayOrder } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "اسم القسم مطلوب" }, { status: 400 });
    }

    const finalSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-") || `cat-${Date.now()}`;

    const existing = await prisma.category.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json({ error: "الاسم اللطيف (Slug) مستخدم بالفعل" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        image: image || null,
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Categories POST error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة القسم" },
      { status: 500 }
    );
  }
}
