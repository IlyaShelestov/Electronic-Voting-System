
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ToastContainer } from "react-toastify";
import ContentLayout from "@/app/[locale]/ContentLayout";
import { AuthProvider } from "@/providers/AuthProvider";
import MultiProvider from "@/providers/MultiProvider";
import "@/styles/globals.scss";
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

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    redirect(`/${routing.defaultLocale}`);
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <MultiProvider>
            <AuthProvider>
              <ContentLayout>{children}</ContentLayout>

              <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                pauseOnHover
                theme="light"
              />
              </AuthProvider>
        </MultiProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
