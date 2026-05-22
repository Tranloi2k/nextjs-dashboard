import type { NextAuthConfig } from "next-auth";
import {
  ACCESS_EXPIRES_COOKIE,
  isAccessTokenExpired,
  REFRESH_TOKEN_COOKIE,
} from "@/app/lib/auth-constants";

// Extend the Session type to include custom properties
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    expiresAt?: number;
    nearExpiry?: boolean;
  }
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    // ✅ Cấu hình session expiry
    strategy: "jwt", // Sử dụng JWT thay vì database sessions
    maxAge: 24 * 60 * 60, // 30 days (in seconds)
    updateAge: 12 * 60 * 60, // 24 hours - update session mỗi 24h
  },
  jwt: {
    // ✅ JWT token expiry
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    authorized({ auth, request: { nextUrl, cookies } }) {
      const isLoggedIn = !!auth?.user;
      const hasAccessToken = !!cookies.get("access_token")?.value;
      const hasRefreshToken = !!cookies.get(REFRESH_TOKEN_COOKIE)?.value;
      const accessExpired = isAccessTokenExpired(
        cookies.get(ACCESS_EXPIRES_COOKIE)?.value,
      );
      const hasValidSession =
        isLoggedIn &&
        ((hasAccessToken && !accessExpired) || hasRefreshToken);
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/products") ||
        nextUrl.pathname.startsWith("/customers");

      if (isProtectedRoute) {
        if (hasValidSession) {
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      } else if (hasValidSession && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/products", nextUrl));
      }

      return true;
    },

    // ✅ JWT callback để kiểm tra expiry
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          // ✅ Set custom expiry time
          expiresAt: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
        };
      }

      // ✅ Check if token has expired
      if (
        typeof token.expiresAt === "number" &&
        Date.now() / 1000 > token.expiresAt
      ) {
        console.log("🔒 Token expired, forcing logout");
        return null; // This will force logout
      }

      return token;
    },

    // ✅ Session callback để pass data to client
    async session({ session, token }) {
      if (token) {
        session.accessToken =
          typeof token.accessToken === "string" ? token.accessToken : undefined;
        session.expiresAt =
          typeof token.expiresAt === "number" ? token.expiresAt : undefined;

        // ✅ Check if close to expiry (optional warning)
        let timeLeft: number | undefined;
        if (typeof token.expiresAt === "number") {
          timeLeft = token.expiresAt - Math.floor(Date.now() / 1000);
          if (timeLeft < 24 * 60 * 60) {
            // Less than 24 hours left
            session.nearExpiry = true;
          }
        }
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
