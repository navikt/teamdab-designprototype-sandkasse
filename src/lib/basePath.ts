// basePath brukt ved statisk eksport til GitHub Pages (sett i next.config.ts via env.NEXT_PUBLIC_BASE_PATH).
// Tom streng lokalt/i andre miljøer.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// next/image legger IKKE automatisk basePath foran `src` (i motsetning til next/link).
// Bruk denne til å prefikse absolutte stier til filer i /public, slik at de også
// fungerer når appen er deployet under en understi (f.eks. GitHub Pages).
export function withBasePath(path: string): string {
  return `${basePath}${path}`;
}
