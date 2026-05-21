import { ShopButton } from "@/app/ui/shop/button";
import { getProducts } from "@/app/lib/services/products";
import type { ProductListItem } from "@/app/lib/definitions";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

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

          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-shop-lg bg-shop-surface-muted lg:block">
            <Image
              src="/hero-desktop.png"
              alt="Premium tech collection"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 50vw, 600px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-shop-text/20 to-transparent" />
          </div>
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
      href: "/products",
      accent: "from-stone-100 to-stone-50",
    },
    {
      name: "Tablets",
      description: "Work and create",
      href: "/products",
      accent: "from-neutral-100 to-neutral-50",
    },
    {
      name: "Wearables",
      description: "Track every moment",
      href: "/products",
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
    products = await getProducts("", 1);
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
          {featured.map((product) => (
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
