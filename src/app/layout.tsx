import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Designprototype - Team DAB",
  description: "Interaktiv prototype for utforskning og brukertesting.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "android-chrome", url: "/android-chrome-192x192.png", sizes: "192x192" },
      { rel: "android-chrome", url: "/android-chrome-512x512.png", sizes: "512x512" },
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
        <div className="demo-corner" aria-hidden="true">
          <span className="demo-corner__label">DEMO</span>
          <span className="demo-corner__sublabel">Designprototype</span>
        </div>
        {children}
      </body>
    </html>
  );
}
