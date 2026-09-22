import { SporId, Svar, Alternativ } from "./types";
import { IKKE_KLAR_FOKUS_ALTERNATIVER, INTERESSE_ALTERNATIVER } from "./data";

// Måltekster for "behold-jobb"-oppfølgingen skiller seg fra alternativ-teksten (som er formulert som et tema, ikke et mål).
const BEHOLD_JOBB_MAL: Record<string, string> = {
  tilrettelegging: "Få på plass bedre tilrettelegging i jobben min",
  helse: "Håndtere helseutfordringen min slik at jeg kan bli i jobb",
  "dialog-arbeidsgiver": "Få en bedre dialog med arbeidsgiveren min om situasjonen min",
  veileder: "Sette et relevant mål sammen med veilederen min",
};

// Delt logikk for spørsmålet "Hva er du mest usikker på?", som både brukes når
// brukeren starter i "usikker"-situasjonen og når "finn-jobb" ikke gir en jobbretning.
function sporFraUsikkerFokus(svar: Svar): SporId | undefined {
  switch (svar.usikkerFokusId) {
    case "jobber-passer":
    case "erfaring-kompetanse":
      return "spor_b_styrke_jobbmuligheter";
    default:
      return "spor_c_naermere_realistisk_jobbmal";
  }
}

export function beregnSpor(svar: Svar): SporId | undefined {
  switch (svar.situasjonId) {
    case "finn-jobb": {
      // "Trenger hjelp til å finne ut hvilke jobber som kan passe" gir alltid spor B.
      // Avklaringsspørsmålene her er kun til hjelp for mål/veileder, ikke sporvalg.
      if (svar.retningId === "trenger-hjelp") return "spor_b_styrke_jobbmuligheter";
      if (svar.erfaringId === "mangler" || svar.erfaringId === "vet-ikke") {
        return "spor_b_styrke_jobbmuligheter";
      }
      return "spor_a_jobb_realistisk_na";
    }
    case "behold-jobb":
      return "eksisterende_jobb_beholde";
    case "ikke-klar":
      return "spor_c_naermere_realistisk_jobbmal";
    case "usikker":
      return sporFraUsikkerFokus(svar);
    default:
      return undefined;
  }
}

function tekstForValgte(ider: string[] | undefined, alternativer: Alternativ[], eksklusivId: string): string[] {
  if (!ider || ider.length === 0 || ider.includes(eksklusivId)) return [];
  return ider
    .map((id) => alternativer.find((a) => a.id === id)?.tekst.toLowerCase())
    .filter((tekst): tekst is string => Boolean(tekst));
}

export function beregnMal(svar: Svar, spor: SporId): string {
  switch (spor) {
    case "spor_a_jobb_realistisk_na": {
      const retningTillegg = svar.yrke ? ` innen ${svar.yrke}` : "";
      return `Finne en jobb${retningTillegg}`;
    }
    case "spor_b_styrke_jobbmuligheter": {
      if (svar.retningId === "trenger-hjelp") {
        const interesser = tekstForValgte(svar.interesseIder, INTERESSE_ALTERNATIVER, "vet-ikke");
        const tillegg = interesser.length > 0 ? `, med utgangspunkt i ${interesser.join(" og ")}` : "";
        return `Finne en jobbretning som passer meg${tillegg}`;
      }
      if (svar.usikkerFokusId === "jobber-passer") return "Finne en jobbretning som passer kompetansen min";
      if (svar.usikkerFokusId === "erfaring-kompetanse") return "Finne ut hvilke jobber erfaringen min kan brukes i";
      if (svar.yrke) return `Bli kvalifisert for jobb innen ${svar.yrke}`;
      return "Skaffe relevant erfaring innen et valgt arbeidsområde";
    }
    case "spor_c_naermere_realistisk_jobbmal": {
      if (svar.usikkerFokusId === "hvor-mye") return "Finne ut hvor mye det kan være realistisk for meg å jobbe";
      if (svar.usikkerFokusId === "vet-ikke") return "Sette et relevant mål sammen med veilederen min";
      if (svar.usikkerFokusId === "klar-na") return "Finne ut hva som skal til for at jobb kan bli mulig";
      if (svar.situasjonId === "ikke-klar") {
        if (svar.ikkeKlarFokusId === "annet" && svar.ikkeKlarAnnetTekst?.trim()) {
          return svar.ikkeKlarAnnetTekst.trim();
        }
        const valgt = IKKE_KLAR_FOKUS_ALTERNATIVER.find((a) => a.id === svar.ikkeKlarFokusId);
        if (valgt) return valgt.tekst;
      }
      return "Finne ut hva som er realistisk for meg";
    }
    case "eksisterende_jobb_beholde": {
      if (svar.beholdJobbFokusId === "annet" && svar.beholdJobbAnnetTekst?.trim()) {
        return svar.beholdJobbAnnetTekst.trim();
      }
      return BEHOLD_JOBB_MAL[svar.beholdJobbFokusId ?? ""] ?? "Beholde jobben jeg har";
    }
    default:
      return "";
  }
}
