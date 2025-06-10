"use client";
import React from "react";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import LoadingCircle from "@/components/LoadingCircle/LoadingCircle";
import Main from "@/components/Main/Main";
import Sidebar from "@/components/Sidebar/Sidebar";
import { usePageLoading } from "@/store/hooks";
import { useAuthRedux } from "@/store/hooks/useAuthRedux";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading: authLoading } = useAuthRedux();
  const pageLoading = usePageLoading();
  return (
    <>
      {isAuthenticated && <Sidebar />}
      <div className={`content ${isAuthenticated ? "authenticated" : ""}`}>
        <Header />
        <Main>
          {(authLoading || pageLoading) && <LoadingCircle />}
          {!authLoading && !pageLoading && children}
        </Main>
        <Footer />
      </div>
    </>
  );
}
