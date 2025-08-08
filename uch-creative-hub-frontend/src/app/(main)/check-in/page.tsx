// src/app/(main)/check-in/page.tsx
import { QrScanner } from "./components/QrScanner";
import { ArrowLeft, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
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
            <QrCode className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 lg:mb-6">Check-in Booking</h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4">
            Arahkan kamera ke QR Code yang disediakan oleh admin untuk melakukan check-in
          </p>
        </div>

        {/* QR Scanner Section */}
        <div className="flex justify-center">
          <QrScanner />
        </div>
      </div>
    </div>
  );
}