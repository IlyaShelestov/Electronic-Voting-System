import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("token")?.value;
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

  if (req.nextUrl.pathname === "/auth") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (!authToken && !isAuthPage) {
    console.log("Redirecting to /auth/login due to missing authToken");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (authToken && isAuthPage) {
    console.log("User already authenticated, redirecting to /");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|fonts|images|favicon.ico).*)"],
};
