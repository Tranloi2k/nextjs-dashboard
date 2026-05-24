import "@/app/ui/global.css";
import { inter, outfit } from "@/app/ui/fonts";
import type { Metadata, Viewport } from "next";
import Providers from "@/app/providers";
import { rootMetadata } from "@/app/lib/seo";

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
