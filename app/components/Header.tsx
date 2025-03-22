import Image from "next/image";
import Link from "next/link";

import logo from "@/public/logo.png";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modeToggle";

export default function Header() {
  const menuList: { name: string; path: string }[] = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
  return (
    <nav className="flex w-full items-center justify-between border-b px-3 py-4 md:px-14">
      <Link href={"/"}>
        <Image
          src={logo}
          width={140}
          height={140}
          alt="logo"
          priority
          className="dark:contrast-0"
        />
      </Link>
      <div className="hidden items-center gap-10 font-semibold md:flex">
        {menuList?.map((menuItem) => (
          <Link href={menuItem.path} key={menuItem.name}>
            <button className="cursor-pointer duration-300 dark:hover:text-gray-500">
              {menuItem.name}
            </button>
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-3 md:gap-5">
        <Link href="/sign-in">
          <Button className="cursor-pointer rounded-full font-bold duration-300 dark:hover:bg-gray-500 dark:hover:text-white">
            Sign in
          </Button>
        </Link>
        <ModeToggle />
      </div>
    </nav>
  );
}
