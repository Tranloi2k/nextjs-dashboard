"use client";

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { ShopButton } from "@/app/ui/shop/button";
import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";
import GoogleLoginButton from "@/app/ui/google-login-button";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/products";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <div className="shop-card p-6 md:p-8">
          <div className="space-y-4">
            <div>
              <label
                className="font-mono-label text-shop-muted"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative mt-2">
                <input
                  className="shop-input pl-10"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                />
                <AtSymbolIcon
                  className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-shop-muted"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div>
              <label
                className="font-mono-label text-shop-muted"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative mt-2">
                <input
                  className="shop-input pl-10"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
                <KeyIcon
                  className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-shop-muted"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={callbackUrl} />

          <ShopButton
            type="submit"
            variant="primary"
            size="lg"
            className="mt-6 w-full"
            aria-disabled={isPending}
          >
            Sign in
            <ArrowRightIcon className="h-4 w-4" />
          </ShopButton>

          <div
            className="mt-3 flex min-h-[1.5rem] items-center gap-1.5"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-4 w-4 shrink-0 text-shop-error" />
                <p className="text-sm text-shop-error">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-shop-border-subtle" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-shop-bg px-3 text-xs text-shop-muted">
            Or continue with
          </span>
        </div>
      </div>

      <div className="shop-card p-4">
        <GoogleLoginButton />
      </div>
    </div>
  );
}
