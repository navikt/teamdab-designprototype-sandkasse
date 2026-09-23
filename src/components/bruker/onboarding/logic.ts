import { Svar, Alternativ } from "./types";
import {
  AKTIVITETER_BEHOLD_JOBB,
  AKTIVITETER_FINN_JOBB,
  AKTIVITETER_IKKE_KLAR,
  AKTIVITETER_USIKKER,
  AKTIVITET_VEILEDER_FALLBACK,
  IKKE_KLAR_FOKUS_ALTERNATIVER,
  INTERESSE_ALTERNATIVER,
} from "./data";

// Måltekster for "behold-jobb"-oppfølgingen skiller seg fra alternativ-teksten (som er formulert som et tema, ikke et mål).
const BEHOLD_JOBB_MAL: Record<string, string> = {
  tilrettelegging: "Få jobben tilpasset slik at jeg kan stå i den",
  helse: "Få helsa til å fungere bedre sammen med jobben",
  "dialog-arbeidsgiver": "Snakke bedre med sjefen min om hvordan det går",
  veileder: "Sette et relevant mål sammen med veilederen min",
};

// Måltekster for "usikker"-oppfølgingen, formulert som mål i stedet for tema.
const USIKKER_MAL: Record<string, string> = {
  "jobber-passer": "Finne en jobbretning som passer kompetansen min",
  "erfaring-kompetanse": "Finne ut hvilke jobber erfaringen min kan brukes i",
  "klar-na": "Finne ut hva som skal til for at jobb kan bli mulig",
  "hvor-mye": "Finne ut hvor mye det kan være realistisk for meg å jobbe",
  "vet-ikke": "Sette et relevant mål sammen med veilederen min",
};

function tekstForValgte(ider: string[] | undefined, alternativer: Alternativ[], eksklusivId: string): string[] {
  if (!ider || ider.length === 0 || ider.includes(eksklusivId)) return [];
  return ider
    .map((id) => alternativer.find((a) => a.id === id)?.tekst.toLowerCase())
    .filter((tekst): tekst is string => Boolean(tekst));
}

// Alle fire situasjonsgrener følger samme mønster: situasjon → ett fokusspørsmål → mål → aktivitet.
// Måltekst og aktivitetsforslag slås opp direkte på fokus-svaret — ingen skjult "spor"-klassifisering.
export function beregnMal(svar: Svar): string {
  switch (svar.situasjonId) {
    case "finn-jobb": {
      // Parentes i stedet for å veve yrket inn i setningen — "innen {yrke}" blir dårlig
      // norsk når svaret er et yrkessubstantiv ("snekker") i stedet for et fagfelt ("helse").
      const yrkeTillegg = svar.yrke ? ` (${svar.yrke})` : "";
      switch (svar.finnJobbFokusId) {
        case "vet-hva":
          return `Finne en jobb${yrkeTillegg}`;
        case "usikker-retning": {
          const interesser = tekstForValgte(svar.interesseIder, INTERESSE_ALTERNATIVER, "vet-ikke");
          const tillegg = interesser.length > 0 ? `, med utgangspunkt i ${interesser.join(" og ")}` : "";
          return `Finne en jobbretning som passer meg${tillegg}`;
        }
        case "mangler-kvalifikasjoner":
          return svar.yrke
            ? `Bli kvalifisert for jobb${yrkeTillegg}`
            : "Skaffe relevant erfaring innen et valgt arbeidsområde";
        case "annet":
          return svar.finnJobbAnnetTekst?.trim() || "Finne ut hva som er realistisk for meg";
        case "veileder":
          return "Sette et relevant mål sammen med veilederen min";
        default:
          return "Finne ut hva som er realistisk for meg";
      }
    }
    case "behold-jobb": {
      if (svar.beholdJobbFokusId === "annet" && svar.beholdJobbAnnetTekst?.trim()) {
        return svar.beholdJobbAnnetTekst.trim();
      }
      return BEHOLD_JOBB_MAL[svar.beholdJobbFokusId ?? ""] ?? "Beholde jobben jeg har";
    }
    case "ikke-klar": {
      if (svar.ikkeKlarFokusId === "annet" && svar.ikkeKlarAnnetTekst?.trim()) {
        return svar.ikkeKlarAnnetTekst.trim();
      }
      const valgt = IKKE_KLAR_FOKUS_ALTERNATIVER.find((a) => a.id === svar.ikkeKlarFokusId);
      return valgt?.tekst ?? "Finne ut hva som er realistisk for meg";
    }
    case "usikker":
      return USIKKER_MAL[svar.usikkerFokusId ?? ""] ?? "Finne ut hva som er realistisk for meg";
    default:
      return "";
  }
}

export function beregnAktiviteter(svar: Svar): Alternativ[] {
  switch (svar.situasjonId) {
    case "finn-jobb":
      return AKTIVITETER_FINN_JOBB[svar.finnJobbFokusId ?? ""] ?? AKTIVITET_VEILEDER_FALLBACK;
    case "behold-jobb":
      return AKTIVITETER_BEHOLD_JOBB[svar.beholdJobbFokusId ?? ""] ?? AKTIVITET_VEILEDER_FALLBACK;
    case "ikke-klar":
      return AKTIVITETER_IKKE_KLAR[svar.ikkeKlarFokusId ?? ""] ?? AKTIVITET_VEILEDER_FALLBACK;
    case "usikker":
      return AKTIVITETER_USIKKER[svar.usikkerFokusId ?? ""] ?? AKTIVITET_VEILEDER_FALLBACK;
    default:
      return [];
  }
}
