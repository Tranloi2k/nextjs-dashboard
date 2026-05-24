import type { Metadata } from "next";
import { buildPageMetadata } from "@/app/lib/seo";

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

export const metadata: Metadata = buildPageMetadata({
  title: "Customers",
  description: "Customer account area.",
  pathname: "/customers",
  noIndex: true,
});

export default function Page() {
  return <p>Customers Page</p>;
}
