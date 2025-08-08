// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Sementara disable middleware untuk troubleshooting
  return NextResponse.next();
  
  /* 
  const token = request.cookies.get('uch-token')?.value;
  const pathname = request.nextUrl.pathname;

  // Daftar route yang memerlukan autentikasi
  const protectedRoutes = ['/dashboard', '/bookings', '/admin', '/check-in'];
  
  // Daftar route auth yang tidak boleh diakses jika sudah login
  const authRoutes = ['/login', '/register'];

  // Cek apakah route saat ini adalah protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Cek apakah route saat ini adalah auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Jika mengakses protected route tanpa token, redirect ke login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika mengakses auth route dengan token, redirect ke dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: [
    // Sementara kosong untuk troubleshooting
  ]
};
