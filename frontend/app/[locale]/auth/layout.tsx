import "./Auth.scss";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="auth">{children}</div>;
}
