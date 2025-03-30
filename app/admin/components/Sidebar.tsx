"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cat,
  Layers2,
  LayoutDashboard,
  LibraryBig,
  PackageOpen,
  ShoppingCart,
  Star,
  User,
  LucideIcon,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface SidebarItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

const menuList: SidebarItem[] = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: PackageOpen },
  { name: "Categories", path: "/admin/categories", icon: Layers2 },
  { name: "Brands", path: "/admin/brands", icon: Cat },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", path: "/admin/customers", icon: User },
  { name: "Reviews", path: "/admin/reviews", icon: Star },
  { name: "Collections", path: "/admin/collections", icon: LibraryBig },
  { name: "Admins", path: "/admin/admins", icon: ShieldCheck },
];

export default function Sidebar() {
  const handleSignOut = async () => {
    try {
      await toast.promise(signOut(auth), {
        pending: "Logging Out...",
        success: "Successfully Logged Out",
        error: {
          render({ data }) {
            if (data instanceof Error) return data.message;
            return "An unexpected error occurred.";
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  return (
    <section className="flex h-screen flex-col justify-between gap-7 overflow-hidden border-r bg-white px-5 py-3 md:w-[240px] dark:bg-gray-800 dark:text-white">
      {/* 🔹 Logo */}
      <div className="flex justify-center border-b py-4">
        <Link href="/">
          <Image
            src="/logo.png"
            width={160}
            height={160}
            alt="logo"
            className="dark:contrast-0"
          />
        </Link>
      </div>

      {/* 🔹 Danh sách menu */}
      <ul className="flex h-full flex-1 flex-col gap-3 overflow-y-auto">
        {menuList.map((menuItem) => (
          <Tab key={menuItem.name} menuItem={menuItem} />
        ))}
      </ul>
      <button
        onClick={handleSignOut}
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2 font-semibold duration-300 ease-in hover:bg-red-300"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </section>
  );
}

interface TabProps {
  menuItem: SidebarItem;
}

function Tab({ menuItem }: TabProps) {
  const pathname = usePathname();
  const isSelected = pathname === menuItem.path;
  const Icon = menuItem.icon; // Chuyển icon từ component thành JSX element

  return (
    <Link href={menuItem.path}>
      <li
        className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2 font-semibold transition-all duration-300 ease-linear hover:text-blue-600 dark:hover:text-gray-500 ${isSelected ? "bg-blue-700/60 text-white hover:text-white dark:hover:text-white" : ""}`}
      >
        <Icon className="h-5 w-5" />
        {menuItem.name}
      </li>
    </Link>
  );
}
