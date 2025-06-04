"use client";
import "./Auth.scss";
import { ReactNode } from "react";
import { useIsAuthenticated } from "@/store/hooks";
import { redirect } from "next/navigation";


export default function AuthLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    redirect("/");
  }
  
  return <div className="auth">{children}</div>;
}
