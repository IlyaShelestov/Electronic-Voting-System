import { NextIntlClientProvider, hasLocale } from "next-intl";
import { ToastContainer } from "react-toastify";
import ContentLayout from "@/app/ContentLayout";
import { AuthProvider } from "@/providers/AuthProvider";
import MultiProvider from "@/providers/MultiProvider";
import "@/styles/globals.scss";
import type { Metadata } from "next";
import QueryProvider from "@/providers/QueryClientProvider";
import { getLocale } from "next-intl/server";

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
  params: Promise<{locale: string}>;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        <MultiProvider>
          <NextIntlClientProvider>
            <QueryProvider>
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
            </QueryProvider>
          </NextIntlClientProvider>
        </MultiProvider>
      </body>
    </html>
  );
}
