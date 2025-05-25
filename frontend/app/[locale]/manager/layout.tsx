"use client";
import { useTranslations } from "next-intl";



export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations('Manager');
    return (
        <>
            <h1>{t('title')}</h1>
            {children}
        </>
    );
}
