export interface Merkelapp {
  tekst: string;
  variant: "error" | "neutral" | "warning" | "info";
}

export interface Bruker {
  id: string;
  navn: string;
  fnr: string;
  oppfolgingStartet: string;
  dagerTilAvslutning: number;
  veileder: string;
  status: string;
  statusVariant?: "danger" | "neutral" | "warning" | "info";
  merkelapper: Merkelapp[];
}

// Testdata: fiktive navn bygget som ord-kombinasjoner (substantiv, adjektiv).
// Fnr-verdiene har dag-del "00" — ugyldig i alle norske nummersystemer.
// Merkelapper er hentet fra etiketter.tsx i veilarbvisittkortfs.

export const avsluttForlengBrukere: Bruker[] = [
  {
    id: "a1",
    navn: "Horisont, Myk",
    fnr: "00060167890",
    oppfolgingStartet: "02.02.2023",
    dagerTilAvslutning: 23,
    veileder: "Vidde, Rolig",
    status: "Arbeidssøkerperiode avsluttet: Ikke levert bekreftelse",
    statusVariant: "warning",
    merkelapper: [
      { tekst: "Antatt gode muligheter", variant: "info" },
    ],
  },
  {
    id: "a2",
    navn: "Terreng, Lystig",
    fnr: "00070178901",
    oppfolgingStartet: "14.05.2024",
    dagerTilAvslutning: 26,
    veileder: "Retning, Stødig",
    status: "Arbeidssøkerperiode avsluttet: Svarte nei i bekreftelse",
    statusVariant: "warning",
    merkelapper: [
      { tekst: "Antatt gode muligheter", variant: "info" },
    ],
  },
  {
    id: "a3",
    navn: "Grense, Romslig",
    fnr: "00080189012",
    oppfolgingStartet: "30.09.2022",
    dagerTilAvslutning: 28,
    veileder: "Utvikling, Klar",
    status: "Arbeidssøkerperiode avsluttet",
    statusVariant: "warning",
    merkelapper: [
      { tekst: "Språktolk", variant: "warning" },
    ],
  },
  {
    id: "a4",
    navn: "Fjellet, Tydelig",
    fnr: "00090190123",
    oppfolgingStartet: "11.07.2023",
    dagerTilAvslutning: 25,
    veileder: "Vidde, Rolig",
    status: "Arbeidssøkerperiode avsluttet av bruker",
    statusVariant: "warning",
    merkelapper: [
      { tekst: "Manuell oppfølging", variant: "warning" },
      { tekst: "Språktolk", variant: "warning" },
    ],
  },
  {
    id: "a5",
    navn: "Kilde, Frimodig",
    fnr: "00100201234",
    oppfolgingStartet: "19.03.2025",
    dagerTilAvslutning: 24,
    veileder: "Retning, Stødig",
    status: "Arbeidssøkerperiode avsluttet av veileder",
    statusVariant: "warning",
    merkelapper: [
      { tekst: "Ikke under oppfølging", variant: "info" },
    ],
  },
  {
    id: "a6",
    navn: "Drops, Blandet",
    fnr: "00100201235",
    oppfolgingStartet: "19.03.2025",
    dagerTilAvslutning: 24,
    veileder: "Retning, Stødig",
    status: "Arbeidssøkerperiode avsluttet av system",
    statusVariant: "warning",
    merkelapper: [
      { tekst: "Antatt gode muligheter", variant: "info" },
    ],
  },
  {
    id: "a7",
    navn: "Elveleie, Stille",
    fnr: "00110212346",
    oppfolgingStartet: "08.11.2024",
    dagerTilAvslutning: 27,
    veileder: "Utvikling, Klar",
    status: "Arbeidssøkerperiode avsluttet (ukjent årsak)",
    statusVariant: "warning",
    merkelapper: [],
  },
];

export const brukere: Bruker[] = [
  {
    id: "1",
    navn: "Kunnskap, Fattig",
    fnr: "00010112345",
    oppfolgingStartet: "14.03.2024",
    dagerTilAvslutning: 27,
    veileder: "Vidde, Rolig",
    status: "Ikke lenger i arbeidssøkerregister",
    merkelapper: [
      { tekst: "Arbeidssøkerperiode avsluttet: Ikke levert bekreftelse", variant: "warning" },
    ],
  },
  {
    id: "2",
    navn: "Avstand, Oversiktlig",
    fnr: "00020123456",
    oppfolgingStartet: "07.09.2023",
    dagerTilAvslutning: 24,
    veileder: "Retning, Stødig",
    status: "Ikke lenger i arbeidssøkerregister",
    merkelapper: [
      { tekst: "Arbeidssøkerperiode avsluttet: Ikke levert bekreftelse", variant: "warning" },
      { tekst: "Antatt gode muligheter", variant: "info" },
    ],
  },
  {
    id: "3",
    navn: "Utsikt, Stille",
    fnr: "00030134567",
    oppfolgingStartet: "22.11.2024",
    dagerTilAvslutning: 23,
    veileder: "Vidde, Rolig",
    status: "Ikke lenger i arbeidssøkerregister",
    merkelapper: [
      { tekst: "Arbeidssøkerperiode avsluttet: Ikke levert bekreftelse", variant: "warning" },
      { tekst: "Språktolk", variant: "warning" },
    ],
  },
  {
    id: "4",
    navn: "Balanse, Skarp",
    fnr: "00040145678",
    oppfolgingStartet: "05.06.2025",
    dagerTilAvslutning: 26,
    veileder: "Utvikling, Klar",
    status: "Ikke lenger i arbeidssøkerregister",
    merkelapper: [
      { tekst: "Arbeidssøkerperiode avsluttet: Ikke levert bekreftelse", variant: "warning" },
      { tekst: "Antatt gode muligheter", variant: "info" },
    ],
  },
  {
    id: "5",
    navn: "Rutine, Åpen",
    fnr: "00050156789",
    oppfolgingStartet: "18.01.2025",
    dagerTilAvslutning: 28,
    veileder: "Retning, Stødig",
    status: "Ikke lenger i arbeidssøkerregister",
    merkelapper: [
      { tekst: "Arbeidssøkerperiode avsluttet: Ikke levert bekreftelse", variant: "warning" },
      { tekst: "Antatt gode muligheter", variant: "info" },
    ],
  },
];
