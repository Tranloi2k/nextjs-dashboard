import Link from "next/link";
import clsx from "clsx";

export default function ShopLogo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <Link
      href="/"
      className={clsx(
        "font-display text-xl font-semibold tracking-tight transition-opacity hover:opacity-80",
        variant === "light" ? "text-white" : "text-shop-text",
        className,
      )}
    >
      NOVA
    </Link>
  );
}
