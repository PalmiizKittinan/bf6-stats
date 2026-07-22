"use client";

import { useCSSFramework } from "@/components/CSSFrameworkProvider";
import Footer from "@/components/Footer";
import FooterTW from "@/components/tailwind/FooterTW";

export default function FooterWrapper() {
  const { framework } = useCSSFramework();

  if (framework === "tailwind") {
    return <FooterTW />;
  }

  return <Footer />;
}