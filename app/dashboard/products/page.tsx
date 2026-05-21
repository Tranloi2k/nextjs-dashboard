import { redirect } from "next/navigation";

export default function DashboardProductsRedirect() {
  redirect("/products");
}
