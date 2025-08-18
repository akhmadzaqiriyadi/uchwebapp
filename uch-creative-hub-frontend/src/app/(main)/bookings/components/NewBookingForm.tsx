// src/app/(main)/bookings/components/NewBookingForm.tsx
"use client";

import { useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Loader2,
  ArrowRight,
  User,
  Users,
  Clock,
  BookOpen,
  MapPin,
} from "lucide-react";

import {
  createNewBooking,
  NewBookingPayload,
  getAvailableSlots,
} from "@/_services/booking.service";
import { useAuth } from "@/_hooks/useAuth";

const bookingSchema = z
  .object({
    room: z.string().min(1, "Ruangan harus dipilih"),
    purpose: z.string().min(10, "Tujuan harus diisi minimal 10 karakter"),
    audience: z.number().min(1, "Jumlah peserta minimal 1"),
    // Cukup seperti ini untuk membuatnya wajib diisi
    date: z.date(),
    startTime: z.string().min(1, "Waktu mulai harus dipilih"),
    endTime: z.string().min(1, "Waktu selesai harus dipilih"),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: "Jam selesai harus setelah jam mulai",
      path: ["endTime"],
    }
  );

export function NewBookingForm() {
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      room: "",
      purpose: "",
      audience: 1,
      startTime: "",
      endTime: "",
    },
  });

  const selectedRoom = form.watch("room");
  const selectedDate = form.watch("date");
  const selectedStartTime = form.watch("startTime");

  useEffect(() => {
    form.resetField("endTime");
  }, [selectedStartTime, form]);

  const { data: availableSlotsData, isLoading: isLoadingSlots } = useQuery({
    queryKey: [
      "available-slots",
      selectedRoom,
      selectedDate ? format(selectedDate, "yyyy-MM-dd") : null,
    ],
    queryFn: () =>
      getAvailableSlots(format(selectedDate, "yyyy-MM-dd"), selectedRoom),
    enabled: !!selectedRoom && !!selectedDate,
    refetchOnWindowFocus: false,
  });

  // --- PERUBAHAN UTAMA 1: Konversi jam UTC ke WIB ---
  const WIB_OFFSET = 7;

  const timeSlots = useMemo(() => {
    if (!availableSlotsData?.data.availableIntervals) return [];
    const slots: string[] = [];
    availableSlotsData.data.availableIntervals.forEach((interval) => {
      for (let i = interval.start; i < interval.end; i++) {
        // Tambahkan offset untuk mendapatkan jam WIB
        const wibHour = i + WIB_OFFSET;
        slots.push(`${wibHour}:00`.padStart(5, "0"));
      }
    });
    return [...new Set(slots)].sort();
  }, [availableSlotsData]);

  const endTimeSlots = useMemo(() => {
    if (!selectedStartTime) return [];

    // Konversi jam mulai (WIB) yang dipilih kembali ke UTC untuk pencarian
    const startHourUTC = parseInt(selectedStartTime.split(":")[0]) - WIB_OFFSET;

    // Cari interval yang sesuai di data UTC dari API
    const intervalForStartTime = availableSlotsData?.data.availableIntervals.find(
      (interval) => startHourUTC >= interval.start && startHourUTC < interval.end
    );

    if (!intervalForStartTime) return [];

    // Dapatkan jam terakhir yang memungkinkan dalam UTC, lalu konversi ke WIB
    const endHourWIB = intervalForStartTime.end + WIB_OFFSET;
    const slots: string[] = [];

    // Buat daftar jam selesai dalam format WIB
    for (
      let i = parseInt(selectedStartTime.split(":")[0]) + 1;
      i <= endHourWIB;
      i++
    ) {
      slots.push(`${i}:00`.padStart(5, "0"));
    }
    return slots;
  }, [selectedStartTime, availableSlotsData]);

  const mutation = useMutation({
    mutationFn: createNewBooking,
    onSuccess: () => {
      toast.success("Booking berhasil diajukan! Menunggu persetujuan admin.");
      router.push("/bookings/history");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: z.infer<typeof bookingSchema>) => {
    const payload: NewBookingPayload = {
      ...values,
      date: format(values.date, "yyyy-MM-dd"),
      audience: values.audience,
    };
    mutation.mutate(payload);
  };

  const rooms = ["Think Tank Room", "Coworking Space", "Prototyping Room"];

  return (
    <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/95 backdrop-blur-sm max-w-none gap-0 py-0">
      <CardHeader className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-b border-blue-100/50 p-6 lg:p-8 gap-1.5">
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="w-14 h-14 lg:w-18 lg:h-18 rounded-2xl bg-gradient-to-br from-[#2E417A] via-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <BookOpen className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl lg:text-3xl text-slate-800 font-bold mb-2">
              Form Pengajuan Booking
            </CardTitle>
            <CardDescription className="text-sm lg:text-lg text-slate-600 leading-relaxed">
              Isi semua data dengan lengkap untuk mengajukan pemesanan ruangan
              UCH Creative Hub
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 lg:p-8 bg-gradient-to-b from-white to-slate-50/30">
        <div className="mb-8 lg:mb-10">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-600 rounded-xl shadow-sm">
                <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-800">
                Informasi Pemesan
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {[
                { label: "Nama", value: user?.name },
                { label: "Email", value: user?.email },
                { label: "NPM", value: user?.npm },
                { label: "Prodi", value: user?.prodi },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/80 rounded-xl p-4 lg:p-5 border border-slate-200/40 shadow-sm"
                >
                  <div className="text-xs lg:text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">
                    {item.label}
                  </div>
                  <div className="text-sm lg:text-base font-semibold text-slate-800 truncate">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 lg:space-y-10"
        >
          {/* Baris 1: Ruangan & Peserta */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-3">
              <Label className="text-sm lg:text-base font-bold text-slate-700 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                </div>
                Pilih Ruangan
              </Label>
              <Controller
                name="room"
                control={form.control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-12 py-6 lg:h-14 rounded-xl border-2">
                      <SelectValue placeholder="Pilih ruangan yang diinginkan" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room} value={room}>
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.room && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.room.message}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="audience"
                className="text-sm lg:text-base font-bold text-slate-700 flex items-center gap-3"
              >
                <div className="p-2 bg-rose-100 rounded-lg">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-rose-600" />
                </div>
                Jumlah Peserta
              </Label>
              <Input
                id="audience"
                type="number"
                {...form.register("audience", { valueAsNumber: true })}
                className="h-12 lg:h-14 rounded-xl border-2"
                placeholder="Masukkan jumlah peserta"
              />
              {form.formState.errors.audience && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.audience.message}
                </p>
              )}
            </div>
          </div>

          {/* Baris 2: Tanggal & Waktu */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-3">
              <Label className="text-sm lg:text-base font-bold text-slate-700 flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <CalendarIcon className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600" />
                </div>
                Tanggal Booking
              </Label>
              <Controller
                name="date"
                control={form.control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 lg:h-14 justify-start text-left font-medium rounded-xl border-2",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: id })
                        ) : (
                          <span>Pilih tanggal booking</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={{ before: new Date(), dayOfWeek: [0] }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {form.formState.errors.date && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Label className="text-sm lg:text-base font-bold text-slate-700 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                </div>
                Waktu Pelaksanaan
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-600">Mulai</Label>
                  <Controller
                    name="startTime"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={
                          !selectedRoom || !selectedDate || isLoadingSlots
                        }
                      >
                        <SelectTrigger className="h-12 py-6 mt-1 rounded-xl border-2">
                          <SelectValue
                            placeholder={isLoadingSlots ? "Memuat..." : "Jam"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={`start-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.startTime && (
                    <p className="text-xs text-red-500">Wajib diisi</p>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-slate-600">Selesai</Label>
                  <Controller
                    name="endTime"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedStartTime || isLoadingSlots}
                      >
                        <SelectTrigger className="h-12 py-6 mt-1 rounded-xl border-2">
                          <SelectValue
                            placeholder={isLoadingSlots ? "Memuat..." : "Jam"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {endTimeSlots.map((time) => (
                            <SelectItem key={`end-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.endTime && (
                    <p className="text-xs text-red-500 mt-1">
                      {form.formState.errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>
              {selectedRoom &&
                selectedDate &&
                !isLoadingSlots &&
                timeSlots.length === 0 && (
                  <p className="text-xs text-amber-600 text-center bg-amber-50 p-2 rounded-lg">
                    Tidak ada slot tersedia.
                  </p>
                )}
            </div>
          </div>

          {/* Baris 3: Tujuan Kegiatan */}
          <div className="space-y-3">
            <Label
              htmlFor="purpose"
              className="text-sm lg:text-base font-bold text-slate-700 flex items-center gap-3"
            >
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
              </div>
              Tujuan & Deskripsi Kegiatan
            </Label>
            <Textarea
              id="purpose"
              {...form.register("purpose")}
              placeholder="Contoh: Diskusi tugas akhir, rapat himpunan..."
              className="min-h-[150px] rounded-xl border-2"
            />
            {form.formState.errors.purpose && (
              <p className="text-xs text-red-500">
                {form.formState.errors.purpose.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-14 bg-gradient-to-r from-[#2E417A] to-blue-700 text-white rounded-xl font-bold text-base group"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  Ajukan Booking Sekarang{" "}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}