import { UserProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProtectedRoute>{children}</UserProtectedRoute>;
}
