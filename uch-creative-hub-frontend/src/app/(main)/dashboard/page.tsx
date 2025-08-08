// src/app/(main)/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/_hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// 1. Impor ikon baru
import { LogOut, PlusCircle, History, UserCog, QrCode, ArrowRight, User, Mail, BookOpen, GraduationCap, Shield } from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Sambutan dengan Design Modern */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl bg-gradient-to-r from-[#2E417A] to-blue-700 flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg">
            <User className="w-6 h-6 lg:w-10 lg:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4">
            {getGreeting()}, {user?.name}! 👋🏻
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Selamat datang kembali di UCH Creative Hub. Kelola booking ruangan dan aktivitas Anda dengan mudah.
          </p>
        </div>

        {/* Quick Actions dengan Design Cards Modern */}
        <div className="mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 lg:mb-8 text-center">Aksi Cepat</h2>
          
          {/* Mobile: Stack vertically, Desktop: Horizontal */}
          <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
            {/* Buat Booking */}
            <Link href="/bookings" className="group block">
              <div className="flex items-center lg:block lg:text-center bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 lg:hover:-translate-y-2 p-4 lg:p-8 rounded-xl lg:rounded-2xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg lg:rounded-xl bg-gradient-to-r from-[#2E417A] to-blue-700 flex items-center justify-center lg:mx-auto mb-0 lg:mb-6 shadow-lg group-hover:scale-105 lg:group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <PlusCircle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="ml-4 lg:ml-0 flex-1">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-3">Buat Booking</h3>
                  <p className="text-sm lg:text-base text-gray-600 mb-0 lg:mb-6">Pesan ruangan sesuai kebutuhan aktivitas Anda</p>
                  <div className="hidden lg:flex items-center justify-center text-[#2E417A] font-semibold group-hover:text-blue-700 transition-colors">
                    Mulai Booking
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 lg:hidden text-[#2E417A] group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
              </div>
            </Link>

            {/* Riwayat Booking */}
            <Link href="/bookings/history" className="group block">
              <div className="flex items-center lg:block lg:text-center bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 lg:hover:-translate-y-2 p-4 lg:p-8 rounded-xl lg:rounded-2xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg lg:rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center lg:mx-auto mb-0 lg:mb-6 shadow-lg group-hover:scale-105 lg:group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <History className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="ml-4 lg:ml-0 flex-1">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-3">Riwayat Booking</h3>
                  <p className="text-sm lg:text-base text-gray-600 mb-0 lg:mb-6">Lihat semua booking yang pernah Anda buat</p>
                  <div className="hidden lg:flex items-center justify-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                    Lihat Riwayat
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 lg:hidden text-green-600 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
              </div>
            </Link>

            {/* Check-in */}
            <Link href="/check-in" className="group block">
              <div className="flex items-center lg:block lg:text-center bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 lg:hover:-translate-y-2 p-4 lg:p-8 rounded-xl lg:rounded-2xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg lg:rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center lg:mx-auto mb-0 lg:mb-6 shadow-lg group-hover:scale-105 lg:group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <QrCode className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="ml-4 lg:ml-0 flex-1">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-1 lg:mb-3">Scan Check-in</h3>
                  <p className="text-sm lg:text-base text-gray-600 mb-0 lg:mb-6">Lakukan check-in dengan memindai QR code</p>
                  <div className="hidden lg:flex items-center justify-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                    Mulai Scan
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 lg:hidden text-purple-600 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
              </div>
            </Link>
          </div>
        </div>
        
      {/* Informasi Pengguna dan Admin dengan Design Modern */}
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Informasi Akun */}
        <div className="lg:col-span-2">
          <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-blue-100 p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-blue-100 flex items-center justify-center mr-3 lg:mr-4">
                  <User className="w-5 h-5 lg:w-6 lg:h-6 text-[#2E417A]" />
                </div>
                <div>
                  <CardTitle className="text-lg lg:text-2xl text-gray-900">Informasi Akun Anda</CardTitle>
                  <CardDescription className="text-sm lg:text-base text-gray-600">
                    Detail akun yang terdaftar di sistem UCH Creative Hub
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-8">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center p-3 lg:p-4 rounded-lg lg:rounded-xl bg-gray-50">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-md lg:rounded-lg bg-blue-100 flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                    <User className="w-4 h-4 lg:w-5 lg:h-5 text-[#2E417A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs lg:text-sm font-medium text-gray-500">Nama Lengkap</span>
                    <div className="text-base lg:text-lg font-semibold text-gray-900 truncate">{user?.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 lg:p-4 rounded-lg lg:rounded-xl bg-gray-50">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-md lg:rounded-lg bg-green-100 flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                    <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs lg:text-sm font-medium text-gray-500">Email Address</span>
                    <div className="text-base lg:text-lg font-semibold text-gray-900 truncate">{user?.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 lg:p-4 rounded-lg lg:rounded-xl bg-gray-50">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-md lg:rounded-lg bg-purple-100 flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                    <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs lg:text-sm font-medium text-gray-500">NPM</span>
                    <div className="text-base lg:text-lg font-semibold text-gray-900 truncate">{user?.npm}</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 lg:p-4 rounded-lg lg:rounded-xl bg-gray-50">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-md lg:rounded-lg bg-orange-100 flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                    <GraduationCap className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs lg:text-sm font-medium text-gray-500">Program Studi</span>
                    <div className="text-base lg:text-lg font-semibold text-gray-900 truncate">{user?.prodi}</div>
                  </div>
                </div> 
                
                <div className="flex items-center p-3 lg:p-4 rounded-lg lg:rounded-xl bg-gray-50">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-md lg:rounded-lg bg-red-100 flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                    <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs lg:text-sm font-medium text-gray-500">Status Pengguna</span>
                    <div className="mt-1">
                      <Badge 
                        variant={user?.role === "ADMIN" ? "destructive" : "secondary"}
                        className="text-xs lg:text-sm px-2 lg:px-3 py-1"
                      >
                        {user?.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4 lg:space-y-6">
          {/* Panel Admin */}
          {user?.role === "ADMIN" && (
            <Card className="shadow-lg rounded-xl lg:rounded-2xl overflow-hidden bg-gradient-to-br from-red-50 to-pink-50 border border-red-100">
              <CardHeader className="p-4 lg:p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-red-100 flex items-center justify-center mr-3 lg:mr-4">
                    <UserCog className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg lg:text-xl text-gray-900">Panel Admin</CardTitle>
                    <CardDescription className="text-sm lg:text-base text-gray-600">
                      Kelola sistem booking
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <p className="text-xs lg:text-sm text-gray-600 mb-4 lg:mb-6">
                  Akses halaman manajemen untuk mengelola data booking dan pengguna sistem.
                </p>
                <Link href="/admin/bookings">
                  <Button className="w-full h-10 lg:h-12 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg lg:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group text-sm lg:text-base">
                    <UserCog className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                    Buka Panel Admin
                    <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Logout Button */}
          <Card className="shadow-lg rounded-xl lg:rounded-2xl overflow-hidden bg-gradient-to-br from-red-50 to-rose-50 border border-red-200">
            <CardContent className="p-4 lg:p-6">
              <div className="text-center mb-3 lg:mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-2 lg:mb-3">
                  <LogOut className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
                </div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-1 lg:mb-2">Keluar dari Akun</h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Akhiri sesi dan kembali ke halaman login
                </p>
              </div>
              <Button 
                onClick={logout} 
                variant="destructive" 
                className="w-full h-10 lg:h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg lg:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm lg:text-base"
              >
                <LogOut className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
