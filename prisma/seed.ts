import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fallbackData from "../src/lib/fallback-data.json";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding unified data from fallback-data.json...");

  // 1. Admin
  const adminEmail = process.env.ADMIN_EMAIL || "awmalzhar@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ahmedwaled007";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: "مدير المتجر", role: "superadmin" },
    create: { email: adminEmail, passwordHash, name: "مدير المتجر", role: "superadmin" },
  });

  // 2. Settings
  if (fallbackData.settings) {
    const s = fallbackData.settings as any;
    const { id, createdAt, updatedAt, ...rest } = s;
    await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: rest,
      create: { id: "default", ...rest },
    });
  }

  // 3. Categories
  for (const cat of (fallbackData.categories as any[])) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive,
      },
    });
  }

  // Delete any legacy categories that are not part of the active 5 categories
  const validSlugs = (fallbackData.categories as any[]).map((c: any) => c.slug);
  try {
    await prisma.category.deleteMany({
      where: {
        slug: { notIn: validSlugs },
      },
    });
  } catch (err) {
    console.warn("Notice cleaning old categories:", err);
  }

  // 4. Products
  for (const prod of (fallbackData.products as any[])) {
    const { category, images, sizes, createdAt, updatedAt, _count, ...prodData } = prod;
    const createdProd = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prodData,
      create: prodData,
    });

    if (images && images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: createdProd.id } });
      for (const img of images) {
        await prisma.productImage.create({
          data: {
            productId: createdProd.id,
            url: img.url,
            isPrimary: img.isPrimary,
            order: img.order,
          },
        });
      }
    }

    if (sizes && sizes.length > 0) {
      await prisma.productSize.deleteMany({ where: { productId: createdProd.id } });
      for (const sz of sizes) {
        await prisma.productSize.create({
          data: {
            productId: createdProd.id,
            size: sz.size,
            price: sz.price,
            originalPrice: sz.originalPrice,
            stock: sz.stock,
            isDefault: sz.isDefault,
          },
        });
      }
    }
  }

  console.log(`Seeding finished! Seeded ${fallbackData.products.length} perfumes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
