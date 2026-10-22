import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('powerzone_token')?.value;
  const isAuth = Boolean(token && token.trim().length > 20);

  // 1. Agar foydalanuvchi /admin bo'limlariga kirmoqchi bo'lsa va token bo'lmasa -> loginga o'tkazish
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isAuth) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Agar foydalanuvchi tizimga kirgan bo'lsa va /admin/login ga kirsa -> to'g'ridan-to'g'ri /admin ga o'tkazish
  if (pathname === '/admin/login' && isAuth) {
    const adminUrl = new URL('/admin', request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};


