import SideNav from "@/app/ui/dashboard/sidenav";
import Header from "../ui/dashboard/header";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const userId = cookieStore.get("user_id");
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-2 md:overflow-y-auto pt-4">
        <Header />
        {children}
      </div>
    </div>
  );
}
