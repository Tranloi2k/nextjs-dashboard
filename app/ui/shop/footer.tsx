import Link from "next/link";
import ShopLogo from "@/app/ui/shop/logo";

const footerLinks = {
  Shop: [
    { name: "All products", href: "/products" },
    { name: "Smartphones", href: "/products" },
    { name: "Tablets", href: "/products" },
    { name: "Wearables", href: "/products" },
  ],
  Support: [
    { name: "Contact", href: "#" },
    { name: "Shipping", href: "#" },
    { name: "Returns", href: "#" },
    { name: "FAQ", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
};

export default function ShopFooter() {
  return (
    <footer className="border-t border-shop-border bg-shop-surface">
      <div className="shop-content-wrap py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-2">
            <ShopLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-shop-secondary">
              Premium technology for everyday life. Curated devices with secure
              checkout and fast delivery.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-mono-label text-shop-muted">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-shop-secondary transition-colors duration-shop hover:text-shop-text"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="shop-divider mt-12 flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
          <p className="text-xs text-shop-muted">
            © {new Date().getFullYear()} NOVA. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-shop-muted">
            <span>Secure Stripe checkout</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Free shipping $150+</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
