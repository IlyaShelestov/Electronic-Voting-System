import { NextIntlClientProvider, hasLocale } from "next-intl";
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ToastContainer } from "react-toastify";
import ContentLayout from "@/app/[locale]/ContentLayout";
import { getMessages } from "next-intl/server";
import { ApiProvider } from "@/providers/ApiProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import MultiProvider from "@/providers/MultiProvider";


export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;


  if (!hasLocale(routing.locales, locale)) {
    redirect(`/${routing.defaultLocale}`);
  }

  return (
    <html lang={locale}>
      <body>
        <MultiProvider>
          <ApiProvider>
            <NextIntlClientProvider
            >
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
                  draggable
                  pauseOnHover
                  theme="light"
                />
                </AuthProvider>
              </NextIntlClientProvider>
          </ApiProvider>
        </MultiProvider>
      </body>
    </html>
  );
}
