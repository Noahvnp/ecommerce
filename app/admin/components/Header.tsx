"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <section className="flex items-center gap-3 border-b p-4">
      <div className="flex items-center justify-center md:hidden">
        <button className="cursor-pointer" onClick={toggleSidebar}>
          <Menu />
        </button>
      </div>
      <h1 className="text-xl font-semibold">Dashboard</h1>
    </section>
  );
}
