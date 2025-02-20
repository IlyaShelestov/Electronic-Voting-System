import "@/styles/globals.scss";

import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import ReduxProvider from "../store/StoreProvider";

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
      <html lang="ru">
        <body>
          <Sidebar />
          <div className="content">
            <Header />
            <main>{children}</main>
          </div>
        </body>
      </html>
    </ReduxProvider>
  );
}
