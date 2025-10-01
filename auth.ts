import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import { cookies } from "next/headers";

async function login(params: { email: string; password: string }) {
  const { email, password } = params;
  const options = {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch(
    `${process.env.EXTERNAL_API_URL}/login`,
    options
  ).then((res) => {
    if (!res.ok) {
      throw new Error("Login failed");
    }
    return res.json();
  });
  return response;
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
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
            console.log(cookieStore.get("access_token"));
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
});
