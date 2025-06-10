"use client";
import { useTranslations } from "next-intl";

import { ManagerProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("managerPage");
  return (
    <ManagerProtectedRoute>
      <div className="manager-layout">
        <h1>{t("title")}</h1>
        {children}
      </div>
    </ManagerProtectedRoute>
  );
}
