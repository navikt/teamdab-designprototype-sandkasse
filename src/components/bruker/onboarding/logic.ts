import { SporId, Svar } from "./types";

// Delt logikk for spørsmålet "Hva er du mest usikker på?", som både brukes når
// brukeren starter i "usikker"-situasjonen og når "finn-jobb" ikke gir en jobbretning.
function sporFraUsikkerFokus(svar: Svar): SporId | undefined {
  switch (svar.usikkerFokusId) {
    case "jobber-passer":
    case "erfaring-kompetanse":
      return "spor_b_styrke_jobbmuligheter";
    case "eksisterende-jobb":
      if (svar.usikkerEksisterendeValgId === "behold") return "eksisterende_jobb_beholde";
      if (svar.usikkerEksisterendeValgId === "tilbake") return "eksisterende_jobb_tilbake";
      return undefined;
    default:
      return "spor_c_naermere_realistisk_jobbmal";
  }
}

export function beregnSpor(svar: Svar): SporId | undefined {
  switch (svar.situasjonId) {
    case "finn-jobb": {
      if (svar.retningId === "trenger-hjelp") return sporFraUsikkerFokus(svar);
      if (svar.omfangId === "usikker" && svar.omfangUsikkerhetId === "realistisk") {
        return "spor_c_naermere_realistisk_jobbmal";
      }
      if (svar.erfaringId === "mangler" || svar.erfaringId === "vet-ikke") {
        return "spor_b_styrke_jobbmuligheter";
      }
      return "spor_a_jobb_realistisk_na";
    }
    case "behold-jobb":
      return "eksisterende_jobb_beholde";
    case "tilbake-jobb":
      if (svar.tilbakeRetningId === "usikker-realistisk") return "spor_c_naermere_realistisk_jobbmal";
      return "eksisterende_jobb_tilbake";
    case "ikke-klar":
      return "spor_c_naermere_realistisk_jobbmal";
    case "usikker":
      return sporFraUsikkerFokus(svar);
    default:
      return undefined;
  }
}

function omfangTekst(omfangId?: string): string {
  if (omfangId === "heltid") return "heltidsjobb";
  if (omfangId === "deltid") return "deltidsjobb";
  return "jobb";
}

export function beregnMal(svar: Svar, spor: SporId): string {
  switch (spor) {
    case "spor_a_jobb_realistisk_na": {
      const retningTillegg = svar.yrke
        ? ` innen ${svar.yrke}`
        : svar.retningId === "vurderer"
          ? " innen ett av områdene jeg har valgt"
          : "";
      return `Finne en ${omfangTekst(svar.omfangId)}${retningTillegg}`;
    }
    case "spor_b_styrke_jobbmuligheter": {
      if (svar.usikkerFokusId === "jobber-passer") return "Finne en jobbretning som passer kompetansen min";
      if (svar.usikkerFokusId === "erfaring-kompetanse") return "Finne ut hvilke jobber erfaringen min kan brukes i";
      if (svar.retningId === "trenger-hjelp") return "Finne en jobbretning som passer kompetansen min";
      if (svar.yrke) return `Bli kvalifisert for jobb innen ${svar.yrke}`;
      return "Skaffe relevant erfaring innen et valgt arbeidsområde";
    }
    case "spor_c_naermere_realistisk_jobbmal": {
      if (svar.usikkerFokusId === "hvor-mye") return "Finne ut hvor mye det kan være realistisk for meg å jobbe";
      if (svar.usikkerFokusId === "vet-ikke") return "Sette et relevant mål sammen med veilederen min";
      if (svar.usikkerFokusId === "klar-na") return "Finne ut hva som skal til for at jobb kan bli mulig";
      if (svar.situasjonId === "finn-jobb") return "Finne ut hvor mye det er realistisk for meg å jobbe";
      if (svar.situasjonId === "tilbake-jobb") return "Finne ut om det er realistisk å komme tilbake til jobben";
      if (svar.situasjonId === "ikke-klar") {
        switch (svar.ikkeKlarFokusId) {
          case "hva-skal-til":
            return "Finne ut hva som skal til for at jobb kan bli mulig";
          case "hva-arbeid":
            return "Finne ut hva slags arbeid som kan være realistisk for meg";
          case "hvor-mye":
            return "Finne ut hvor mye det kan være realistisk for meg å jobbe";
          case "veileder":
            return "Sette et relevant mål sammen med veilederen min";
        }
      }
      return "Finne ut hva som er realistisk for meg";
    }
    case "eksisterende_jobb_beholde": {
      switch (svar.beholdOmfangId) {
        case "heltid":
          return "Beholde jobben og jobbe heltid";
        case "deltid":
          return "Beholde jobben og jobbe deltid";
        case "usikker":
          return svar.beholdUsikkerhetId === "realistisk"
            ? "Finne ut hvor mye det er realistisk for meg å jobbe i nåværende jobb"
            : "Beholde jobben jeg har";
        default:
          return "Beholde jobben jeg har";
      }
    }
    case "eksisterende_jobb_tilbake": {
      switch (svar.tilbakeRetningId) {
        case "like-mye":
          return "Komme tilbake til jobben og jobbe like mye som før";
        case "heltid":
          return "Komme tilbake til jobben på heltid";
        case "deltid":
          return "Komme tilbake til jobben på deltid";
        case "usikker-omfang":
          return "Finne ut hvor mye det er realistisk for meg å jobbe når jeg kommer tilbake";
        default:
          return "Komme tilbake til jobben jeg har";
      }
    }
    default:
      return "";
  }
}
