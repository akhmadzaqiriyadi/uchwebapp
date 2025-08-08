// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Provider yang kita buat
import { AuthProvider } from "@/_contexts/AuthContext";
import { QueryProvider } from "@/providers/query-provider"; // <-- Impor provider baru

// Komponen dari library
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UCH Creative Hub",
  description: "Booking System for UTY Creative Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Gunakan QueryProvider baru kita */}
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <Toaster richColors position="top-right" />
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}