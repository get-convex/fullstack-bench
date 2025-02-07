import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function WorkspaceAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-[#0D1117]">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
