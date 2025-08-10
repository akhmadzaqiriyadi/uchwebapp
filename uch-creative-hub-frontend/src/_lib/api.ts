// src/_lib/api.ts
import axios from "axios";

const api = axios.create({
  // URL utama dari backend Anda.
  // Kita akan menggunakan environment variable untuk ini.
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Interceptor ini berjalan SEBELUM setiap request dikirim.
 * Tujuannya adalah untuk mengambil token dari localStorage
 * dan menyisipkannya ke dalam header 'Authorization'.
 */
api.interceptors.request.use(
  (config) => {
    // Cek apakah kode berjalan di sisi client (browser)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("uch-token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API instance untuk request public (tanpa authentication)
const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

export default api;
export { publicApi };