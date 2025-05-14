import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const ignored = [
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

  const locale = req.nextUrl.locale || routing.defaultLocale;
  const isAuthPage = pathname.startsWith(`/${locale}/auth`);

  const redirectTo = (path: string) => {
    const url = req.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  if (!token && !isAuthPage) {
    return redirectTo(`/${locale}/auth/login`);
  }

  if (token && isAuthPage) {
    return redirectTo(`/${locale}/`);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/:locale(en|ru|de)/:path*"],
};
