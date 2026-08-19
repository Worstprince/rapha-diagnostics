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

if (!process.env.SESSION_SECRET) {
  // Fail loudly at build/boot rather than silently accepting bad tokens.
  throw new Error("SESSION_SECRET is not set");
}
const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET);

// Collapse "//", strip trailing slash, and resolve any decoded "." / ".." segments
// so a path like /dashboard/admin/../reception can't slip past the string checks.
function normalizePath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    decoded = pathname;
  }
  const segments = decoded.split("/").reduce((acc, seg) => {
    if (seg === "" || seg === ".") return acc;
    if (seg === "..") { acc.pop(); return acc; }
    acc.push(seg);
    return acc;
  }, []);
  return "/" + segments.join("/");
}

function redirectNoStore(url, request) {
  const response = NextResponse.redirect(new URL(url, request.url));
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function middleware(request) {
  const pathname = normalizePath(request.nextUrl.pathname);

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
    return redirectNoStore("/auth/login", request);
  }

  try {
    const { payload: user } = await jwtVerify(token, secretKey);

    if (!user?.role) {
      const response = redirectNoStore("/auth/login", request);
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
        return redirectNoStore(home, request);
      }
      return redirectNoStore("/dashboard/access-denied", request);
    }

    // Authenticated dashboard responses shouldn't be cached/shared.
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    const response = redirectNoStore("/auth/login", request);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};