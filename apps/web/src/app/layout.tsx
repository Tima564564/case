import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { AppProviders } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "CASE Gifts",
  description: "Premium Telegram gift case platform with TON Connect"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#05070d"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
