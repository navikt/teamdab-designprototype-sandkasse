import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Designprototype - Team DAB",
  description: "Interaktiv prototype for utforskning og brukertesting.",
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
        </div>
        {children}
      </body>
    </html>
  );
}
