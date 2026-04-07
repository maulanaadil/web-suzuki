import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "../styles/globals.css";
import Header from "../layouts/header";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "../layouts/footer";
import WhatsAppWidget from "../layouts/whatsapp-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle =
  "GEBYAR PROMO SUZUKI BANDUNG | Mobil Baru, Spesifikasi, Promo & Info Dealer";
const siteDescription =
  "Jelajahi mobil Suzuki terbaru di Indonesia: daftar model, spesifikasi, review, artikel, dan kalkulator kredit. Hubungi dealer lewat WhatsApp untuk harga, promo, dan jadwal test drive.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const metadataBase = new URL(siteUrl);

export const metadata: Metadata = {
  metadataBase,
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: siteTitle,
    description: siteDescription,
    type: "website",
    siteName: "GEBYAR PROMO SUZUKI BANDUNG",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "Suzuki Indonesia",
    url: siteUrl,
    sameAs: [
      "https://www.facebook.com/fauzi.suzuki.2025/",
      "https://www.instagram.com/suzukibandungraya5758/",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Suzuki Indonesia",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${suzukiFont.variable} antialiased relative`}
      >
        <Header />
        {children}
        <Footer />
        <WhatsAppWidget />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TRFF392KJJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TRFF392KJJ');
          `}
        </Script>
        <Script
          id="jsonld-organization"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(organizationJsonLd)}
        </Script>
        <Script
          id="jsonld-website"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(websiteJsonLd)}
        </Script>
      </body>
    </html>
  );
}
