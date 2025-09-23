/* eslint-disable @typescript-eslint/no-explicit-any */
// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import { CustomMiddleware } from "./chain";
import { NextFetchEvent, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isUnprotectedRoute } from "@/hooks/is-unprotected-route";

export function withAuthMiddleware(middleware: CustomMiddleware) {
  return async (request: any, event: NextFetchEvent): Promise<any> => {
    const token = await getToken({ req: request });
    request.nextauth = request.nextauth || {};
    request.nextauth.token = token;
    const { pathname, search } = request.nextUrl;

    const unprotectedRoute = isUnprotectedRoute(pathname);

    // If no token and the route is not unprotected, redirect to login.
    if (!token && !unprotectedRoute) {
      const signInUrl = new URL("/login", request.url);
      const callbackUrl = `${pathname}${search}`;
      // No need to double-encode; NextAuth may handle encoding.
      signInUrl.searchParams.set("callbackUrl", callbackUrl);
      return NextResponse.redirect(signInUrl);
    }

    return middleware(request, event, NextResponse.next());
  };
}
