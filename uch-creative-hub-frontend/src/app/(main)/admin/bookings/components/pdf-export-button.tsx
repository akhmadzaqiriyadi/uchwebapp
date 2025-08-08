// src/app/(main)/admin/bookings/components/pdf-export-button.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, Filter, Settings, Loader2 } from "lucide-react";
import { Booking } from "@/_services/booking.service";
import { PDFService } from "@/_services/pdf.service";
import { toast } from "sonner";

interface PDFExportButtonProps {
  bookings: Booking[];
  filteredBookings?: Booking[];
}

export function PDFExportButton({ bookings, filteredBookings }: PDFExportButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    title: "Laporan Data Booking UCH Creative Hub",
    subtitle: "",
    includeStats: true,
    useFiltered: false
  });

  const handleQuickExport = async (useFiltered: boolean = false) => {
    setIsGenerating(true);
    try {
      const dataToExport = useFiltered && filteredBookings ? filteredBookings : bookings;
      const subtitle = useFiltered ? `Data yang difilter (${dataToExport.length} booking)` : `Semua data (${dataToExport.length} booking)`;
      
      PDFService.generateBookingReport(dataToExport, {
        title: "Laporan Data Booking UCH Creative Hub",
        subtitle,
        includeStats: true
      });
      
      toast.success("PDF berhasil diunduh!");
    } catch (error) {
      toast.error("Gagal membuat PDF");
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomExport = async () => {
    setIsGenerating(true);
    try {
      const dataToExport = exportOptions.useFiltered && filteredBookings ? filteredBookings : bookings;
      
      PDFService.generateBookingReport(dataToExport, {
        title: exportOptions.title,
        subtitle: exportOptions.subtitle || `${dataToExport.length} booking ditemukan`,
        includeStats: exportOptions.includeStats
      });
      
      toast.success("PDF berhasil diunduh!");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Gagal membuat PDF");
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const activeBookings = filteredBookings || bookings;
  const hasFiltered = filteredBookings && filteredBookings.length !== bookings.length;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 hover:bg-slate-50 flex items-center gap-2"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export PDF
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-slate-200 w-56">
          <DropdownMenuItem 
            onClick={() => handleQuickExport(false)}
            className="rounded-lg cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
            disabled={isGenerating}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-blue-700">Semua Data</p>
                <p className="text-xs text-slate-500">{bookings.length} booking</p>
              </div>
            </div>
          </DropdownMenuItem>
          
          {hasFiltered && (
            <DropdownMenuItem 
              onClick={() => handleQuickExport(true)}
              className="rounded-lg cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50"
              disabled={isGenerating}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
                  <Filter className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-emerald-700">Data Terfilter</p>
                  <p className="text-xs text-slate-500">{filteredBookings?.length} booking</p>
                </div>
              </div>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator className="bg-slate-200" />
          
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              setIsDialogOpen(true);
            }}
            className="rounded-lg cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center">
                <Settings className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-purple-700">Custom Export</p>
                <p className="text-xs text-slate-500">Atur opsi ekspor</p>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom Export Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-xl border-0 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800">
                Pengaturan Export PDF
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                Kustomisasi laporan PDF sesuai kebutuhan Anda
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-slate-700">
              Judul Laporan
            </Label>
            <Input
              id="title"
              value={exportOptions.title}
              onChange={(e) => setExportOptions(prev => ({ ...prev, title: e.target.value }))}
              className="rounded-lg border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Masukkan judul laporan"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-sm font-medium text-slate-700">
              Subtitle (Opsional)
            </Label>
            <Input
              id="subtitle"
              value={exportOptions.subtitle}
              onChange={(e) => setExportOptions(prev => ({ ...prev, subtitle: e.target.value }))}
              className="rounded-lg border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Masukkan subtitle"
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="includeStats"
                checked={exportOptions.includeStats}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, includeStats: checked as boolean }))
                }
              />
              <Label htmlFor="includeStats" className="text-sm font-medium text-slate-700 cursor-pointer">
                Sertakan statistik ringkasan
              </Label>
            </div>

            {hasFiltered && (
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="useFiltered"
                  checked={exportOptions.useFiltered}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, useFiltered: checked as boolean }))
                  }
                />
                <Label htmlFor="useFiltered" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Gunakan data yang sudah difilter ({filteredBookings?.length} booking)
                </Label>
              </div>
            )}
          </div>

          {/* Data Preview */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Preview Data:</h4>
            <div className="text-sm text-slate-600">
              <p>Total booking: {exportOptions.useFiltered && filteredBookings ? filteredBookings.length : bookings.length}</p>
              <p>Statistik: {exportOptions.includeStats ? "Ya" : "Tidak"}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            className="rounded-xl border-slate-200 hover:bg-slate-50"
          >
            Batal
          </Button>
          <Button
            onClick={handleCustomExport}
            disabled={isGenerating || !exportOptions.title.trim()}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl shadow-lg flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export PDF
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
