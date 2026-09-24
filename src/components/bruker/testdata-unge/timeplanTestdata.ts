export type TimeplanFarge = "info" | "success" | "warning" | "danger" | "meta-purple" | "meta-lime" | "brand-magenta";

export interface TimeplanAktivitet {
  id: string;
  tittel: string;
  sted?: string;
  beskrivelse?: string;
  // 1 = mandag ... 5 = fredag
  ukedagFra: number;
  ukedagTil: number;
  // Heltimer i 24-timersformat, f.eks. 8 og 16 for kl. 08.00–16.00
  timeFra: number;
  timeTil: number;
  farge: TimeplanFarge;
}

// Frikoblet testdata for unge: fast ukeplan for en bruker i Navs ungdomsprogram,
// med faste oppmøtetider kl. 08–16 hver ukedag. Ikke koblet til aktivitetsplanens kort/liste-data.
export const testdataUngeTimeplan: TimeplanAktivitet[] = [
  {
    id: "up-1",
    tittel: "Fellessamling",
    sted: "Møterom Nord",
    beskrivelse: "Felles oppstart av dagen med informasjon og oppmøteregistrering.",
    ukedagFra: 1,
    ukedagTil: 1,
    timeFra: 8,
    timeTil: 9,
    farge: "info",
  },
  {
    id: "up-2",
    tittel: "Norsk og samfunnsfag",
    sted: "Undervisningsrom 2",
    beskrivelse: "Undervisning i norsk og samfunnsfag, tilpasset egen læreplan.",
    ukedagFra: 1,
    ukedagTil: 2,
    timeFra: 9,
    timeTil: 12,
    farge: "meta-purple",
  },
  {
    id: "up-3",
    tittel: "Lunsj",
    beskrivelse: "Felles lunsjpause hver dag.",
    ukedagFra: 1,
    ukedagTil: 5,
    timeFra: 12,
    timeTil: 13,
    farge: "meta-lime",
  },
  {
    id: "up-4",
    tittel: "Verksted og praktisk arbeid",
    sted: "Verkstedhall",
    beskrivelse: "Praktisk arbeid i verksted, under veiledning.",
    ukedagFra: 1,
    ukedagTil: 3,
    timeFra: 13,
    timeTil: 16,
    farge: "success",
  },
  {
    id: "up-5",
    tittel: "Individuell oppfølging med veileder",
    sted: "Samtalerom 1",
    beskrivelse: "Samtale med veileder om fremgang og videre planer.",
    ukedagFra: 4,
    ukedagTil: 4,
    timeFra: 9,
    timeTil: 10,
    farge: "warning",
  },
  {
    id: "up-6",
    tittel: "Jobbsøkerkurs",
    sted: "Undervisningsrom 1",
    beskrivelse: "Kurs i CV-skriving, søknader og intervjuteknikk.",
    ukedagFra: 4,
    ukedagTil: 4,
    timeFra: 10,
    timeTil: 12,
    farge: "brand-magenta",
  },
  {
    id: "up-7",
    tittel: "Fysisk aktivitet",
    sted: "Gymsal",
    beskrivelse: "Felles fysisk aktivitet for å fremme trivsel og helse.",
    ukedagFra: 4,
    ukedagTil: 4,
    timeFra: 13,
    timeTil: 15,
    farge: "danger",
  },
  {
    id: "up-8",
    tittel: "Praksis hos bedrift",
    sted: "Ekstern arbeidsgiver",
    beskrivelse: "Arbeidspraksis hos ekstern arbeidsgiver, en dag i uken.",
    ukedagFra: 5,
    ukedagTil: 5,
    timeFra: 8,
    timeTil: 15,
    farge: "info",
  },
  {
    id: "up-9",
    tittel: "Oppsummering av uken",
    sted: "Møterom Nord",
    beskrivelse: "Felles oppsummering av uken som har vært.",
    ukedagFra: 5,
    ukedagTil: 5,
    timeFra: 15,
    timeTil: 16,
    farge: "success",
  },
];
