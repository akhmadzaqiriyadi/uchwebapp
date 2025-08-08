// src/app/(auth)/layout.tsx
"use client";

import { useAuth } from "@/_hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Hanya redirect jika benar-benar sudah ada user dan tidak loading
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  // Selalu tampilkan children, biarkan redirect bekerja di background
  return <>{children}</>;
}
