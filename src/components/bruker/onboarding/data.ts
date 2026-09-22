import { Alternativ, SporId } from "./types";

export const SITUASJON_ALTERNATIVER: Alternativ[] = [
  { id: "finn-jobb", tekst: "Jeg vil finne meg en jobb" },
  { id: "behold-jobb", tekst: "Jeg har jobb, men trenger hjelp til å bli værende i den" },
  { id: "ikke-klar", tekst: "Jeg er ikke klar for jobb akkurat nå" },
  { id: "usikker", tekst: "Jeg er usikker på hva som passer" },
];

export const RETNING_ALTERNATIVER: Alternativ[] = [
  { id: "vet", tekst: "Ja" },
  { id: "trenger-hjelp", tekst: "Nei" },
];

export const ERFARING_ALTERNATIVER: Alternativ[] = [
  { id: "relevant", tekst: "Jeg har relevant erfaring eller utdanning" },
  { id: "noe", tekst: "Jeg har noe erfaring eller kompetanse som kan brukes" },
  { id: "mangler", tekst: "Jeg mangler erfaring eller kvalifikasjoner" },
  { id: "vet-ikke", tekst: "Jeg vet ikke hva som kreves" },
];

export const IKKE_KLAR_FOKUS_ALTERNATIVER: Alternativ[] = [
  { id: "livssituasjon", tekst: "Mestre en vanskelig livssituasjon bedre" },
  { id: "helse", tekst: "Styrke helsen og funksjonsevnen min" },
  { id: "kunnskap", tekst: "Bygge mer kunnskap og erfaring" },
  { id: "utforske", tekst: "Utforske hvilken type arbeid som kan passe for meg" },
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

export const AKTIVITETER_PER_SPOR: Record<SporId, Alternativ[]> = {
  spor_a_jobb_realistisk_na: [
    { id: "oppdater-cv", tekst: "Oppdatere CV" },
    { id: "tilpass-cv", tekst: "Tilpasse CV til ønsket stilling" },
    { id: "soke-stillinger", tekst: "Søke på aktuelle stillinger" },
  ],
  spor_b_styrke_jobbmuligheter: [
    { id: "kartlegge-kompetanse", tekst: "Kartlegge kompetansen min" },
    { id: "undersoke-krav", tekst: "Undersøke kravene til aktuelle jobber" },
    { id: "undersoke-kurs", tekst: "Undersøke relevante kurs" },
  ],
  spor_c_naermere_realistisk_jobbmal: [
    { id: "kartlegge-situasjon", tekst: "Få bedre oversikt over situasjonen min" },
    { id: "helseopplysninger", tekst: "Gi opplysninger om medisinsk behandling" },
  ],
  eksisterende_jobb_beholde: [
    { id: "snakk-arbeidsgiver", tekst: "Snakke med arbeidsgiver om tilrettelegging" },
  ],
};
