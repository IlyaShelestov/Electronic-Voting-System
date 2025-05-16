"use client";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useAppSelector } from "@/store/hooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { memo } from "react";
import clsx from "clsx";

const ContentLayout = memo(({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  return (
    <>
      <Sidebar />
      <div
        className={clsx("content", {
          "with-sidebar": isAuthenticated,
          "full-width": !isAuthenticated,
        })}
      >
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
        />
        <Header />
        <main>{children}</main>
      </div>
    </>
  );
});

ContentLayout.displayName = "ContentLayout";

export default ContentLayout;
