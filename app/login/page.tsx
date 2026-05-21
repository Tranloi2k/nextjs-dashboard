import ShopLogo from "@/app/ui/shop/logo";
import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col bg-shop-bg">
      <header className="shop-content-wrap flex h-16 items-center">
        <ShopLogo />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 text-center">
            <h1 className="font-display text-2xl font-medium tracking-tight text-shop-text">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-shop-secondary">
              Sign in to access your account and shop our collection.
            </p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
          <p className="mt-6 text-center text-sm text-shop-muted">
            <Link
              href="/"
              className="font-medium text-shop-text underline-offset-4 hover:underline"
            >
              ← Back to store
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
