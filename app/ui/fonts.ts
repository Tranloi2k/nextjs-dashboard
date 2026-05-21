import { Inter, Outfit, Lusitana } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const lusitana = Lusitana({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
