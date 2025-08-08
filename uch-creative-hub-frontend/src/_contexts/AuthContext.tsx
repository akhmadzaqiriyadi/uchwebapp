// src/_contexts/AuthContext.tsx
"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Definisikan tipe data lengkap untuk User
export interface User {
  id: number;
  role: "USER" | "ADMIN";
  name: string;
  email: string;
  npm: string;
  prodi: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void; // Fungsi login sekarang menerima data user
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      // Saat aplikasi dimuat, ambil token dan data user dari localStorage
      const storedToken = localStorage.getItem("uch-token");
      const storedUser = localStorage.getItem("uch-user");
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser)); // Ambil dan parse data user
        setToken(storedToken);
      }
    } catch (error) {
      // Jika ada error (misal: data tidak valid), bersihkan storage
      localStorage.removeItem("uch-token");
      localStorage.removeItem("uch-user");
      console.error("Auth Error on load:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    // Simpan token dan data user ke localStorage
    localStorage.setItem("uch-token", newToken);
    localStorage.setItem("uch-user", JSON.stringify(userData));
    setUser(userData);
    setToken(newToken);
  };

  const logout = () => {
    // Hapus token dan data user dari localStorage
    localStorage.removeItem("uch-token");
    localStorage.removeItem("uch-user");
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  const value = { user, token, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};