import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
const nextIntlMiddleware = createMiddleware(routing);

export function with18nMiddleware() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (request: any): Promise<any> => {
    const { pathname } = request.nextUrl;
    const parts = pathname.split("/");
    const potentialLocale = parts[1];

    if (
      potentialLocale &&
      potentialLocale.length === 2 &&
      !routing.locales.includes(
        potentialLocale as (typeof routing.locales)[number]
      )
    ) {
      parts[1] = routing.defaultLocale;
      const newPathname = parts.join("/") || "/";
      const url = request.nextUrl.clone();
      url.pathname = newPathname;
      return NextResponse.redirect(url);
    }

    return nextIntlMiddleware(request);
  };
}
