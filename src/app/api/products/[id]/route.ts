import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
        sizes: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "العطر غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب تفاصيل العطر" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "العطر غير موجود" }, { status: 404 });
    }

    // Update main product fields
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name : existing.name,
        nameEn: data.nameEn !== undefined ? data.nameEn : existing.nameEn,
        slug: data.slug !== undefined ? data.slug : existing.slug,
        description: data.description !== undefined ? data.description : existing.description,
        shortDescription: data.shortDescription !== undefined ? data.shortDescription : existing.shortDescription,
        price: data.price !== undefined ? parseFloat(data.price) : existing.price,
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        categoryId: data.categoryId !== undefined ? data.categoryId : existing.categoryId,
        concentration: data.concentration !== undefined ? data.concentration : existing.concentration,
        inspiration: data.inspiration !== undefined ? data.inspiration : existing.inspiration,
        brandCollection: data.brandCollection !== undefined ? data.brandCollection : existing.brandCollection,
        isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : existing.isFeatured,
        isBestseller: data.isBestseller !== undefined ? Boolean(data.isBestseller) : existing.isBestseller,
        isNewArrival: data.isNewArrival !== undefined ? Boolean(data.isNewArrival) : existing.isNewArrival,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : existing.isPublished,
        stockQuantity: data.stockQuantity !== undefined ? parseInt(data.stockQuantity, 10) : existing.stockQuantity,
        lowStockAlert: data.lowStockAlert !== undefined ? parseInt(data.lowStockAlert, 10) : existing.lowStockAlert,
        topNotes: data.topNotes !== undefined ? data.topNotes : existing.topNotes,
        heartNotes: data.heartNotes !== undefined ? data.heartNotes : existing.heartNotes,
        baseNotes: data.baseNotes !== undefined ? data.baseNotes : existing.baseNotes,
      },
    });

    // If images array provided, replace
    if (data.images && Array.isArray(data.images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      for (let i = 0; i < data.images.length; i++) {
        const img = data.images[i];
        await prisma.productImage.create({
          data: {
            productId: id,
            url: typeof img === "string" ? img : img.url,
            isPrimary: i === 0 || img.isPrimary === true,
            order: i,
          },
        });
      }
    }

    // If sizes array provided, replace
    if (data.sizes && Array.isArray(data.sizes)) {
      await prisma.productSize.deleteMany({ where: { productId: id } });
      for (let i = 0; i < data.sizes.length; i++) {
        const sz = data.sizes[i];
        await prisma.productSize.create({
          data: {
            productId: id,
            size: sz.size,
            price: parseFloat(sz.price),
            originalPrice: sz.originalPrice ? parseFloat(sz.originalPrice) : null,
            stock: parseInt(sz.stock || "10", 10),
            isDefault: i === 0 || sz.isDefault === true,
          },
        });
      }
    }

    const fullProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        sizes: true,
      },
    });

    return NextResponse.json({ success: true, product: fullProduct });
  } catch (error) {
    console.error("Product PUT error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تعديل بيانات العطر" },
      { status: 500 }
    );
  }
}

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

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "تم حذف العطر بنجاح" });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف العطر" },
      { status: 500 }
    );
  }
}
