export interface Merkelapp {
  tekst: string;
  variant: "error" | "neutral" | "warning" | "info";
}

export interface Bruker {
  id: string;
  navn: string;
  fnr: string;
  veileder: string;
  utlopsdato: string;
  status: string;
  merkelapper: Merkelapp[];
}

// Testdata: fiktive navn bygget som ord-kombinasjoner (substantiv, adjektiv).
// Fnr-verdiene har dag-del "00" — ugyldig i alle norske nummersystemer.
// Merkelapper er hentet fra etiketter.tsx i veilarbvisittkortfs.
export const brukere: Bruker[] = [
  {
    id: "1",
    navn: "Kunnskap, Fattig",
    fnr: "00010112345",
    veileder: "Vidde, Rolig",
    utlopsdato: "12.07.2026",
    status: "Ikke lengre arbeidssøker",
    merkelapper: [
      { tekst: "Arbeidssøkerperiode avsluttet: Ikke levert bekreftelse", variant: "warning" },
      { tekst: "Manuell oppfølging", variant: "warning" },
      { tekst: "Trenger oppfølgingsvedtak § 14 a", variant: "info" },
    ],
  },
  {
    id: "2",
    navn: "Avstand, Oversiktlig",
    fnr: "00020123456",
    veileder: "Retning, Stødig",
    utlopsdato: "03.08.2026",
    status: "Ikke lengre arbeidssøker",
    merkelapper: [
      { tekst: "Skjermet", variant: "error" },
      { tekst: "Kode 6", variant: "error" },
      { tekst: "Vergemål", variant: "warning" },
      { tekst: "Varsel", variant: "warning" },
    ],
  },
  {
    id: "3",
    navn: "Utsikt, Stille",
    fnr: "00030134567",
    veileder: "Vidde, Rolig",
    utlopsdato: "19.06.2026",
    status: "Ikke lengre arbeidssøker",
    merkelapper: [
      { tekst: "Sykmeldt", variant: "info" },
      { tekst: "Reservert KRR", variant: "warning" },
      { tekst: "I Arbeidssøkerregisteret", variant: "info" },
    ],
  },
  {
    id: "4",
    navn: "Balanse, Skarp",
    fnr: "00040145678",
    veileder: "Utvikling, Klar",
    utlopsdato: "28.07.2026",
    status: "Ikke lengre arbeidssøker",
    merkelapper: [
      { tekst: "Antatt gode muligheter", variant: "info" },
      { tekst: "KVP", variant: "warning" },
      { tekst: "Fullmakt Oppfølging", variant: "warning" },
      { tekst: "Behov for AEV", variant: "info" },
    ],
  },
  {
    id: "5",
    navn: "Rutine, Åpen",
    fnr: "00050156789",
    veileder: "Retning, Stødig",
    utlopsdato: "15.09.2026",
    status: "Ikke lengre arbeidssøker",
    merkelapper: [
      { tekst: "Oppgitt hindringer", variant: "info" },
      { tekst: "Språktolk", variant: "warning" },
      { tekst: "Ikke under oppfølging", variant: "warning" },
    ],
  },
];
