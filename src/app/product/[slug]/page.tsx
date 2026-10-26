import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { ProductDetailClient } from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    select: { name: true, shortDescription: true, description: true },
  });

  if (!product) {
    return { title: "عطر غير موجود | فيتوريا VITORIA" };
  }

  return {
    title: `${product.name} | فيتوريا VITORIA`,
    description: product.shortDescription || product.description.slice(0, 160),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      sizes: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isPublished: true,
    },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      sizes: true,
    },
    take: 4,
  });

  const settings = await prisma.storeSettings.findUnique({
    where: { id: "default" },
    select: { whatsappNumber: true },
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductDetailClient
            product={product}
            relatedProducts={relatedProducts}
            whatsappNumber={settings?.whatsappNumber || "201098765432"}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
