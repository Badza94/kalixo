import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (req.method === "GET") {
    // Rewrite routes that match "/[...puckPath]/edit" to "/puck/[...puckPath]"
    if (req.nextUrl.pathname.endsWith("/edit")) {
      const pathWithoutEdit = req.nextUrl.pathname.slice(
        0,
        req.nextUrl.pathname.length - 5
      );
      const pathWithEditPrefix = `/puck${pathWithoutEdit}`;

      return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url));
    }

    // Disable "/puck/[...puckPath]" except for API routes
    if (req.nextUrl.pathname.startsWith("/puck")) {
      const whitelistedSubpaths = ["/puck/api"];
      const isWhitelisted = whitelistedSubpaths.some((allowed) =>
        req.nextUrl.pathname.startsWith(allowed)
      );

      if (!isWhitelisted) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  return res;
}
