import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { getAuthToken, isTokenExpired } from "@/utils/tokenHelper"; // Assuming these functions are available

const intlMiddleware = createMiddleware(routing);

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/"];
const ROLE_BASED_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/manager": ["manager"],
};

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

  if (isIgnoredPath(pathname)) return NextResponse.next();

  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch?.[1] || "en";

  const isPublic = PUBLIC_ROUTES.some((publicPath) =>
    pathname.startsWith(`/${locale}${publicPath}`)
  );

  if (isPublic) return intlMiddleware(req);

  const PROTECTED_PATHS = ['/dashboard', '/profile', '/admin']

  if (!PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const verifyResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/verify`, {
    method: 'GET',
    headers: {
      Cookie: `token=${token}`,
    },
  })

  if (verifyResponse.ok) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/login', request.url))
  
  
  


  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|api|static|fonts|images|favicon.ico).*)"],
};