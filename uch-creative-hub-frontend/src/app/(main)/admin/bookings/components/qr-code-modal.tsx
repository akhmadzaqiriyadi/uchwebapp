// src/app/(main)/admin/bookings/components/qr--code-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// 1. Ubah cara impor
import { QRCodeSVG } from "qrcode.react";
import { QrCode, User, MapPin } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrToken: string | null;
  bookingDetails: {
    userName: string;
    room: string;
  };
}

export function QRCodeModal({
  isOpen,
  onClose,
  qrToken,
  bookingDetails,
}: QRCodeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-xl border-0 shadow-2xl">
        <DialogHeader className="text-center space-y-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-slate-800 mb-2">
              QR Code Check-in
            </DialogTitle>
            <DialogDescription className="text-slate-600 leading-relaxed">
              Pindai QR Code ini untuk melakukan check-in pada booking yang telah disetujui
            </DialogDescription>
          </div>
        </DialogHeader>
        
        {/* Booking Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Nama Pengguna</p>
              <p className="font-semibold text-slate-800">{bookingDetails.userName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Ruangan</p>
              <p className="font-semibold text-slate-800">{bookingDetails.room}</p>
            </div>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="flex justify-center items-center p-6 bg-white rounded-xl border-2 border-dashed border-slate-200">
          {qrToken ? (
            <div className="text-center">
              {/* 2. Ganti nama komponen menjadi QRCodeSVG */}
              <QRCodeSVG
                value={qrToken}
                size={200}
                level={"H"}
                includeMargin={true}
                className="mx-auto rounded-lg"
              />
              <p className="text-xs text-slate-500 mt-3">
                Tunjukkan QR Code ini kepada pengguna untuk scan check-in
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mx-auto mb-3">
                <QrCode className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-slate-800 font-medium">Gagal memuat QR Code</p>
              <p className="text-sm text-slate-500">Silakan coba lagi</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}