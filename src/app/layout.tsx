import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { withBasePath } from "@/lib/basePath";
import { DemoHjorne } from "@/demo/DemoHjorne";

export const metadata: Metadata = {
  title: "Designprototype - Team DAB",
  description: "Interaktiv prototype for utforskning og brukertesting.",
  icons: {
    icon: [
      { url: withBasePath("/favicon-16x16.png"), sizes: "16x16", type: "image/png" },
      { url: withBasePath("/favicon-32x32.png"), sizes: "32x32", type: "image/png" },
    ],
    apple: withBasePath("/apple-touch-icon.png"),
    other: [
      { rel: "android-chrome", url: withBasePath("/android-chrome-192x192.png"), sizes: "192x192" },
      { rel: "android-chrome", url: withBasePath("/android-chrome-512x512.png"), sizes: "512x512" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb" className="h-full">
      <head>
        <link
          rel="preload"
          href="https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* useSearchParams (demo-oppsettet) krever Suspense ved statisk eksport. */}
        <Suspense fallback={null}>
          <DemoHjorne />
          {children}
        </Suspense>
      </body>
    </html>
  );
}
