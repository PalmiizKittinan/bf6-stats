import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}