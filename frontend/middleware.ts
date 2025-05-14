import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const authToken = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const locale = req.nextUrl.locale || routing.defaultLocale || "ru";
  const isAuthPage = pathname.startsWith(`/${locale}/auth`);

  // Create a mutable URL object for redirection
  const redirectTo = (path: string) => {
    const url = req.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  if (
    pathname.startsWith(`/${locale}/auth`) &&
    pathname === `/${locale}/auth`
  ) {
    return redirectTo(`/${locale}/auth/login`);
  }

  if (!authToken && !isAuthPage) {
    console.log("Redirecting to auth/login due to missing token");
    return redirectTo(`/${locale}/auth/login`);
  }

  if (authToken && isAuthPage) {
    console.log("User authenticated, redirecting to home");
    return redirectTo(`/${locale}/`);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/:locale((ru|en|de))/((?!_next|api|static|fonts|images|favicon\\.ico).*)",
  ],
};
