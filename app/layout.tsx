import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSクラウドセキュリティ | Security Learning Platform",
  description: "DropStone クラウドセキュリティ スタディ — 全社員のセキュリティ水準を引き上げる学習プラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
