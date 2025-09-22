import { supportedLocales } from "@/data/supportedLocales";
import { unprotectedRoutes } from "@/data/unprotectedRoutes";

export function isUnprotectedRoute(pathname: string) {
  // Split the pathname into segments and filter out empty ones.
  const segments = pathname.split("/").filter(Boolean);
  // Determine the effective route:
  let effectiveRoute = segments.length > 0 ? `/${segments[0]}` : "/";
  if (supportedLocales.includes(segments[0] as string) && segments[1]) {
    effectiveRoute = `/${segments[1]}`;
  }
  const isUnprotectedRoute = unprotectedRoutes.includes(effectiveRoute);
  return isUnprotectedRoute;
}
