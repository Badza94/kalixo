// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextAuth, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    error?: string;
    id: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
  }
}
