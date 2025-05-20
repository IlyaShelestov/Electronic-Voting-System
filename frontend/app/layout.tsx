import "@/styles/globals.scss";
import type { Metadata } from "next";
import MultiProvider from "@/providers/MultiProvider";
import { ApiProvider } from "@/providers/ApiProvider";

export const metadata: Metadata = {
  title: "eVote",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <MultiProvider>
      <ApiProvider>{children}</ApiProvider>
    </MultiProvider>
  );
}
