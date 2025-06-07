import { NextIntlClientProvider } from 'next-intl';

import ReduxProvider from '@/providers/StoreProvider';

import { AuthProvider } from './AuthProvider';
import QueryProvider from './QueryClientProvider';

export default function MultiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <NextIntlClientProvider>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </NextIntlClientProvider>
    </ReduxProvider>
  );
}
