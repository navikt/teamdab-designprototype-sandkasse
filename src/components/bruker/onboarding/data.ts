import { Alternativ, SporId } from "./types";

export const SITUASJON_ALTERNATIVER: Alternativ[] = [
  { id: "finn-jobb", tekst: "Jeg vil finne meg en jobb" },
  { id: "behold-jobb", tekst: "Jeg har jobb, men trenger hjelp til å bli værende i den" },
  { id: "tilbake-jobb", tekst: "Jeg har en jobb, men er borte fra den og ønsker å komme tilbake" },
  { id: "ikke-klar", tekst: "Jeg er ikke klar for jobb akkurat nå" },
  { id: "usikker", tekst: "Jeg er usikker på hva som passer" },
];

export const RETNING_ALTERNATIVER: Alternativ[] = [
  { id: "vet", tekst: "Jeg vet hvilken type jobb eller bransje jeg vil jobbe i" },
  { id: "vurderer", tekst: "Jeg vurderer noen forskjellige typer jobber" },
  { id: "trenger-hjelp", tekst: "Jeg trenger hjelp til å finne ut hvilke jobber som kan passe" },
];

export const ERFARING_ALTERNATIVER: Alternativ[] = [
  { id: "relevant", tekst: "Jeg har relevant erfaring eller utdanning" },
  { id: "noe", tekst: "Jeg har noe erfaring eller kompetanse som kan brukes" },
  { id: "mangler", tekst: "Jeg mangler erfaring eller kvalifikasjoner" },
  { id: "vet-ikke", tekst: "Jeg vet ikke hva som kreves" },
];

export const OMFANG_ALTERNATIVER: Alternativ[] = [
  { id: "heltid", tekst: "Heltid" },
  { id: "deltid", tekst: "Deltid" },
  { id: "begge", tekst: "Jeg er åpen for begge deler" },
  { id: "usikker", tekst: "Jeg er usikker på hvor mye jeg kan jobbe" },
];

export const OMFANG_USIKKERHET_ALTERNATIVER: Alternativ[] = [
  { id: "realistisk", tekst: "Jeg trenger hjelp til å finne ut hvor mye det er realistisk for meg å jobbe" },
  { id: "hvilke-stillinger", tekst: "Jeg vet hvor mye jeg kan jobbe, men er usikker på hvilke stillinger som finnes" },
];

export const BEHOLD_OMFANG_ALTERNATIVER: Alternativ[] = [
  { id: "heltid", tekst: "Jobbe heltid" },
  { id: "deltid", tekst: "Jobbe deltid" },
  { id: "usikker", tekst: "Jeg er usikker på hvor mye jeg kan jobbe" },
];

export const BEHOLD_USIKKERHET_ALTERNATIVER: Alternativ[] = [
  { id: "realistisk", tekst: "Jeg trenger hjelp til å finne ut hvor mye det er realistisk for meg å jobbe" },
  { id: "faa-det-til", tekst: "Jeg vet hvor mye jeg ønsker å jobbe, men trenger hjelp til å få det til i nåværende jobb" },
];

export const TILBAKE_RETNING_ALTERNATIVER: Alternativ[] = [
  { id: "like-mye", tekst: "Jeg vil tilbake og jobbe like mye som før" },
  { id: "heltid", tekst: "Jeg vil tilbake i jobb på heltid" },
  { id: "deltid", tekst: "Jeg vil tilbake i jobb på deltid" },
  { id: "usikker-omfang", tekst: "Jeg er usikker på hvor mye jeg kan jobbe" },
  { id: "usikker-realistisk", tekst: "Jeg er usikker på om det er realistisk å komme tilbake til jobben" },
];

export const IKKE_KLAR_FOKUS_ALTERNATIVER: Alternativ[] = [
  { id: "hva-skal-til", tekst: "Hva som skal til for at jobb kan bli mulig" },
  { id: "hva-arbeid", tekst: "Hva slags arbeid som kan være realistisk for meg" },
  { id: "hvor-mye", tekst: "Hvor mye det kan være realistisk for meg å jobbe" },
  { id: "veileder", tekst: "Jeg trenger hjelp fra en veileder før jeg kan sette et mål" },
];

export const USIKKER_FOKUS_ALTERNATIVER: Alternativ[] = [
  { id: "jobber-passer", tekst: "Hvilke jobber som kan passe for meg" },
  { id: "erfaring-kompetanse", tekst: "Om jeg har erfaringen eller kompetansen jeg trenger" },
  { id: "klar-na", tekst: "Om jeg er klar for å jobbe nå" },
  { id: "hvor-mye", tekst: "Hvor mye jeg kan jobbe" },
  { id: "eksisterende-jobb", tekst: "Hvordan jeg kan beholde eller komme tilbake til en jobb jeg har" },
  { id: "vet-ikke", tekst: "Jeg vet ikke ennå" },
];

export const USIKKER_EKSISTERENDE_VALG_ALTERNATIVER: Alternativ[] = [
  { id: "behold", tekst: "Jeg vil beholde jobben jeg har" },
  { id: "tilbake", tekst: "Jeg vil komme tilbake til jobben jeg har" },
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
  eksisterende_jobb_tilbake: [
    { id: "plan-retur", tekst: "Lage en plan for gradvis retur med arbeidsgiver" },
  ],
};
