import { categoryNavHref } from "@/app/lib/product-filters";
import { ShopButton } from "@/app/ui/shop/button";
import { getProducts } from "@/app/lib/services/products";
import type { ProductListItem } from "@/app/lib/definitions";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ClockIcon,
  ShoppingBagIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";

const heroCategories = [
  {
    name: "Smartphones",
    icon: DevicePhoneMobileIcon,
    tag: "Best sellers",
    offset: "animate-float-slow",
  },
  {
    name: "Tablets",
    icon: DeviceTabletIcon,
    tag: "Pro picks",
    offset: "animate-float-slower [animation-delay:1s]",
  },
  {
    name: "Wearables",
    icon: ClockIcon,
    tag: "Just dropped",
    offset: "animate-float-slow [animation-delay:2s]",
  },
] as const;

function HeroVisual() {
  return (
    <div
      className="relative hidden aspect-[4/5] overflow-hidden rounded-shop-lg border border-shop-border-subtle bg-gradient-to-br from-shop-surface via-shop-surface-muted to-stone-200/60 lg:block"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(10,10,10,0.06),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(10,10,10,0.04),transparent_45%)]" />
      <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,#0a0a0a08_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a08_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between gap-3">
          <span className="shop-badge">Live catalog</span>
          <span className="inline-flex items-center gap-1 rounded-shop border border-shop-border-subtle bg-shop-surface/80 px-2.5 py-1 text-xs font-medium text-shop-secondary backdrop-blur-sm">
            <BoltIcon className="h-3.5 w-3.5 text-shop-text" strokeWidth={2} />
            Ships in 48h
          </span>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center py-4">
          <div className="shop-card absolute left-2 top-6 w-[42%] -rotate-6 p-4 shadow-shop-md animate-float-slower">
            <DevicePhoneMobileIcon
              className="h-8 w-8 text-shop-text"
              strokeWidth={1.25}
            />
            <p className="mt-3 font-display text-sm font-medium text-shop-text">
              Smartphones
            </p>
            <p className="mt-0.5 text-xs text-shop-muted">128 models</p>
          </div>

          <div className="shop-card relative z-10 w-[52%] p-5 shadow-shop-lg animate-float-slow">
            <div className="flex h-14 w-14 items-center justify-center rounded-shop-lg bg-shop-text">
              <ShoppingBagIcon className="h-7 w-7 text-white" strokeWidth={1.5} />
            </div>
            <p className="mt-4 font-display text-base font-medium text-shop-text">
              Your next upgrade
            </p>
            <p className="mt-1 text-xs leading-relaxed text-shop-secondary">
              Curated tech · Secure checkout
            </p>
            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <StarSolidIcon key={i} className="h-3 w-3 text-shop-text" />
              ))}
              <span className="ml-1 text-xs font-medium text-shop-text">
                4.9
              </span>
            </div>
          </div>

          <div className="shop-card absolute bottom-8 right-0 w-[40%] rotate-6 p-4 shadow-shop-md animate-float-slow [animation-delay:1.5s]">
            <ClockIcon className="h-8 w-8 text-shop-text" strokeWidth={1.25} />
            <p className="mt-3 font-display text-sm font-medium text-shop-text">
              Wearables
            </p>
            <p className="mt-0.5 text-xs text-shop-muted">New arrivals</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {heroCategories.map((cat) => (
            <div
              key={cat.name}
              className={`rounded-shop border border-shop-border-subtle bg-shop-surface/90 px-3 py-2.5 backdrop-blur-sm ${cat.offset}`}
            >
              <cat.icon className="h-4 w-4 text-shop-muted" strokeWidth={1.5} />
              <p className="mt-1.5 text-[11px] font-medium text-shop-text">
                {cat.name}
              </p>
              <p className="text-[10px] text-shop-muted">{cat.tag}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-shop-border-subtle pt-4">
          <div>
            <p className="font-display text-lg font-medium text-shop-text">
              12k+
            </p>
            <p className="text-[10px] uppercase tracking-wider text-shop-muted">
              Orders
            </p>
          </div>
          <div>
            <p className="font-display text-lg font-medium text-shop-text">
              98%
            </p>
            <p className="text-[10px] uppercase tracking-wider text-shop-muted">
              Happy buyers
            </p>
          </div>
          <div>
            <p className="font-display text-lg font-medium text-shop-text">
              24/7
            </p>
            <p className="text-[10px] uppercase tracking-wider text-shop-muted">
              Support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StorefrontHero() {
  return (
    <section className="relative overflow-hidden border-b border-shop-border-subtle">
      <div className="shop-content-wrap py-16 md:py-24 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl animate-fade-in-up">
            <p className="font-mono-label text-shop-muted">
              New season · Premium tech
            </p>
            <h1 className="font-display mt-4 text-display-lg font-medium tracking-tight text-shop-text text-balance md:text-display-xl">
              Designed for how you live.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-shop-secondary">
              Discover smartphones, tablets, and wearables curated for
              performance, clarity, and everyday elegance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products">
                <ShopButton variant="primary" size="lg">
                  Shop collection
                  <ArrowRightIcon className="h-4 w-4" />
                </ShopButton>
              </Link>
              <Link href="/login">
                <ShopButton variant="outline" size="lg">
                  Sign in
                </ShopButton>
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap gap-6 border-t border-shop-border-subtle pt-8 text-sm text-shop-secondary md:gap-10">
              <li className="flex items-center gap-2">
                <TruckIcon className="h-5 w-5 text-shop-text" strokeWidth={1.5} />
                Free shipping $150+
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheckIcon
                  className="h-5 w-5 text-shop-text"
                  strokeWidth={1.5}
                />
                Secure Stripe checkout
              </li>
            </ul>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

export function CategoryTiles() {
  const categories = [
    {
      name: "Smartphones",
      description: "Flagship performance",
      href: categoryNavHref("smartphones"),
      accent: "from-stone-100 to-stone-50",
    },
    {
      name: "Tablets",
      description: "Work and create",
      href: categoryNavHref("tablets"),
      accent: "from-neutral-100 to-neutral-50",
    },
    {
      name: "Wearables",
      description: "Track every moment",
      href: categoryNavHref("wearables"),
      accent: "from-zinc-100 to-zinc-50",
    },
  ];

  return (
    <section className="shop-content-wrap py-14 md:py-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="shop-section-title">Shop by category</h2>
          <p className="mt-2 text-sm text-shop-secondary">
            Browse our most popular collections
          </p>
        </div>
        <Link
          href="/products"
          className="hidden text-sm font-medium text-shop-text underline-offset-4 transition-opacity hover:underline sm:block"
        >
          View all
        </Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className={`group shop-card-interactive flex flex-col justify-between bg-gradient-to-br ${cat.accent} p-6 md:p-8`}
          >
            <div>
              <h3 className="font-display text-lg font-medium tracking-tight text-shop-text">
                {cat.name}
              </h3>
              <p className="mt-1 text-sm text-shop-muted">{cat.description}</p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1 font-mono-label text-shop-text">
              Explore
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-shop group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export async function FeaturedProducts() {
  let products: ProductListItem[] = [];

  try {
    const result = await getProducts(
      { page: 1, sort: "popular" },
      { authenticated: false },
    );
    products = result.products;
  } catch {
    products = [];
  }

  const featured = products.slice(0, 4);

  if (featured.length === 0) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  return (
    <section className="border-t border-shop-border-subtle bg-shop-surface-muted/50 py-14 md:py-20">
      <div className="shop-content-wrap">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-4 w-4 text-shop-muted" strokeWidth={1.5} />
              <p className="font-mono-label text-shop-muted">Curated picks</p>
            </div>
            <h2 className="shop-section-title mt-2">Featured products</h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-shop-text underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {featured.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.name.replace(/ /g, "-")}.${product.id}`}
              className="group shop-card-interactive overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-shop-surface-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority={index === 0}
                  className="object-contain p-6 transition-transform duration-500 ease-shop group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />
                {product.isNew && (
                  <span className="shop-badge absolute left-3 top-3">New</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-shop-text transition-colors group-hover:text-shop-secondary">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-shop-text">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StorefrontCta() {
  return (
    <section className="border-t border-shop-border bg-shop-surface">
      <div className="shop-content-wrap py-16 text-center md:py-24">
        <h2 className="font-display text-2xl font-medium tracking-tight text-shop-text md:text-display-md">
          Ready to upgrade?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-shop-secondary">
          Sign in to access the full catalog, save items to your bag, and
          checkout securely.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products">
            <ShopButton variant="primary" size="lg">
              Start shopping
            </ShopButton>
          </Link>
          <Link href="/login">
            <ShopButton variant="outline" size="lg">
              Sign in
            </ShopButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
