"use client";

import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';

import { useAppSelector, useIsAuthenticated } from '@/store/hooks';

export default function AdminLayout({ children }: { children: React.ReactNode }) {        
    const t = useTranslations("adminPage");

    return (
        <>
            <h1>{t("title")}</h1>
            {children}
        </>
    )
}
