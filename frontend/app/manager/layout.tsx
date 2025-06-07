"use client";
import { useTranslations } from 'next-intl';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="manager-layout">
            <h1>Manager</h1>
            {children}
        </div>
    );
}
