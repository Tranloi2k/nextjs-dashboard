import clsx from "clsx";

type ShopButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ShopButtonSize = "sm" | "md" | "lg";

interface ShopButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ShopButtonVariant;
  size?: ShopButtonSize;
}

const variantStyles: Record<ShopButtonVariant, string> = {
  primary:
    "bg-shop-accent text-white hover:bg-shop-accent-hover focus-visible:ring-shop-text",
  secondary:
    "bg-shop-surface-muted text-shop-text hover:bg-shop-border-subtle focus-visible:ring-shop-text",
  outline:
    "border border-shop-border bg-transparent text-shop-text hover:border-shop-text hover:bg-shop-surface focus-visible:ring-shop-text",
  ghost:
    "bg-transparent text-shop-text hover:bg-shop-surface-muted focus-visible:ring-shop-text",
};

const sizeStyles: Record<ShopButtonSize, string> = {
  sm: "h-9 px-4 text-xs gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-sm gap-2",
};

export function ShopButton({
  children,
  className,
  variant = "primary",
  size = "md",
  ...rest
}: ShopButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center justify-center rounded-shop font-medium tracking-wide transition-all duration-shop ease-shop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </button>
  );
}
