import "@/styles/globals.scss";

import type { Metadata } from "next";
import ReduxProvider from "../store/StoreProvider";
import AuthChecker from "./auth/AuthChecker";
import LayoutContent from "./LayoutContent";

export const metadata: Metadata = {
  title: "eVote",
  description: "eVote",
    icons: {
      icon: "/favicon.ico",

    }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <AuthChecker />
      <html lang="ru">
        <body>
          <LayoutContent>{children}</LayoutContent>
        </body>
      </html>
    </ReduxProvider>
  );
}
