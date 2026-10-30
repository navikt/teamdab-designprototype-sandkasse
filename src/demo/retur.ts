// Veileder-konteksten (profilen en kom fra) bæres som ?retur=<intern sti>. Bare interne stier godtas.
export function trygtRetur(retur: string | null): string | null {
  return retur && retur.startsWith("/") && !retur.startsWith("//") ? retur : null;
}

export function medRetur(href: string, retur: string, somVeileder = false): string {
  const params = new URLSearchParams();
  if (somVeileder) params.set("somVeileder", "1");
  params.set("retur", retur);
  return `${href}${href.includes("?") ? "&" : "?"}${params.toString()}`;
}

// Bruker-siden (/minaktivitetsplan) som videreformidler veileder-konteksten til underlenker.
export function brukerSideHref(searchParams: URLSearchParams): string {
  const retur = trygtRetur(searchParams.get("retur"));
  return retur && searchParams.get("somVeileder") === "1" ? medRetur("/minaktivitetsplan", retur, true) : "/minaktivitetsplan";
}
