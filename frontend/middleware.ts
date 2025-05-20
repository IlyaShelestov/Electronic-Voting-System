import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

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
];

function isIgnoredPath(pathname: string): boolean {
  return IGNORED_PATHS.some((prefix) => pathname.startsWith(prefix));
}

function extractUserRolesFromCookie(req: NextRequest): string[] {
  const rolesCookie = req.cookies.get("auth_roles")?.value;
  if (!rolesCookie) return [];

  try {
    const roles = JSON.parse(decodeURIComponent(rolesCookie));
    return Array.isArray(roles) ? roles : [];
  } catch {
    return [];
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isIgnoredPath(pathname)) return NextResponse.next();

  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch?.[1] || "en";

  const isPublic = PUBLIC_ROUTES.some((publicPath) =>
    pathname.startsWith(`/${locale}${publicPath}`)
  );

  if (isPublic) return intlMiddleware(req);

  // Role-based access check
  for (const [routePrefix, allowedRoles] of Object.entries(ROLE_BASED_ROUTES)) {
    if (pathname.startsWith(`/${locale}${routePrefix}`)) {
      const userRoles = extractUserRolesFromCookie(req);
      const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

      if (!hasAccess) {
        const url = req.nextUrl.clone();
        url.pathname = `/${locale}/unauthorized`;
        return NextResponse.redirect(url);
      }
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|api|static|fonts|images|favicon.ico).*)"],
};
