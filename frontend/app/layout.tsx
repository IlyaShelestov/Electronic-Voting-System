import "@/styles/globals.scss";

import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import ReduxProvider from "../store/StoreProvider";
import AuthChecker from "./auth/AuthChecker";
import { useAppSelector } from "@/store/hooks";
import LayoutContent from "./LayoutContent";

export const metadata: Metadata = {
  title: "eVote",
  description: "eVote",
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
