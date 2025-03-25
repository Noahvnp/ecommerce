"use client";

import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "./components/AdminLayout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <AdminChecking>{children}</AdminChecking>
    </AuthContextProvider>
  );
}

function AdminChecking({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      const timeout = setTimeout(() => {
        router.push("/sign-in");
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <AiOutlineLoading3Quarters size={100} className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">Please Login First</h1>
      </div>
    );
  }
  return <AdminLayout>{children}</AdminLayout>;
}
