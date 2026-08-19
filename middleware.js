import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

import { SESSION_COOKIE_NAME } from "@/lib/session.config";

const normalizeRole = (value) => String(value ?? "").trim().toLowerCase();

const ROLE_PATHS = {
  administrator: ["/dashboard/admin"],
  receptionist: ["/dashboard/reception"],
  "medical technologist": ["/dashboard/medtech"],
  pathologist: ["/dashboard/doctor"],
  physician: ["/dashboard/doctor"],
  doctor: ["/dashboard/doctor"],
};

const ROLE_HOME = {
  administrator: "/dashboard/admin",
  receptionist: "/dashboard/reception",
  "medical technologist": "/dashboard/medtech",
  pathologist: "/dashboard/doctor",
  physician: "/dashboard/doctor",
  doctor: "/dashboard/doctor",
};

// jose needs the secret as a Uint8Array, not a raw string.
const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/auth/login" ||
    pathname === "/" ||
    pathname === "/favicon.ico" ||
    pathname === "/dashboard/access-denied"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const { payload: user } = await jwtVerify(token, secretKey);

    if (!user?.role) {
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    const roleKey = normalizeRole(user.role);
    const allowedPaths = ROLE_PATHS[roleKey] ?? [];
    const isAllowed = allowedPaths.some(
      (allowedPath) => pathname === allowedPath || pathname.startsWith(`${allowedPath}/`),
    );

    if (!isAllowed && pathname.startsWith("/dashboard")) {
      const home = ROLE_HOME[roleKey] ?? "/auth/login";
      if (pathname === "/dashboard") {
        return NextResponse.redirect(new URL(home, request.url));
      }
      return NextResponse.redirect(new URL("/dashboard/access-denied", request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};