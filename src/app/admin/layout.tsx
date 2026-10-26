import React from "react";
import { AdminLayoutClient } from "./AdminLayoutClient";

export const metadata = {
  title: "لوحة التحكم المركزية | فيتوريا VITORIA",
  description: "لوحة تحكم إدارة المتجر والعطور والطلبات والمبيعات.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
