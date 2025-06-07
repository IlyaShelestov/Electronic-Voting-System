import createIntlMiddleware from 'next-intl/middleware';
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

import { defaultLocale, locales } from './i18n/config';

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/"];
const IGNORED_PATHS = [
  "/_next",
  "/api",
  "/static",
  "/fonts",
  "/images",
  "/favicon.ico",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/apple-touch-icon.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/apple-touch-icon.png",
];

function isIgnoredPath(pathname: string): boolean {
  return IGNORED_PATHS.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isIgnoredPath(pathname)) {
    return NextResponse.next();
  }

  return;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
