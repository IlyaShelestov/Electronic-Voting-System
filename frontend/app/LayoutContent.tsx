"use client";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useAppSelector } from "@/store/hooks";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  return (
    <>
      <Sidebar />
      <div
        className={`content ${isAuthenticated ? "with-sidebar" : "full-width"}`}
      >
        <Header />
        <main>{children}</main>
      </div>
    </>
  );
};

export default LayoutContent;
