import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { id: "default" },
      });
    }

    return NextResponse.json(
      { settings },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب إعدادات المتجر" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const data = await req.json();

    const thresholdVal =
      data.freeShippingThreshold !== undefined && data.freeShippingThreshold !== ""
        ? parseFloat(data.freeShippingThreshold)
        : 1500;

    const updated = await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: {
        storeName: data.storeName,
        storeNameEn: data.storeNameEn,
        logoText: data.logoText,
        tagLine: data.tagLine,
        announcementBarText: data.announcementBarText,
        showAnnouncementBar: Boolean(data.showAnnouncementBar),
        phone: data.phone,
        whatsappNumber: data.whatsappNumber,
        email: data.email,
        address: data.address,
        facebookUrl: data.facebookUrl,
        instagramUrl: data.instagramUrl,
        tiktokUrl: data.tiktokUrl,
        currency: data.currency || "EGP",
        enableFreeShipping: data.enableFreeShipping !== undefined ? Boolean(data.enableFreeShipping) : true,
        freeShippingThreshold: isNaN(thresholdVal) ? 1500 : thresholdVal,
        defaultDeliveryFee: parseFloat(data.defaultDeliveryFee || "50"),
        governorateFees: typeof data.governorateFees === "string" ? data.governorateFees : JSON.stringify(data.governorateFees || {}),
        enableCashOnDelivery: Boolean(data.enableCashOnDelivery),
        enableInstapay: Boolean(data.enableInstapay),
        instapayInstructions: data.instapayInstructions,
        heroImage: data.heroImage,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroDescription: data.heroDescription,
        heroBadgeTitle: data.heroBadgeTitle,
        heroBadgeSubtitle: data.heroBadgeSubtitle,
        heroPrimaryBtnText: data.heroPrimaryBtnText,
        heroPrimaryBtnLink: data.heroPrimaryBtnLink,
        heroSecondaryBtnText: data.heroSecondaryBtnText,
        heroSecondaryBtnLink: data.heroSecondaryBtnLink,
        aboutImage: data.aboutImage,
        aboutTitle: data.aboutTitle,
        aboutSubtitle: data.aboutSubtitle,
        aboutDescription: data.aboutDescription,
      },
      create: {
        id: "default",
        ...data,
      },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/cart");
      revalidatePath("/checkout");
    } catch {}

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ إعدادات المتجر" },
      { status: 500 }
    );
  }
}
