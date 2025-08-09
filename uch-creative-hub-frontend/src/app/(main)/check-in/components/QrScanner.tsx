// src/app/(main)/check-in/components/QrScanner.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { processCheckin } from "@/_services/checkin.service";
import { 
  validateImageFile, 
  getScannerErrorMessage, 
  checkCameraSupport, 
  requestCameraPermission 
} from "@/_lib/scanner.utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, CameraOff, Camera, Loader2, CheckCircle, AlertTriangle, Upload, Image } from "lucide-react";

export function QrScanner() {
  const router = useRouter();
  const scannerRegionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');
  const [cameraSupport, setCameraSupport] = useState<{ isSupported: boolean; hasCamera: boolean }>({
    isSupported: true,
    hasCamera: true
  });

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

  const onScanSuccess = useCallback((decodedText: string) => {
    console.log('Scan success:', decodedText);
    setScannerError(null);
    mutation.mutate({ token: decodedText });
  }, [mutation]);

  const onScanError = useCallback((error: string) => {
    // Only log significant errors, not every frame scan attempt
    if (!error.includes('No QR code found') && !error.includes('NotFoundException')) {
      console.warn('Scan error:', error);
    }
  }, []);

  const startScanner = async () => {
    if (!scannerRegionRef.current || isScanning) return;

    try {
      setScannerError(null);
      
      // Request camera permission first
      const permissionResult = await requestCameraPermission();
      if (!permissionResult.granted) {
        setScannerError(permissionResult.error || 'Akses kamera ditolak');
        setCameraPermission('denied');
        return;
      }

      // Clear any existing scanner instance
      await stopScanner();
      
      const html5QrCode = new Html5Qrcode(scannerRegionRef.current.id);
      html5QrCodeRef.current = html5QrCode;

      const config = { 
        fps: 10, 
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0,
        supportedScanTypes: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.CODABAR,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
          Html5QrcodeSupportedFormats.MAXICODE,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.PDF_417,
          Html5QrcodeSupportedFormats.RSS_14,
          Html5QrcodeSupportedFormats.RSS_EXPANDED,
        ]
      };

      await html5QrCode.start(
        { facingMode: "environment" }, // Gunakan kamera belakang
        config,
        onScanSuccess,
        onScanError
      );
      
      setIsScanning(true);
      setCameraPermission('granted');
      
    } catch (err: any) {
      console.error("Camera start error:", err);
      const errorMessage = getScannerErrorMessage(err);
      setScannerError(errorMessage);
      setCameraPermission('denied');
      setIsScanning(false);
      toast.error(errorMessage);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        const state = html5QrCodeRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (error) {
        console.error("Error stopping scanner:", error);
      } finally {
        html5QrCodeRef.current = null;
      }
    }
    setIsScanning(false);
    setScannerError(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setScannerError(null);
      
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const html5QrCode = new Html5Qrcode("file-scan-region");
      
      const result = await html5QrCode.scanFile(file, true);
      onScanSuccess(result);
      
    } catch (error: any) {
      console.error('File scan error:', error);
      const errorMessage = getScannerErrorMessage(error);
      setScannerError(errorMessage);
      toast.error(errorMessage);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
            <QrCode className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl lg:text-2xl text-slate-800 font-bold mb-1">
              QR/Barcode Scanner
            </CardTitle>
            <CardDescription className="text-sm lg:text-base text-slate-600">
              Pindai QR Code atau Barcode untuk check-in
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 lg:p-8 bg-gradient-to-b from-white to-slate-50/30">
        {/* Scanner Tabs */}
        <Tabs value={scanMode} onValueChange={(value) => setScanMode(value as 'camera' | 'upload')} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-xl p-1">
            <TabsTrigger 
              value="camera" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Camera className="w-4 h-4 mr-2" />
              Kamera
            </TabsTrigger>
            <TabsTrigger 
              value="upload" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="mt-4">
            {/* Camera Scanner Area */}
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

            {/* Camera Control Buttons */}
            <div className="space-y-3">
              {!isScanning ? (
                <Button 
                  onClick={startScanner} 
                  disabled={!cameraSupport.isSupported || !cameraSupport.hasCamera || cameraPermission === 'denied' || mutation.isPending}
                  className="w-full h-12 lg:h-14 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-300 group text-base lg:text-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Camera className="mr-3 h-5 w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform duration-300" />
                  {!cameraSupport.isSupported || !cameraSupport.hasCamera 
                    ? 'Kamera Tidak Tersedia' 
                    : 'Mulai Pindai QR/Barcode'
                  }
                </Button>
              ) : (
                <Button 
                  onClick={stopScanner} 
                  variant="destructive" 
                  disabled={mutation.isPending}
                  className="w-full h-12 lg:h-14 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white rounded-xl font-bold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-600/30 transition-all duration-300 group text-base lg:text-lg transform hover:scale-[1.02] disabled:opacity-50"
                >
                  <CameraOff className="mr-3 h-5 w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform duration-300" />
                  Hentikan Pemindai
                </Button>
              )}
              
              {(!cameraSupport.isSupported || !cameraSupport.hasCamera) && (
                <p className="text-sm text-slate-500 text-center">
                  Gunakan fitur upload file untuk memindai QR/Barcode
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            {/* File Upload Area */}
            <div className="mb-6">
              <div className="relative bg-slate-100 rounded-2xl p-8 border-2 border-dashed border-slate-300 min-h-[320px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center mb-4 mx-auto">
                    <Image className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium mb-2">Upload Gambar QR/Barcode</p>
                  <p className="text-sm text-slate-400 mb-4">
                    Pilih gambar yang berisi QR Code atau Barcode
                  </p>
                  
                  <div className="flex justify-center">
                    <Button 
                      type="button"
                      disabled={mutation.isPending}
                      className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 group transform hover:scale-[1.02]"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      Pilih File Gambar
                    </Button>
                  </div>
                  
                  <Input
                    id="file-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <p className="text-xs text-slate-400 mt-4">
                    Format: JPG, PNG, WEBP, BMP • Maksimal: 10MB
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

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

        {scannerError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-800">Error Scanner</p>
                <p className="text-xs text-red-600">{scannerError}</p>
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
                <p className="text-xs text-blue-600">Sedang memverifikasi kode...</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl border border-slate-200/40">
          <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
            <div className="p-1 bg-blue-100 rounded">
              <CheckCircle className="w-3 h-3 text-blue-600" />
            </div>
            Tips Scanning:
          </h3>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Pastikan kode terlihat jelas dalam frame</li>
            <li>• Jaga jarak sekitar 15-30 cm dari layar</li>
            <li>• Hindari refleksi cahaya berlebihan</li>
            <li>• Tahan perangkat dengan stabil</li>
            <li>• Mendukung QR Code dan berbagai format Barcode</li>
          </ul>
        </div>

        {/* Hidden div for file scanning */}
        <div id="file-scan-region" className="hidden"></div>
      </CardContent>
    </Card>
  );
}