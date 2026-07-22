import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import CSSFrameworkProvider from "@/components/CSSFrameworkProvider";
import SearchProvider from "@/components/SearchProvider";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";

export const metadata: Metadata = {
  title: "BF6 Stats Dashboard",
  description: "View your Battlefield 6 multiplayer statistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-bs-theme="dark" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <CSSFrameworkProvider>
            <SearchProvider>
              <NavbarWrapper />
              <main>{children}</main>
              <FooterWrapper />
            </SearchProvider>
          </CSSFrameworkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}