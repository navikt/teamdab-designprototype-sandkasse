import { Alternativ } from "./types";

export const SITUASJON_ALTERNATIVER: Alternativ[] = [
  { id: "finn-jobb", tekst: "Jeg vil finne meg en jobb" },
  { id: "behold-jobb", tekst: "Jeg har jobb, men trenger hjelp til å bli værende i den" },
  { id: "ikke-klar", tekst: "Jeg er ikke klar for jobb akkurat nå" },
  { id: "usikker", tekst: "Jeg er usikker på hva som passer" },
];

export const FINN_JOBB_FOKUS_ALTERNATIVER: Alternativ[] = [
  { id: "vet-hva", tekst: "Søke på en bestemt type jobb" },
  { id: "usikker-retning", tekst: "Jeg er usikker på hvilken retning eller bransje som passer for meg" },
  { id: "mangler-kvalifikasjoner", tekst: "Jeg mangler erfaring eller kvalifikasjoner for jobbene jeg vil ha" },
  { id: "annet", tekst: "Noe annet enn dette" },
  { id: "veileder", tekst: "Jeg vet ikke ennå – vil finne ut av dette sammen med veilederen min" },
];

export const IKKE_KLAR_FOKUS_ALTERNATIVER: Alternativ[] = [
  { id: "livssituasjon", tekst: "Mestre en vanskelig livssituasjon bedre" },
  { id: "helse", tekst: "Bli sterkere fysisk eller psykisk" },
  { id: "kunnskap", tekst: "Bygge mer kunnskap og erfaring" },
  { id: "utforske", tekst: "Utforske hvilken type arbeid som kan passe for meg" },
  { id: "annet", tekst: "Noe annet enn dette" },
  { id: "veileder", tekst: "Jeg vet ikke ennå – vil finne ut av dette sammen med veilederen min" },
];

export const BEHOLD_JOBB_FOKUS_ALTERNATIVER: Alternativ[] = [
  { id: "tilrettelegging", tekst: "Få jobben tilpasset, for eksempel arbeidstid, oppgaver eller utstyr" },
  { id: "helse", tekst: "Få helsa til å fungere bedre sammen med jobben" },
  { id: "dialog-arbeidsgiver", tekst: "Snakke bedre med sjefen min om hvordan det går" },
  { id: "annet", tekst: "Noe annet enn dette" },
  { id: "veileder", tekst: "Jeg vet ikke ennå – vil finne ut av dette sammen med veilederen min" },
];

export const USIKKER_FOKUS_ALTERNATIVER: Alternativ[] = [
  { id: "jobber-passer", tekst: "Hvilke jobber som kan passe for meg" },
  { id: "erfaring-kompetanse", tekst: "Om jeg har erfaringen eller kompetansen jeg trenger" },
  { id: "klar-na", tekst: "Om jeg er klar for å jobbe nå" },
  { id: "hvor-mye", tekst: "Hvor mye jeg kan jobbe" },
  { id: "vet-ikke", tekst: "Jeg vet ikke ennå" },
];

export const INTERESSE_ALTERNATIVER: Alternativ[] = [
  { id: "mennesker", tekst: "Jobbe med mennesker" },
  { id: "praktisk", tekst: "Jobbe praktisk eller med hendene" },
  { id: "data-tall", tekst: "Jobbe med data, tall eller systemer" },
  { id: "utendors", tekst: "Jobbe utendørs eller fysisk aktivt" },
  { id: "skape", tekst: "Skape eller lage noe" },
  { id: "vet-ikke", tekst: "Vet ikke ennå" },
];

// Generisk fallback når fokus-svaret er "annet" eller "veileder" — det finnes ikke et konkret forslag å gi ennå.
export const AKTIVITET_VEILEDER_FALLBACK: Alternativ[] = [
  { id: "snakk-veileder", tekst: "Snakke med veileder om neste steg" },
];

export const AKTIVITETER_FINN_JOBB: Record<string, Alternativ[]> = {
  "vet-hva": [
    { id: "oppdater-cv", tekst: "Oppdatere CV" },
    { id: "tilpass-cv", tekst: "Tilpasse CV til ønsket stilling" },
    { id: "soke-stillinger", tekst: "Søke på aktuelle stillinger" },
  ],
  "usikker-retning": [
    { id: "kartlegge-kompetanse", tekst: "Kartlegge kompetansen min" },
    { id: "undersoke-krav", tekst: "Undersøke kravene til aktuelle jobber" },
    { id: "undersoke-kurs", tekst: "Undersøke relevante kurs" },
  ],
  "mangler-kvalifikasjoner": [
    { id: "undersoke-kurs", tekst: "Undersøke relevante kurs" },
    { id: "undersoke-krav", tekst: "Undersøke kravene til aktuelle jobber" },
    { id: "kartlegge-kompetanse", tekst: "Kartlegge kompetansen min" },
  ],
};

export const AKTIVITETER_IKKE_KLAR: Record<string, Alternativ[]> = {
  livssituasjon: [
    { id: "snakk-veileder-situasjon", tekst: "Snakke med veileder om situasjonen min" },
    { id: "undersoke-stotte", tekst: "Undersøke hvilken hjelp eller støtte som finnes" },
  ],
  helse: [
    { id: "helseopplysninger", tekst: "Gi opplysninger om medisinsk behandling" },
    { id: "snakk-behandler", tekst: "Snakke med lege eller behandler om arbeidsevnen min" },
  ],
  kunnskap: [
    { id: "undersoke-kurs", tekst: "Undersøke relevante kurs" },
    { id: "kartlegge-kompetanse", tekst: "Kartlegge kompetansen min" },
  ],
  utforske: [
    { id: "prove-praksis", tekst: "Prøve ut en arbeidsrettet aktivitet eller praksisplass" },
    { id: "snakk-veileder-yrker", tekst: "Snakke med veileder om aktuelle yrker" },
  ],
};

export const AKTIVITETER_BEHOLD_JOBB: Record<string, Alternativ[]> = {
  tilrettelegging: [
    { id: "snakk-arbeidsgiver-tilrettelegging", tekst: "Snakke med arbeidsgiver om tilrettelegging" },
    { id: "undersoke-rettigheter", tekst: "Undersøke rettigheter til tilrettelegging" },
  ],
  helse: [
    { id: "helseopplysninger", tekst: "Gi opplysninger om medisinsk behandling" },
    { id: "snakk-behandler", tekst: "Snakke med lege eller behandler om arbeidsevnen min" },
  ],
  "dialog-arbeidsgiver": [
    { id: "avtale-samtale", tekst: "Avtale samtale med arbeidsgiver om situasjonen" },
    { id: "forberede-samtale", tekst: "Forberede hva jeg vil ta opp med arbeidsgiver" },
  ],
};

export const AKTIVITETER_USIKKER: Record<string, Alternativ[]> = {
  "jobber-passer": [
    { id: "kartlegge-kompetanse", tekst: "Kartlegge kompetansen min" },
    { id: "undersoke-krav", tekst: "Undersøke kravene til aktuelle jobber" },
  ],
  "erfaring-kompetanse": [
    { id: "kartlegge-kompetanse", tekst: "Kartlegge kompetansen min" },
    { id: "undersoke-krav", tekst: "Undersøke kravene til aktuelle jobber" },
  ],
  "klar-na": [
    { id: "kartlegge-situasjon", tekst: "Få bedre oversikt over situasjonen min" },
  ],
  "hvor-mye": [
    { id: "kartlegge-situasjon", tekst: "Få bedre oversikt over situasjonen min" },
  ],
};
