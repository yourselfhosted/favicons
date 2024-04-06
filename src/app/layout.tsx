import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Favicons",
  description: "Open-source and free favicon provider. Made by yourselfhosted",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
