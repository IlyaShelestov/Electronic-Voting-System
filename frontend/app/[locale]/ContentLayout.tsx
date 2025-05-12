"use client";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useAppSelector } from "@/store/hooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContentLayout = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  return (
    <>
      <Sidebar />
      <div
        className={`content ${isAuthenticated ? "with-sidebar" : "full-width"}`}
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
};

export default ContentLayout;
