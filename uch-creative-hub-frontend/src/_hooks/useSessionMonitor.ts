// src/_hooks/useSessionMonitor.ts
"use client";

import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useSessionMonitor = () => {
  const { user, token, logout } = useAuth();

  useEffect(() => {
    // Hanya monitor jika user sudah authenticated
    if (!user || !token) return;

    // Periksa status session setiap 30 menit (lebih longgar)
    const sessionInterval = setInterval(() => {
      // Simple check: pastikan user dan token masih ada
      const storedToken = localStorage.getItem("uch-token");
      const storedUser = localStorage.getItem("uch-user");
      
      if (!storedToken || !storedUser) {
        logout();
      }
    }, 30 * 60 * 1000); // 30 menit

    // Periksa session saat tab menjadi aktif kembali
    const handleVisibilityChange = () => {
      if (!document.hidden && user && token) {
        // Simple check saat tab aktif kembali
        const storedToken = localStorage.getItem("uch-token");
        const storedUser = localStorage.getItem("uch-user");
        
        if (!storedToken || !storedUser) {
          logout();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(sessionInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, token, logout]);
};
