import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/"];
const ROLE_BASED_ROUTES = {
  "/admin": ["admin"],
  "/manager": ["manager"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const ignored = [
    "/",
    "/_next",
    "/api",
    "/static",
    "/fonts",
    "/images",
    "/favicon.ico",
  ];
  if (ignored.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const locale = getLocale();
  const isAuthPage = pathname.startsWith(`/${locale}/auth`);

  const redirectTo = (path: string) => {
    const url = req.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/:locale(en|ru|de)/:path*"],
};
