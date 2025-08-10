// src/app/(main)/layout.tsx
"use client";

import { useAuth } from "@/_hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Daftar route yang bisa diakses tanpa login (public routes)
  const publicRoutes = ['/articles', '/'];
  
  // Cek apakah route saat ini adalah public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    // Hanya redirect ke login jika bukan public route dan user belum login
    if (!isLoading && !user && !isPublicRoute) {
      router.replace("/login");
    }
  }, [user, isLoading, router, isPublicRoute]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#2E417A]" />
        <p className="mt-2 text-gray-600">Memeriksa sesi...</p>
      </div>
    );
  }

  // Untuk public routes, tampilkan konten tanpa memeriksa user
  if (isPublicRoute) {
    return (
      <div className="pt-20">
        {children}
      </div>
    );
  }

  // Untuk protected routes, cek apakah user sudah login
  if (user) {
    return (
      <div className="pt-20">
        {children}
      </div>
    );
  }

  return null;
}