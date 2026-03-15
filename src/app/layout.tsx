import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";
import Header from "../layouts/header";
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Suzuki",
  description:
    "Discover Suzuki's innovative automotive lineup, find your ideal car, explore features, and get the latest news and offers on Suzuki vehicles.",
  icons: {
    icon: "https://suzukicdn.com/themes/default2019/icons/favicon-32x32.webp",
  },
};

const suzukiFont = localFont({
  src: [{ path: "../../public/fonts/Suzuki-PRO-Headline.otf", weight: "400" }],
  variable: "--font-suzuki-pro-headline",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${suzukiFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
