"use client";

import "./AdminPage.scss";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("adminPage");
  const tDashboard = useTranslations("dashboard");
  const pathname = usePathname();

  return (
    <AdminProtectedRoute>
      <h1>{t("title")}</h1>
      <div className="admin-page">
        <div className="admin-page__links">
          <Link
            href="/admin"
            className={clsx({ active: pathname === "/admin" })}
          >
            {tDashboard("title")}
          </Link>
          <Link
            href="/admin/users"
            className={clsx({ active: pathname === "/admin/users" })}
          >
            {t("userManagement")}
          </Link>
          <Link
            href="/admin/requests"
            className={clsx({ active: pathname === "/admin/requests" })}
          >
            {t("requestsManagement")}
          </Link>
        </div>
        {children}
      </div>
    </AdminProtectedRoute>
  );
}
