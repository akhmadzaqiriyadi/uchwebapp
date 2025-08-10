// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('uch-token')?.value;
  const pathname = request.nextUrl.pathname;

  // Daftar route yang memerlukan autentikasi
  const protectedRoutes = ['/dashboard', '/bookings', '/admin', '/check-in'];
  
  // Daftar route auth yang tidak boleh diakses jika sudah login
  const authRoutes = ['/login', '/register'];

  // Daftar route public yang tidak memerlukan autentikasi
  const publicRoutes = ['/articles', '/'];

  // Cek apakah route saat ini adalah protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Cek apakah route saat ini adalah auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Cek apakah route saat ini adalah public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Jika mengakses protected route tanpa token, redirect ke login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika mengakses auth route dengan token, redirect ke dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Untuk public routes, allow akses tanpa memeriksa token
  if (isPublicRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};
