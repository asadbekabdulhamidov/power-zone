import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Faqat /admin bilan boshlanadigan yo'llarni himoya qilish
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('powerzone_token')?.value;
    const isLoginPage = pathname === '/admin/login';

    // 1. Agar foydalanuvchi tizimga kirgan bo'lsa va login sahifasiga bormoqchi bo'lsa -> admin panelga o'tkazish
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // 2. Agar foydalanuvchi admin panelga (login bo'lmagan sahifalarga) kirmoqchi bo'lsa va token bo'lmasa -> loginga majburiy yo'naltirish
    if (!isLoginPage && !token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
