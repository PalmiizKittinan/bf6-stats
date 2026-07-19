import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import SearchProvider from "@/components/SearchProvider";
import Navbar from "@/components/Navbar";

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
    <html lang="en" data-bs-theme="dark">
      <body>
        <ThemeProvider>
          <SearchProvider>
            <Navbar />
            <main>{children}</main>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}