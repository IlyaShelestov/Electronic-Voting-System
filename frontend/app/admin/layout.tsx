"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/store/hooks";
import { useIsAuthenticated } from "@/store/hooks";    

export default function AdminLayout({ children }: { children: React.ReactNode }) {        
    const t = useTranslations("adminPage");

    return (
        <>
            <h1>{t("title")}</h1>
            {children}
        </>
    )
}
