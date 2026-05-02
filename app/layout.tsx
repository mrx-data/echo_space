import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "block",
});

export const metadata: Metadata = {
  title: {
    default: "Echo Space",
    template: "%s | Echo Space",
  },
  description: "Echo Space 是一个用于写作、观察与整理内心回声的个人网站。",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={spaceGrotesk.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
