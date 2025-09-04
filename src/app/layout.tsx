import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

import { ReactNode } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Repair Asset Management - FIT IUH",
  description: "Hệ thống quản lý sửa chữa tài sản - Khoa CNTT Đại học Công nghiệp TP.HCM",
  icons: {
    icon: "/logo_iuh.png",
    shortcut: "/logo_iuh.png",
    apple: "/logo_iuh.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning className={`${inter.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
