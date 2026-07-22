"use client";

import { useCSSFramework } from "@/components/CSSFrameworkProvider";
import Navbar from "@/components/Navbar";
import NavbarTW from "@/components/tailwind/NavbarTW";

export default function NavbarWrapper() {
  const { framework } = useCSSFramework();

  if (framework === "tailwind") {
    return <NavbarTW />;
  }

  return <Navbar />;
}