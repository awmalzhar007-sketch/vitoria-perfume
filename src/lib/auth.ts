import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { prisma } from "./prisma";

export interface AdminPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof secret !== "string" || secret.trim() === "") {
    throw new Error("JWT_SECRET environment variable is missing or empty.");
  }
  return secret;
}

function isAdminPayload(payload: unknown): payload is AdminPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  return (
    "id" in payload &&
    typeof payload.id === "string" &&
    "email" in payload &&
    typeof payload.email === "string" &&
    "role" in payload &&
    typeof payload.role === "string" &&
    "name" in payload &&
    typeof payload.name === "string"
  );
}

export function signAdminToken(payload: AdminPayload): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret);

    if (!isAdminPayload(decoded)) {
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies();
    const headerStore = await headers();
    let token = cookieStore.get("admin_token")?.value;

    if (!token) {
      const authHeader = headerStore.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (!token) return null;

    const payload = verifyAdminToken(token);
    if (!payload) return null;

    // Verify user still exists in DB
    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!admin) return null;
    return admin;
  } catch {
    return null;
  }
}
