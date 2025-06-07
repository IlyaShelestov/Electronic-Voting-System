import '@/styles/globals.scss';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { ToastContainer } from 'react-toastify';

import ContentLayout from '@/app/ContentLayout';
import { AuthProvider } from '@/providers/AuthProvider';
import MultiProvider from '@/providers/MultiProvider';
import QueryProvider from '@/providers/QueryClientProvider';

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
  console.log(process.memoryUsage());
  return (
    <html lang={locale}>
      <body>
        <MultiProvider>
          <ContentLayout>{children}</ContentLayout>
          <ToastContainer
            aria-label={"Notifications"}
            position="bottom-right"
            draggable
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
            theme="light"
          />
        </MultiProvider>
      </body>
    </html>
  );
}
