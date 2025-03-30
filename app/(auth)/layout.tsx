"use client";

import AuthContextProvider from "@/contexts/AuthContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
