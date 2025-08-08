// src/app/(main)/layout.tsx
"use client";

import { useAuth } from "@/_hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#2E417A]" />
        <p className="mt-2 text-gray-600">Memeriksa sesi...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="pt-20">
        {children}
      </div>
    );
  }

  return null;
}