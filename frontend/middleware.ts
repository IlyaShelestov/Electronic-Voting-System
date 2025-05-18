import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/"];
const ROLE_BASED_ROUTES = {
  "/admin": ["admin"],
  "/manager": ["admin", "manager"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

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

  if (!token && !isAuthPage) {
    return redirectTo(`/${locale}/auth/login`);
  }

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userRole = payload.role;
      const exp = payload.exp;

      if (!exp || Date.now() >= exp * 1000) {
        return redirectTo(`/${locale}/auth/login`);
      }

      for (const [route, allowedRoles] of Object.entries(ROLE_BASED_ROUTES)) {
        if (
          pathname.startsWith(`/${locale}${route}`) &&
          !allowedRoles.includes(userRole)
        ) {
          return redirectTo(`/${locale}/`);
        }
      }

      if (isAuthPage) {
        return redirectTo(`/${locale}/`);
      }
    } catch {
      return redirectTo(`/${locale}/auth/login`);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/:locale(en|ru|de)/:path*"],
};
