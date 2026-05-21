import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import { cookies } from "next/headers";
import Google from "next-auth/providers/google";
import { googleLogin as googleAuthAction } from "@/app/lib/actions";

async function login(params: { email: string; password: string }) {
  const { email, password } = params;
  const options = {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EXTERNAL_API_URL}/login`,
    options,
  ).then((res) => {
    if (!res.ok) {
      throw new Error("Login failed");
    }
    return res.json();
  });
  return response;
}

async function logout() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token");

    if (accessToken?.value) {
      // Call backend logout endpoint
      await fetch(`${process.env.NEXT_PUBLIC_EXTERNAL_API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Backend logout failed:", error);
    // Continue with cookie cleanup even if backend call fails
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          try {
            const response = await login({ email, password });
            const cookieStore = await cookies();
            cookieStore.set({
              name: "access_token",
              value: response.accessToken,
              httpOnly: true,
              path: "/",
            });
            cookieStore.set({
              name: "user_id",
              value: response.userId.toString(),
              path: "/",
            });
            return { id: email, name: email };
          } catch (error) {
            console.error("Login failed:", error);
          }
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign in
      if (
        account?.provider === "google" &&
        user.email &&
        user.name &&
        user.id
      ) {
        try {
          const response = await googleAuthAction({
            idToken: account.id_token!,
          });

          // Set cookies for Google login
          const cookieStore = await cookies();
          cookieStore.set({
            name: "access_token",
            value: response.accessToken,
            httpOnly: true,
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });
          cookieStore.set({
            name: "user_id",
            value: response.userId.toString(),
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
          });

          console.log("✅ Google login successful:");
          return true;
        } catch (error) {
          console.error("❌ Google login failed:", error);
          return false;
        }
      }

      // For credentials provider, authorize already handled the logic
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken =
          typeof token.accessToken === "string" ? token.accessToken : undefined;
        session.expiresAt =
          typeof token.expiresAt === "number" ? token.expiresAt : undefined;

        if (typeof token.expiresAt === "number") {
          const timeLeft = token.expiresAt - Math.floor(Date.now() / 1000);
          if (timeLeft < 24 * 60 * 60) {
            session.nearExpiry = true;
          }
        }

        if (token.sub) {
          session.user.id = token.sub;
        }
      }

      return session;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          expiresAt: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
          provider: account.provider,
        };
      }

      if (
        typeof token.expiresAt === "number" &&
        Date.now() / 1000 > token.expiresAt
      ) {
        return null;
      }

      return token;
    },
  },
  events: {
    async signOut(event) {
      console.log("🔒 Signing out user...");

      try {
        // ✅ Call backend logout
        await logout();

        // ✅ Clear all auth cookies
        const cookieStore = await cookies();

        // Clear access token
        cookieStore.set({
          name: "access_token",
          value: "",
          httpOnly: true,
          path: "/",
          maxAge: 0, // Delete immediately
        });

        // Clear user ID
        cookieStore.set({
          name: "user_id",
          value: "",
          path: "/",
          maxAge: 0, // Delete immediately
        });

        console.log("✅ Cookies cleared successfully");
      } catch (error) {
        console.error("❌ Sign out error:", error);
      }
    },
  },
});
