// src/app/(main)/check-in/components/QrScanner.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { processCheckin } from "@/_services/checkin.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, CameraOff, Camera, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export function QrScanner() {
  const router = useRouter();
  const scannerRegionRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Mutation untuk memproses check-in
  const mutation = useMutation({
    mutationFn: processCheckin,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/dashboard"); // Redirect ke dashboard setelah sukses
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      // Hentikan scanner setelah selesai (baik sukses maupun gagal)
      stopScanner();
    }
  });

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setCameraPermission(result.state);
      
      result.onchange = () => {
        setCameraPermission(result.state);
      };
    } catch (error) {
      console.warn('Cannot check camera permission:', error);
    }
  };

  const startScanner = () => {
    if (!scannerRegionRef.current) return;

    const html5QrCode = new Html5Qrcode(scannerRegionRef.current.id);
    const qrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
      // Fungsi ini terpanggil saat QR code berhasil terdeteksi
      mutation.mutate({ token: decodedText });
    };

    const config = { 
      fps: 10, 
      qrbox: { width: 280, height: 280 },
      aspectRatio: 1.0,
    };

    html5QrCode.start(
      { facingMode: "environment" }, // Gunakan kamera belakang
      config,
      qrCodeSuccessCallback,
      undefined // qrCodeErrorCallback, bisa dikosongkan
    ).then(() => {
      setIsScanning(true);
      setCameraPermission('granted');
    }).catch(err => {
      console.error("Camera start error:", err);
      setCameraPermission('denied');
      toast.error("Gagal memulai kamera. Pastikan Anda memberikan izin akses kamera.");
    });
  };

  const stopScanner = async () => {
    if (scannerRegionRef.current) {
      try {
        const scanner = new Html5Qrcode(scannerRegionRef.current.id);
        if (scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
          await scanner.stop();
        }
      } catch (error) {
        console.error("Gagal menghentikan scanner:", error);
      }
    }
    setIsScanning(false);
  };

  // Cleanup effect untuk memastikan scanner berhenti saat komponen di-unmount
  useEffect(() => {
    checkCameraPermission();
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/95 backdrop-blur-sm gap-0 py-0">
      <CardHeader className="bg-gradient-to-br from-slate-50 to-blue-50/40 border-b border-blue-100/50 p-6 lg:p-8 gap-1.5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm">
            <Camera className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl lg:text-2xl text-slate-800 font-bold mb-1">
              QR Code Scanner
            </CardTitle>
            <CardDescription className="text-sm lg:text-base text-slate-600">
              Posisikan QR Code di dalam frame untuk scan
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 lg:p-8 bg-gradient-to-b from-white to-slate-50/30">
        {/* Scanner Area */}
        <div className="mb-6">
          <div className="relative bg-slate-100 rounded-2xl p-4 border-2 border-dashed border-slate-300 min-h-[320px] flex items-center justify-center">
            <div 
              id="qr-reader" 
              ref={scannerRegionRef} 
              className="w-full max-w-sm"
              style={{ 
                border: 'none',
                borderRadius: '1rem'
              }}
            ></div>
            
            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center mb-4">
                  <QrCode className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium mb-2">Kamera belum aktif</p>
                <p className="text-sm text-slate-400">Tekan tombol di bawah untuk memulai</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        {cameraPermission === 'denied' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-800">Akses Kamera Ditolak</p>
                <p className="text-xs text-red-600">Silakan izinkan akses kamera di pengaturan browser</p>
              </div>
            </div>
          </div>
        )}

        {mutation.isPending && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <div>
                <p className="text-sm font-medium text-blue-800">Memproses Check-in</p>
                <p className="text-xs text-blue-600">Sedang memverifikasi QR Code...</p>
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="space-y-3">
          {!isScanning ? (
            <Button 
              onClick={startScanner} 
              disabled={cameraPermission === 'denied' || mutation.isPending}
              className="w-full h-12 lg:h-14 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-300 group text-base lg:text-lg transform hover:scale-[1.02]"
            >
              <Camera className="mr-3 h-5 w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform duration-300" />
              Mulai Pindai QR Code
            </Button>
          ) : (
            <Button 
              onClick={stopScanner} 
              variant="destructive" 
              disabled={mutation.isPending}
              className="w-full h-12 lg:h-14 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white rounded-xl font-bold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-600/30 transition-all duration-300 group text-base lg:text-lg transform hover:scale-[1.02]"
            >
              <CameraOff className="mr-3 h-5 w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform duration-300" />
              Hentikan Pemindai
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl border border-slate-200/40">
          <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
            <div className="p-1 bg-blue-100 rounded">
              <CheckCircle className="w-3 h-3 text-blue-600" />
            </div>
            Tips Scanning:
          </h3>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Pastikan QR Code terlihat jelas dalam frame</li>
            <li>• Jaga jarak sekitar 15-30 cm dari layar</li>
            <li>• Hindari refleksi cahaya berlebihan</li>
            <li>• Tahan perangkat dengan stabil</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}