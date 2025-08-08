// src/app/(main)/bookings/page.tsx
import { NewBookingForm } from "./components/NewBookingForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewBookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" className="flex items-center space-x-2 rounded-xl border-gray-200 hover:bg-gray-50 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Dashboard</span>
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
            Buat Booking Ruangan
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Ajukan pemesanan ruangan UCH Creative Hub dengan mudah dan cepat
          </p>
        </div>
        
        <NewBookingForm />
      </div>
    </div>
  );
}