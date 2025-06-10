import "@/styles/globals.scss";

import { getLocale } from "next-intl/server";

import ContentLayout from "@/app/ContentLayout";
import ToastNotification from "@/components/ToastNotification/ToastNotification";
import MultiProvider from "@/providers/MultiProvider";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "eVote",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        <MultiProvider>
          <ToastNotification>
            <ContentLayout>{children}</ContentLayout>
          </ToastNotification>
        </MultiProvider>
      </body>
    </html>
  );
}
