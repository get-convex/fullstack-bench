"use client";

import { useUser } from "@/components/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAdmin, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && requireAdmin && !isAdmin) {
      router.push("/");
    }
  }, [isLoading, requireAdmin, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="animate-pulse text-[#A1A1A3]">Loading...</div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}