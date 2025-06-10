"use client";
import "./Auth.scss";

import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { useAuthRedux } from "@/store/hooks/useAuthRedux";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthRedux();

  if (isAuthenticated) {
    redirect("/");
  }

  return <div className="auth">{children}</div>;
}
