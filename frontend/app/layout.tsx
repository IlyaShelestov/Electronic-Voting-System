import "@/styles/globals.scss";

import type { Metadata } from "next";
import AuthChecker from "./auth/AuthChecker";
import LayoutContent from "./LayoutContent";
import MultiProvider from "@/providers/MultiProvider";

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
    <MultiProvider>
      <AuthChecker />
      <html lang="ru">
        <body>
          <LayoutContent>{children}</LayoutContent>
        </body>
      </html>
    </MultiProvider>
  );
}
