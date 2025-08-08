// src/app/(auth)/login/components/LoginForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight, LogIn, Mail, Lock } from "lucide-react";

import api from "@/_lib/api";
import { useAuth } from "@/_hooks/useAuth";
import { User } from "@/_contexts/AuthContext"; // Impor tipe User

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(1, { message: "Password tidak boleh kosong." }),
});

type LoginData = z.infer<typeof loginSchema>;

// Definisikan tipe data respons agar menyertakan objek user
interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation<LoginResponse, Error, LoginData>({
    mutationFn: async (data) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Login Berhasil!");
      // Kirim token dan objek user ke fungsi login
      login(data.token, data.user);
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan pada server.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: LoginData) => {
    mutation.mutate(data);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8 mt-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#2E417A] to-blue-700 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h1 className="md:text-3xl text-2xl font-bold text-gray-900 mb-2">Selamat Datang!</h1>
        <p className="md:text-lg text-base text-gray-600">
          Silakan masuk ke akun UCH Creative Hub Anda
        </p>
      </div>

      {/* Login Card */}
      <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                  <Mail className="w-3 h-3 text-[#2E417A]" />
                </div>
                Email Address
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                {...register("email")}
                className="h-12 rounded-xl border-gray-200 focus:border-[#2E417A] focus:ring-[#2E417A] transition-colors"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center">
                <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                  <Lock className="w-3 h-3 text-[#2E417A]" />
                </div>
                Password
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Masukkan password Anda"
                {...register("password")}
                className="h-12 rounded-xl border-gray-200 focus:border-[#2E417A] focus:ring-[#2E417A] transition-colors"
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-[#2E417A] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Footer Text */}
      <div className="text-center mt-8">
        <p className="text-gray-600">
          Belum punya akun?{" "}
          <a href="/register" className="text-[#2E417A] hover:text-blue-700 font-semibold transition-colors">
            Daftar sekarang
          </a>
        </p>
      </div>
    </div>
  );
}