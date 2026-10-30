import { parseOppsett, lagringsPrefiks } from "./oppsett";

// Kjøres én gang når JS-en lastes, før noen komponent har lest localStorage.
// Lenker med ?nullstill=1 gir da ny start for oppsettet. Parameteren fjernes fra URL-en,
// slik at en omlasting ikke nullstiller på nytt.
export function nullstillVedOppstart() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (url.searchParams.get("nullstill") !== "1") return;

  const oppsett = parseOppsett(url.searchParams);
  const prefiks = lagringsPrefiks(oppsett.spor, oppsett.scenario);
  try {
    const nokler: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const nokkel = window.localStorage.key(i);
      if (nokkel?.startsWith(prefiks)) nokler.push(nokkel);
    }
    nokler.forEach((n) => window.localStorage.removeItem(n));
  } catch {
    // localStorage utilgjengelig (privat modus): ingenting å nullstille.
  }

  url.searchParams.delete("nullstill");
  window.history.replaceState(window.history.state, "", url.toString());
}
