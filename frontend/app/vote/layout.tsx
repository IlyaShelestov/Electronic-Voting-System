import { UserProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProtectedRoute>{children}</UserProtectedRoute>;
}
