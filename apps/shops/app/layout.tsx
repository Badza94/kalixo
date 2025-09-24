import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import "@workspace/ui/globals.css";

import { Providers } from "../components/providers";
import { ShopThemeWrapper } from "../components/shop-theme-wrapper";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <Suspense fallback={<div>{children}</div>}>
            <ShopThemeWrapper>
              <div>{children}</div>
            </ShopThemeWrapper>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
