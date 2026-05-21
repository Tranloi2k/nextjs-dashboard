import "@/app/ui/global.css";
import { inter, outfit } from "@/app/ui/fonts";
import { Metadata } from "next";
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: {
    template: "%s | NOVA",
    default: "NOVA — Premium Tech Store",
  },
  description:
    "Discover premium smartphones, tablets, and wearables. Secure checkout and fast delivery.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
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
