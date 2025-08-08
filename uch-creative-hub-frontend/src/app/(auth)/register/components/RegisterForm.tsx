// src/app/(auth)/register/components/RegisterForm.tsx
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
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowRight, UserPlus, Mail, Lock, User, GraduationCap, Hash } from "lucide-react";

import api from "@/_lib/api";

const programStudiUTY = [
  "-",
  "D3 Akuntansi",
  "D3 Sistem Informasi",
  "D4 Destinasi Pariwisata",
  "S1 Akuntansi",
  "S1 Arsitektur",
  "S1 Bimbingan dan Konseling",
  "S1 Ilmu Hubungan Internasional",
  "S1 Ilmu Komunikasi",
  "S1 Informatika",
  "S1 Informatika Medis",
  "S1 Manajemen",
  "S1 Pendidikan Bahasa Inggris",
  "S1 Pendidikan Teknologi Informasi",
  "S1 Perencanaan Wilayah dan Kota",
  "S1 Psikologi",
  "S1 Sains Data",
  "S1 Sastra Inggris",
  "S1 Sistem Informasi",
  "S1 Teknik Elektro",
  "S1 Teknik Industri",
  "S1 Teknik Komputer",
  "S1 Teknik Sipil",
  "S2 Manajemen",
  "S2 Teknologi Informasi",
  "S3 Ilmu Manajemen"
];

const registerSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter." }),
  npm: z.string().min(8, { message: "NPM minimal 8 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  prodi: z.string().min(1, { message: "Program studi harus dipilih." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
  confirmPassword: z.string().min(1, { message: "Konfirmasi password tidak boleh kosong." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak cocok.",
  path: ["confirmPassword"],
});

type RegisterData = z.infer<typeof registerSchema>;

interface RegisterResponse {
  success: boolean;
  message: string;
  userId: number;
}

export function RegisterForm() {
  const router = useRouter();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation<RegisterResponse, Error, Omit<RegisterData, 'confirmPassword'>>({
    mutationFn: async (data) => {
      const response = await api.post("/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Registrasi Berhasil! Silakan login dengan akun Anda.");
      router.push("/login");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan pada server.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: RegisterData) => {
    const { confirmPassword, ...registerData } = data;
    mutation.mutate(registerData);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8 mt-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#2E417A] to-blue-700 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="md:text-3xl text-2xl font-bold text-gray-900 mb-2">Daftar Akun Baru</h1>
        <p className="md:text-lg text-base text-gray-600">
          Bergabunglah dengan UCH Creative Hub sekarang
        </p>
      </div>

      {/* Register Card */}
      <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center">
                <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                  <User className="w-3 h-3 text-[#2E417A]" />
                </div>
                Nama Lengkap
              </Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Masukkan nama lengkap Anda" 
                {...register("name")}
                className="h-12 rounded-xl border-gray-200 focus:border-[#2E417A] focus:ring-[#2E417A] transition-colors"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="npm" className="text-sm font-semibold text-gray-700 flex items-center">
                <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                  <Hash className="w-3 h-3 text-[#2E417A]" />
                </div>
                NPM/NIK/NIDN
              </Label>
              <Input 
                id="npm" 
                type="text" 
                placeholder="Masukkan NPM Anda" 
                {...register("npm")}
                className="h-12 rounded-xl border-gray-200 focus:border-[#2E417A] focus:ring-[#2E417A] transition-colors"
              />
              {errors.npm && <p className="text-sm text-red-500 mt-1">{errors.npm.message}</p>}
            </div>
            
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
              <Label htmlFor="prodi" className="text-sm font-semibold text-gray-700 flex items-center">
                <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                  <GraduationCap className="w-3 h-3 text-[#2E417A]" />
                </div>
                Program Studi
              </Label>
              <Select onValueChange={(value) => setValue("prodi", value)}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-[#2E417A] focus:ring-[#2E417A] transition-colors">
                  <SelectValue placeholder="Pilih program studi Anda" />
                </SelectTrigger>
                <SelectContent>
                  {programStudiUTY.map((prodi) => (
                    <SelectItem key={prodi} value={prodi}>
                      {prodi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.prodi && <p className="text-sm text-red-500 mt-1">{errors.prodi.message}</p>}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center">
                <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                  <Lock className="w-3 h-3 text-[#2E417A]" />
                </div>
                Konfirmasi Password
              </Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Ulangi password Anda"
                {...register("confirmPassword")}
                className="h-12 rounded-xl border-gray-200 focus:border-[#2E417A] focus:ring-[#2E417A] transition-colors"
              />
              {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
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
                  Daftar Sekarang
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Footer Text */}
      <div className="text-center mt-8 mb-12">
        <p className="text-gray-600">
          Sudah punya akun?{" "}
          <a href="/login" className="text-[#2E417A] hover:text-blue-700 font-semibold transition-colors">
            Masuk sekarang
          </a>
        </p>
      </div>
    </div>
  );
}
