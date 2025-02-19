import "@/styles/globals.scss";

import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar/Sidebar";
import { MultiProvider } from "@/store/providers";
import Header from "@/components/Header/Header";

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
    <html lang="en">
      <MultiProvider>
        <body className={`antialiased`}>
          <Sidebar />
          <div className="content">
            <Header />
            <main>{children}</main>
          </div>
        </body>
      </MultiProvider>
    </html>
  );
}
