import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const authToken = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const locale = req.nextUrl.locale || routing.defaultLocale || "ru";
  const isAuthPage = pathname.startsWith(`/${locale}/auth`);

  if (pathname === `/${locale}/auth`) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
  }

  if (!authToken && !isAuthPage) {
    console.log("Redirecting to auth/login due to missing token");
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
  }

  if (authToken && isAuthPage) {
    console.log("User authenticated, redirecting to home");
    return NextResponse.redirect(new URL(`/${locale}/`, req.url));
  }

  // Apply next-intl locale middleware after auth checks
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|api|static|fonts|images|favicon\\.ico).*)"],
};
