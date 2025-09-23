import { chain } from "./middleware/chain";
import { withAuthMiddleware } from "./middleware/auth-middleware";
import { with18nMiddleware } from "./middleware/i18n-middleware";

export default chain([withAuthMiddleware, with18nMiddleware]);

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
