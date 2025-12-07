import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only set geo-lang cookie if not already set
  if (!request.cookies.has("geo-lang")) {
    const country = request.headers.get("x-country") || "";
    const geoLang = country === "ID" ? "id" : "en";
    response.cookies.set("geo-lang", geoLang, {
      httpOnly: false, // Allow JS access
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
