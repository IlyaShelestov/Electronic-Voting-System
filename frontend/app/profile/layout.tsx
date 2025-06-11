import { UserProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProtectedRoute>{children}</UserProtectedRoute>;
}
