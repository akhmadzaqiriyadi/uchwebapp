// src/app/(main)/admin/bookings/components/data-table-row-actions.tsx
"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MoreHorizontal, CheckCircle, XCircle, QrCode, Settings, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Booking, updateBookingStatus, generateQRCodeForBooking } from "@/_services/booking.service";
import { PDFService } from "@/_services/pdf.service";
import { QRCodeModal } from "./qr-code-modal";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const booking = row.original as Booking;
  const queryClient = useQueryClient();

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrToken, setQrToken] = useState<string | null>(null);

  // Mutation untuk Approve/Reject
  const updateStatusMutation = useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-bookings"] });
      toast.success(`Booking berhasil di-${data.status.toLowerCase()}`);
    },
    onError: (error) => toast.error(error.message),
  });

  // Mutation untuk Generate QR
  const generateQrMutation = useMutation({
    mutationFn: generateQRCodeForBooking,
    onSuccess: (token) => {
      setQrToken(token);
      setIsQrModalOpen(true);
      toast.success("QR Code berhasil dibuat!");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleUpdateStatus = (status: 'Approved' | 'Rejected') => {
    updateStatusMutation.mutate({ bookingId: booking.id, status });
  };

  const handleGenerateQr = () => {
    generateQrMutation.mutate(booking.id);
  };

  const handleDownloadPDF = () => {
    try {
      PDFService.generateSingleBookingPDF(booking);
      toast.success("PDF booking berhasil diunduh!");
    } catch (error) {
      toast.error("Gagal membuat PDF");
      console.error("PDF generation error:", error);
    }
  };

  // Render Aksi untuk status "Pending"
  if (booking.status === "Pending") {
    return (
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100">
              <span className="sr-only">Buka menu</span>
              <Settings className="h-4 w-4 text-slate-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-slate-200 w-48">
            <DropdownMenuItem 
              onClick={() => handleUpdateStatus("Approved")}
              className="rounded-lg cursor-pointer hover:bg-green-50 focus:bg-green-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-green-700 font-medium">Setujui</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200" />
            <DropdownMenuItem 
              onClick={handleDownloadPDF}
              className="rounded-lg cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center">
                  <Download className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-purple-700 font-medium">Download PDF</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200" />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="text-red-700 font-medium">Tolak</span>
                </div>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent className="rounded-xl border-0 shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg font-bold text-slate-800">Konfirmasi Penolakan</AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="text-slate-600 leading-relaxed">
              Anda akan menolak permintaan booking untuk ruangan{" "}
              <span className="font-semibold text-slate-800">{booking.room}</span> oleh{" "}
              <span className="font-semibold text-slate-800">{booking.user.name}</span>. 
              <br /><br />
              Tindakan ini tidak dapat dibatalkan dan pengguna akan menerima notifikasi penolakan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl border-slate-200 hover:bg-slate-50">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg"
              onClick={() => handleUpdateStatus("Rejected")}
            >
              Ya, Tolak Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Render Aksi untuk status "Approved"
  if (booking.status === "Approved") {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100">
              <span className="sr-only">Buka menu</span>
              <Settings className="h-4 w-4 text-slate-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-slate-200 w-48">
            <DropdownMenuItem 
              onClick={handleGenerateQr} 
              disabled={generateQrMutation.isPending}
              className="rounded-lg cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                  <QrCode className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-blue-700 font-medium">
                  {generateQrMutation.isPending ? "Memproses..." : "Generate QR Code"}
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200" />
            <DropdownMenuItem 
              onClick={handleDownloadPDF}
              className="rounded-lg cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center">
                  <Download className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-purple-700 font-medium">Download PDF</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <QRCodeModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          qrToken={qrToken}
          bookingDetails={{ userName: booking.user.name, room: booking.room }}
        />
      </>
    );
  }

  // Jika status bukan "Pending" atau "Approved", tampilkan disabled button
  return (
    <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg opacity-50 cursor-not-allowed" disabled>
      <Settings className="h-4 w-4 text-slate-400" />
    </Button>
  );
}