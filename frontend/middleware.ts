import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("authToken")?.value;

  if (
    (!authToken && !req.nextUrl.pathname.startsWith("/auth")) ||
    req.nextUrl.pathname === "/auth"
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|fonts|images|favicon.ico).*)"],
};
