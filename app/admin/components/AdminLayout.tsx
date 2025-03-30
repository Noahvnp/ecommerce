"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    toggleSidebar();
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <main className="relative flex">
      {/* 🔹 Sidebar Desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* 🔹 Sidebar Mobile */}
      <div
        ref={sidebarRef}
        className={`fixed z-10 transition-all duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "-translate-x-[240px]"}`}
      >
        <Sidebar />
      </div>
      <section className="flex min-h-screen flex-1 flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <section className="flex-1 bg-[#eff3f4] p-6 md:p-4 dark:bg-gray-700">
          {children}
        </section>
      </section>
    </main>
  );
}
