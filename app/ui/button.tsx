import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'inline-flex h-11 items-center justify-center rounded-shop bg-shop-text px-5 text-sm font-medium text-white transition-all duration-shop ease-shop hover:bg-shop-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shop-text focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  );
}
