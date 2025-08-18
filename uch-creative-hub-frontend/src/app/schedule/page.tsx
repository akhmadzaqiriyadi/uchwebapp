// src/app/schedule/page.tsx - Mobile Responsive Version
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { getPublicSchedule, ScheduleItem } from "@/_services/booking.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  Calendar as CalendarIcon,
  ServerCrash,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  ArrowRight,
  Building,
} from "lucide-react";
import Link from "next/link";

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const {
    data: bookings,
    isLoading,
    isError,
    error,
  } = useQuery<ScheduleItem[]>({
    queryKey: ["public-schedule", formattedDate],
    queryFn: () => getPublicSchedule(formattedDate),
    refetchOnWindowFocus: false,
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = addDays(currentWeek, direction === "prev" ? -7 : 7);
    setCurrentWeek(newWeek);
    setSelectedDate(newWeek);
  };

  const rooms = ["Think Tank Room", "Coworking Space", "Prototyping Room"];

  const formatAsLocalTime = (dateString: string) => {
    const date = new Date(dateString);
    // FIX: Menggunakan getHours() dan getMinutes() untuk waktu lokal
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center md:pt-16 pt-24 mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl lg:rounded-xl bg-gradient-to-br from-[#2E417A] via-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-6 shadow-lg shadow-blue-500/25">
            <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-15 lg:w-16 lg:h-11 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-800 mb-3 sm:mb-4 lg:mb-4 px-2">
            Jadwal Publik UCH
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto px-4 leading-relaxed">
            Lihat jadwal penggunaan ruangan yang telah disetujui untuk
            merencanakan aktivitas Anda.
          </p>
        </div>

        {/* Week Navigation */}
        <Card className="shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl lg:rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm border-0 gap-0 py-0 mb-8 sm:mb-8 lg:mb-12">
          <CardHeader className="p-3 sm:p-4 lg:p-8 border-b border-slate-200/60">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <Button
                onClick={() => navigateWeek("prev")}
                variant="outline"
                className="rounded-lg h-9 w-9 p-0 sm:h-10 sm:w-10 lg:h-10 lg:w-auto lg:px-4 lg:gap-2 flex-shrink-0"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden lg:inline">Minggu Lalu</span>
              </Button>
              <h2 className="text-sm sm:text-base lg:text-2xl font-bold text-slate-800 text-center flex-1 px-2">
                {format(currentWeek, "d MMM", { locale: id })} -{" "}
                {format(addDays(currentWeek, 6), "d MMM yyyy", { locale: id })}
              </h2>
              <Button
                onClick={() => navigateWeek("next")}
                variant="outline"
                className="rounded-lg h-9 w-9 p-0 sm:h-10 sm:w-10 lg:h-10 lg:w-auto lg:px-4 lg:gap-2 flex-shrink-0"
              >
                <span className="hidden lg:inline">Minggu Depan</span>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-2 sm:p-3 lg:p-8">
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {weekDays.map((day) => (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`py-2 px-1 sm:py-3 sm:px-2 rounded-lg lg:rounded-xl transition-all duration-200 text-center ${
                    isSameDay(day, selectedDate)
                      ? "bg-gradient-to-r from-[#2E417A] to-blue-700 text-white shadow-lg transform scale-105"
                      : "bg-white hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <p className="text-xs sm:text-sm font-medium truncate">
                    {format(day, "EEE", { locale: id })}
                  </p>
                  <p className="text-base sm:text-lg lg:text-2xl font-bold">
                    {format(day, "d")}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Display */}
        <div>
          {isLoading && (
            <div className="text-center p-8 sm:p-12 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-spin" />
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Memuat jadwal...
              </p>
            </div>
          )}

          {isError && (
            <Alert
              variant="destructive"
              className="max-w-2xl mx-auto rounded-xl"
            >
              <ServerCrash className="h-4 w-4" />
              <AlertTitle className="text-sm sm:text-base">
                Gagal Memuat Data
              </AlertTitle>
              <AlertDescription className="text-sm">
                {error.message}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {rooms.map((room) => {
                const roomBookings =
                  bookings?.filter((b) => b.room === room) ?? [];
                return (
                  <Card
                    key={room}
                    className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] rounded-xl sm:rounded-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm gap-0 py-0"
                  >
                    <CardHeader className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 sm:p-5 lg:p-6 border-b border-slate-200/50 gap-1.5">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                          <Building className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg lg:text-2xl font-bold text-slate-800 truncate">
                            {room}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-5 lg:p-6">
                      {roomBookings.length > 0 ? (
                        <ul className="space-y-3 sm:space-y-4">
                          {roomBookings
                            .sort(
                              (a, b) =>
                                new Date(a.startTime).getTime() -
                                new Date(b.startTime).getTime()
                            )
                            .map((booking, index) => (
                              <li
                                key={index}
                                className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/20 border border-slate-200/70"
                              >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-2">
                                  <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-700">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span>
                                      {formatAsLocalTime(booking.startTime)} -{" "}
                                      {formatAsLocalTime(booking.endTime)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                                  <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span className="truncate">
                                    Dipesan oleh {booking.user.name}
                                  </span>
                                </div>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <div className="text-center py-6 sm:py-8">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                          </div>
                          <p className="text-sm sm:text-base text-slate-500 font-medium">
                            Tidak ada jadwal
                          </p>
                          <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            untuk ruangan ini
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-10 sm:mt-12 lg:mt-12 pt-6 sm:pt-8 border-t border-slate-200/80">
          <p className="text-sm sm:text-base lg:text-xl text-slate-600 mb-3 sm:mb-4 lg:mb-8 px-4">
            Ingin mengajukan pemesanan ruangan?
          </p>
          <Button
            asChild
            size="lg"
            className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base bg-gradient-to-r from-[#2E417A] to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:scale-105"
          >
            <Link href="/login">
              Login untuk Booking
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
