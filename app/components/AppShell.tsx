"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <Header>{children}</Header>;
}
