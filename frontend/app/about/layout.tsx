import { UserProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProtectedRoute>{children}</UserProtectedRoute>;
}
