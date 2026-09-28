import { AktivitetsKort } from "./types";

// Datoene for planlegger-/gjennomfører-aktivitetene under regnes ut fra dagens dato,
// slik at øverste kort i lista alltid trigger "Starter snart" (jf. SNART_TERSKEL_DAGER i sortering.ts)
// og de andre ikke gjør det — uavhengig av når prototypen kjøres.
function datoOmDager(dager: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + dager);
  return d;
}

function isoDato(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function lagInitialKort(): AktivitetsKort[] {
  return [
  // --- Forslag ---
  {
    id: "1",
    kolonne: "forslag",
    type: "Jobbrettet egenaktivitet",
    title: "Oppdatere CV og søknadstekst",
    startDato: "2026-10-01",
    sluttDato: "2026-10-14",
    tags: ["ulest"],
    hasBlueDot: true,
    beskrivelse: "Sett av tid til å oppdatere CV og søknadstekst før du søker jobb.",
  },
  {
    id: "forslag-2",
    kolonne: "forslag",
    type: "Stilling",
    title: "Søke på stilling som elektriker",
    startDato: isoDato(datoOmDager(0)),
    tags: ["ulest"],
    hasBlueDot: true,
    arbeidsgiver: "Arbeidsgiver",
    frist: "1. okt 2026",
    beskrivelse: "Søk på en aktuell stilling som elektriker.",
  },
  // --- Planlegger ---
  {
    id: "2",
    kolonne: "planlegger",
    type: "Jobbrettet egenaktivitet",
    title: "Oppdatere CV og LinkedIn-profil",
    startDato: isoDato(datoOmDager(3)),
    sluttDato: isoDato(datoOmDager(10)),
    tags: [],
    mal: "Ha en oppdatert CV klar til bruk i søknader som elektriker.",
    huskeliste: "Legg til fagbrev og relevant erfaring, sjekk kontaktinfo.",
    beskrivelse: "Sette av tid til å gå gjennom og oppdatere CV og profil rettet mot elektrikerbransjen.",
    lenke: "www.nav.no/cv-og-jobbprofil",
  },
  {
    id: "3",
    kolonne: "planlegger",
    type: "Jobbrettet egenaktivitet",
    title: "Kartlegge aktuelle arbeidsgivere innen elektrofaget",
    startDato: isoDato(datoOmDager(21)),
    sluttDato: isoDato(datoOmDager(35)),
    tags: [],
    beskrivelse: "Undersøke hvilke bedrifter som er aktuelle å søke jobb hos når du er klar for det.",
  },
  {
    id: "13",
    kolonne: "planlegger",
    type: "Møte med Nav",
    title: "Avklaringssamtale",
    startDato: isoDato(datoOmDager(4)),
    klokkeslett: "13:00",
    tags: [],
    moteform: "Telefonmøte",
    varighet: "15 minutter",
    hensikt: "Avklare videre oppfølging.",
  },
  // --- Gjennomfører ---
  {
    id: "4",
    kolonne: "gjennomforer",
    type: "Behandling",
    title: "Oppfølging hos behandler",
    startDato: isoDato(datoOmDager(10)),
    sluttDato: isoDato(datoOmDager(40)),
    tags: ["venter-pa-kontakt"],
    behandlingstype: "Fysioterapi",
    behandlingssted: "Behandler",
    mal: "Redusere smerter og bedre bevegelighet slik at du kan stå i arbeid som elektriker.",
    oppfolgingFraNav: "Nav følger opp etter endt behandling.",
  },
  {
    id: "5",
    kolonne: "gjennomforer",
    type: "Tiltak gjennom Nav",
    title: "Oppdateringskurs for elektrikere og telekommunikasjonsmontører",
    startDato: isoDato(datoOmDager(14)),
    sluttDato: isoDato(datoOmDager(90)),
    tags: ["fatt-plass", "avtalt-med-nav"],
    arrangor: "Kursholder",
    deltakelseProsent: "100 %",
    dagerPerUke: "5",
    beskrivelse: "Oppdateringskurs for å friske opp fagkunnskap og komme tilbake i jobb som elektriker.",
  },
  // --- Fullført ---
  {
    id: "10",
    kolonne: "fullfort",
    type: "Stilling",
    title: "Assistent på SFO",
    startDato: "2026-03-01",
    sluttDato: "2026-03-01",
    tags: ["fatt-jobben"],
    arbeidsgiver: "Skole",
    arbeidssted: "Stavanger",
    beskrivelse: "Fikk tilbud om stilling som assistent på SFO.",
  },
  {
    id: "11",
    kolonne: "fullfort",
    type: "Jobbsøking",
    title: "Søke på 3 stillinger",
    startDato: "2026-06-01",
    sluttDato: "2026-06-07",
    extraLine: "Antall søknader i uken: 3",
    tags: ["cv-er-delt"],
  },
  {
    id: "12",
    kolonne: "fullfort",
    type: "Samtalereferat",
    title: "Oppfølgingssamtale",
    startDato: "2026-06-10",
    sluttDato: "2026-06-10",
    tags: [],
    samtalereferatData: {
      dato: "10. jun 2026",
      moteform: "Telefonmøte",
      referatTekst:
        "Vi hadde en god samtale om veien videre. Motivert for å søke stillinger innenfor ditt fagfelt.\n\nVi avtalte at du skal sende inn en søknad i løpet av neste uke.\n\nDu ønsker også bistand til å oppdatere CV-en din.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      erReferatPublisert: true,
    },
  },
  // --- Avbrutt ---
  {
    id: "14",
    kolonne: "avbrutt",
    type: "Arbeidstrening",
    title: "Arbeidstrening",
    startDato: "2026-04-01",
    sluttDato: "2026-04-30",
    tags: [],
    beskrivelse: "Arbeidstrening hos ekstern arbeidsgiver.",
    detaljRader: [
      { label: "Arrangør", verdi: "Tiltaksarrangør" },
      { label: "Stillingsprosent", verdi: "50 %" },
    ],
  },
  ];
}
