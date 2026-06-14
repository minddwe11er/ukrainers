import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Наша спільнота — новини й світ",
  description: "Новини й інформація для української спільноти в районі Санкт-Галлена, Швейцарія",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
