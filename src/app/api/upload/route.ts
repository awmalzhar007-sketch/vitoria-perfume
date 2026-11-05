import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import path from "path";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح لك برفع الصور" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "لم يتم اختيار أي ملف" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "نوع الملف غير مدعوم، يرجى رفع صورة بصيغة JPG أو PNG أو WEBP" },
        { status: 400 }
      );
    }

    // Vercel Function request bodies are limited; leave room for multipart overhead.
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "حجم الصورة كبير جداً، الحد الأقصى هو 4 ميجابايت" },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "") || "perfume";

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`${baseName}${ext}`, file, {
        access: "public",
        addRandomSuffix: true,
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        fileName: blob.pathname,
      });
    }

    // Fallback: If Vercel Blob token is not configured, encode image as base64 data URL
    // so images can be saved and displayed without throwing error 500
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // Also attempt writing to filesystem for local development
    try {
      const { promises: fs } = await import("fs");
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const fileName = `${baseName}-${uniqueSuffix}${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, fileName), buffer);

      if (process.env.VERCEL !== "1") {
        return NextResponse.json({
          success: true,
          url: `/uploads/${fileName}`,
          fileName,
        });
      }
    } catch {
      // Serverless readonly fallback
    }

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: `${baseName}${ext}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "فشل رفع الصورة، يرجى المحاولة مرة أخرى" },
      { status: 500 }
    );
  }
}
