import { NextIntlClientProvider, hasLocale } from "next-intl";
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ToastContainer } from "react-toastify";
import ContentLayout from "@/app/[locale]/ContentLayout";
import { getMessages } from "next-intl/server";
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const defaultLocale = routing.defaultLocale;
  if (!hasLocale(routing.locales, locale)) {
    redirect(`/${defaultLocale}`);
  }

  let messages;
  try {
    messages = await getMessages({locale});
  } catch (error) {
    redirect(`/${defaultLocale}`);
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
        >
          <ContentLayout>{children}</ContentLayout>
        </NextIntlClientProvider>

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
      </body>
    </html>
  );
}
