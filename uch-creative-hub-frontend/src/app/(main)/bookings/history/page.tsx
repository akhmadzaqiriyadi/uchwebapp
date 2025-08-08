// src/app/(main)/bookings/history/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyBookingHistory } from "@/_services/booking.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Clock, Tag, ServerCrash, History, Users, MapPin, CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

export default function BookingHistoryPage() {
  const { data: history, isLoading, isError, error } = useQuery({
    queryKey: ["my-booking-history"],
    queryFn: getMyBookingHistory,
  });

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Approved":
        return "secondary";
      case "Checked-in":
        return "default";
      case "Rejected":
        return "destructive";
      case "Pending":
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />;
      case "Checked-in":
        return <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />;
      case "Rejected":
        return <XCircle className="w-3 h-3 lg:w-4 lg:h-4 text-red-600" />;
      case "Pending":
      default:
        return <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4 text-orange-600" />;
    }
  };

  // Tampilan saat loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex flex-col items-center justify-center text-center gap-6 h-96">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-[#2E417A] via-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Loader2 className="h-8 w-8 lg:h-10 lg:w-10 animate-spin text-white" />
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-2">Memuat Data</h3>
              <p className="text-sm lg:text-base text-slate-600">Mengambil riwayat booking Anda...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan saat error
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex flex-col items-center justify-center text-center gap-6 h-96">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/25">
              <ServerCrash className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-2">Oops! Terjadi Kesalahan</h3>
              <p className="text-sm lg:text-base text-slate-600">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline" className="flex items-center gap-3 rounded-xl border-2 border-slate-200 hover:bg-slate-50 hover:border-blue-300 transition-all duration-300">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Dashboard</span>
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-[#2E417A] via-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-lg shadow-blue-500/25">
            <History className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 lg:mb-6">Riwayat Booking Anda</h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4">
            Berikut adalah daftar semua pemesanan ruangan yang pernah Anda ajukan di UCH Creative Hub
          </p>
        </div>

        {history && history.length > 0 ? (
          <div className="grid gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((booking) => (
              <Card key={booking.id} className="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] rounded-2xl lg:rounded-3xl overflow-hidden bg-white/95 backdrop-blur-sm border-0 gap-0 py-0">
                <CardHeader className="bg-gradient-to-br from-slate-50 to-blue-50/40 border-b border-slate-200/60 p-5 lg:p-7 gap-3">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center flex-1 min-w-0 gap-3">
                      <div className="p-2 lg:p-3 bg-blue-600 rounded-xl shadow-sm">
                        <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg lg:text-xl font-bold text-slate-800 truncate mb-1">{booking.room}</CardTitle>
                        <CardDescription className="text-xs lg:text-sm text-slate-500 truncate">
                          ID: {booking.id}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <Badge variant={getStatusVariant(booking.status)} className="text-xs lg:text-sm font-medium">
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-5 lg:p-7">
                  <div className="space-y-4 lg:space-y-5">
                    <div className="bg-gradient-to-r from-slate-50 to-green-50/30 rounded-xl p-4 lg:p-5 border border-slate-200/40">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1">Tanggal</span>
                          <span className="text-sm lg:text-base font-semibold text-slate-800 truncate block">
                            {format(new Date(booking.bookingDate), "eeee, dd MMMM yyyy", { locale: id })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-slate-50 to-purple-50/30 rounded-xl p-4 lg:p-5 border border-slate-200/40">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1">Waktu</span>
                          <span className="text-sm lg:text-base font-semibold text-slate-800 truncate block">
                            {format(new Date(booking.startTime), "HH:mm")} - {format(new Date(booking.endTime), "HH:mm")} WIB
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 lg:py-24">
            <Card className="max-w-md lg:max-w-lg mx-auto shadow-xl rounded-2xl lg:rounded-3xl border-2 border-dashed border-slate-300 bg-white/80 backdrop-blur-sm gap-0 py-0">
              <CardContent className="p-10 lg:p-14">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6 lg:mb-8">
                  <Tag className="w-8 h-8 lg:w-10 lg:h-10 text-slate-400" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-3 lg:mb-4">Belum Ada Booking</h3>
                <p className="text-sm lg:text-base text-slate-600 mb-6 lg:mb-8 leading-relaxed">
                  Anda belum pernah melakukan pemesanan ruangan di UCH Creative Hub.
                </p>
                <Link href="/bookings">
                  <Button className="inline-flex items-center gap-3 px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-[#2E417A] via-blue-600 to-blue-700 text-white rounded-xl lg:rounded-2xl font-bold hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-600/30 text-sm lg:text-base transform hover:scale-105">
                    Buat Booking Pertama
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}