import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/"];
const PROTECTED_PATHS = ['/admin', '/manager', '/profile']
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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const defaultLocale = await getLocale();
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, req.url));
  }

  if (isIgnoredPath(pathname)) return NextResponse.next();

  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch?.[1] || defaultLocale;

  const isPublic = PUBLIC_ROUTES.some((publicPath) =>
    pathname.startsWith(`/${locale}${publicPath}`)
  );

  if (isPublic) return intlMiddleware(req);


  if (!PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|fonts|images|favicon.ico).*)"],
};