// src/app/(main)/admin/bookings/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/_hooks/useAuth";
import { getAllBookings } from "@/_services/booking.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Loader2, Shield, ServerCrash, Database } from "lucide-react";

export default function AdminBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Lindungi halaman ini: jika pengguna bukan ADMIN, tendang ke dashboard
  if (user?.role !== "ADMIN") {
    router.replace("/dashboard");
    return null; // Kembalikan null agar tidak merender apapun
  }

  // Gunakan useQuery untuk mengambil data, caching, dan state management
  const { data: bookings, isLoading, isError, error } = useQuery({
    queryKey: ['admin-all-bookings'], // Kunci unik untuk query ini
    queryFn: getAllBookings // Fungsi yang akan dijalankan untuk mengambil data
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center p-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-base text-slate-600 font-medium">Memuat data booking...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive" className="rounded-xl">
              <ServerCrash className="h-4 w-4" />
              <AlertTitle className="text-base">Gagal Memuat Data</AlertTitle>
              <AlertDescription className="text-sm">{error.message}</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl bg-gradient-to-r from-[#2E417A] to-blue-700 flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg shadow-blue-500/25">
            <Shield className="w-6 h-6 lg:w-10 lg:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3 lg:mb-4">
            Panel Admin UCH
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4 leading-relaxed">
            Kelola semua booking ruangan, approval, dan monitoring sistem dengan mudah
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-0">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200">
                <Database className="w-6 h-6 text-blue-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Booking</p>
                <p className="text-2xl font-bold text-slate-800">{bookings?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-0">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-100 to-green-200">
                <Database className="w-6 h-6 text-green-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Disetujui</p>
                <p className="text-2xl font-bold text-slate-800">
                  {bookings?.filter(b => b.status === 'Approved').length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-0">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-100 to-yellow-200">
                <Database className="w-6 h-6 text-yellow-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-800">
                  {bookings?.filter(b => b.status === 'Pending').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl border-0 overflow-hidden">
          {bookings && <DataTable columns={columns} data={bookings} />}
        </div>
      </div>
    </div>
  )
}