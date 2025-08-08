
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="relative z-10 bg-white/60 backdrop-blur-lg p-8 rounded-3xl shadow-xl shadow-blue-100/50 border border-slate-200/80">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Left Side: Image */}
            <div className="flex justify-center order-last md:order-first">
              <Image
                src="/images/404icon.svg"
                alt="404 Not Found Illustration"
                width={200}
                height={200}
                className="w-full max-w-[200px]"
              />
            </div>

            {/* Right Side: Text Content */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3 leading-tight">
                <span className="text-blue-700">404</span> | Waduh, kita tersesat di lab kreatif.
              </h1>
              <p className="text-base text-slate-600 mb-6 leading-relaxed">
                Halaman yang kamu cari tidak ada. Ayo kembali ke beranda dan mulai lagi petualangan kreatifmu.
              </p>
              <Button asChild className="bg-gradient-to-r from-[#2E417A] to-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 group">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
