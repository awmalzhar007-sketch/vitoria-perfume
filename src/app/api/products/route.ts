import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import fallbackData from "@/lib/fallback-data.json";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort"); // price_asc, price_desc, newest, bestseller
    const featured = searchParams.get("featured");
    const bestseller = searchParams.get("bestseller");
    const newArrival = searchParams.get("new");
    const publishedOnly = searchParams.get("admin") !== "true";

    const LEGACY_DUMMY_SLUGS = [
      "royal-oud-sultan",
      "rose-noire-elixir",
      "pure-musk-blanche",
      "imperial-amber-supreme",
      "sovereign-leather",
      "discovery-set-prestige",
      "stellar-times",
      "tobacco-vanille",
      "la-capitale",
      "nishane-ani",
      "dior-homme-intense",
      "black-orchid",
      "black-mango",
      "black-afgano",
      "angels-share-on-the-rocks",
      "naxos",
    ];

    try {
      await prisma.productImage.deleteMany({ where: { product: { slug: { in: LEGACY_DUMMY_SLUGS } } } });
      await prisma.productSize.deleteMany({ where: { product: { slug: { in: LEGACY_DUMMY_SLUGS } } } });
      await prisma.product.deleteMany({ where: { slug: { in: LEGACY_DUMMY_SLUGS } } });
      await prisma.orderItem.deleteMany({ where: { order: { orderNumber: { in: ["ORD-2025-1001", "ORD-2025-1002"] } } } });
      await prisma.orderStatusHistory.deleteMany({ where: { order: { orderNumber: { in: ["ORD-2025-1001", "ORD-2025-1002"] } } } });
      await prisma.order.deleteMany({ where: { orderNumber: { in: ["ORD-2025-1001", "ORD-2025-1002"] } } });
    } catch {}

    const where: any = {
      slug: { notIn: LEGACY_DUMMY_SLUGS },
    };

    if (publishedOnly) {
      where.isPublished = true;
    }

    if (categorySlug && categorySlug !== "all") {
      where.category = { slug: categorySlug };
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (bestseller === "true") {
      where.isBestseller = true;
    }

    if (newArrival === "true") {
      where.isNewArrival = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { nameEn: { contains: search } },
        { description: { contains: search } },
        { brandCollection: { contains: search } },
        { inspiration: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price_desc") {
      orderBy = { price: "desc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    } else if (sort === "bestseller") {
      orderBy = [{ isBestseller: "desc" }, { createdAt: "desc" }];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
        sizes: true,
      },
      orderBy,
    });

    let result = products;
    if (!result || result.length === 0) {
      result = (fallbackData.products as any) || [];
      if (categorySlug && categorySlug !== "all") {
        result = result.filter((p: any) => p.category?.slug === categorySlug);
      }
      if (search) {
        const q = search.toLowerCase();
        result = result.filter((p: any) =>
          p.name?.toLowerCase().includes(q) ||
          p.nameEn?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        );
      }
    }

    result = result.filter((p: any) => !LEGACY_DUMMY_SLUGS.includes(p.slug));

    return NextResponse.json({ products: result });
  } catch (error) {
    console.error("Products GET error:", error);
    // Return fallback data so the store continues to operate smoothly
    return NextResponse.json({ products: (fallbackData.products as any) || [] });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const data = await req.json();

    if (!data.name || !data.price || !data.categoryId || !data.description) {
      return NextResponse.json(
        { error: "يرجى ملء جميع الحقول الإلزامية (اسم العطر، السعر، القسم، الوصف)" },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    const baseSlug = (data.slug || data.nameEn || data.name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-") || `perfume-${Date.now()}`;

    // Ensure unique slug
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Resolve valid categoryId (supports slug or id)
    let categoryId = data.categoryId;
    const catCheck = await prisma.category.findFirst({
      where: {
        OR: [{ id: categoryId }, { slug: categoryId }],
      },
    });
    if (catCheck) {
      categoryId = catCheck.id;
    } else {
      const defaultCat = await prisma.category.findFirst();
      if (defaultCat) categoryId = defaultCat.id;
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        nameEn: data.nameEn || null,
        slug: uniqueSlug,
        description: data.description,
        shortDescription: data.shortDescription || null,
        price: parseFloat(data.price) || 0,
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        categoryId: categoryId,
        concentration: data.concentration || "Eau de Parfum (EDP)",
        inspiration: data.inspiration || null,
        brandCollection: data.brandCollection || null,
        isFeatured: Boolean(data.isFeatured),
        isBestseller: Boolean(data.isBestseller),
        isNewArrival: data.isNewArrival !== undefined ? Boolean(data.isNewArrival) : true,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        stockQuantity: parseInt(data.stockQuantity || "10", 10),
        lowStockAlert: parseInt(data.lowStockAlert || "3", 10),
        topNotes: data.topNotes || null,
        heartNotes: data.heartNotes || null,
        baseNotes: data.baseNotes || null,
        images: {
          create: (data.images || []).map((img: any, idx: number) => ({
            url: typeof img === "string" ? img : img.url,
            isPrimary: idx === 0 || img.isPrimary === true,
            order: idx,
          })),
        },
        sizes: {
          create: (data.sizes && data.sizes.length > 0)
            ? data.sizes.map((sz: any, idx: number) => ({
                size: sz.size || "50ml",
                price: parseFloat(sz.price) || parseFloat(data.price) || 0,
                originalPrice: sz.originalPrice ? parseFloat(sz.originalPrice) : null,
                stock: parseInt(sz.stock || "10", 10),
                isDefault: idx === 0 || sz.isDefault === true,
              }))
            : [
                {
                  size: "100ml",
                  price: parseFloat(data.price) || 0,
                  originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
                  stock: parseInt(data.stockQuantity || "10", 10),
                  isDefault: true,
                },
              ],
        },
      },
      include: {
        category: true,
        images: true,
        sizes: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { error: error?.message || "حدث خطأ أثناء إضافة العطر" },
      { status: 500 }
    );
  }
}
