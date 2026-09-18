export type SporId =
  | "spor_a_jobb_realistisk_na"
  | "spor_b_styrke_jobbmuligheter"
  | "spor_c_naermere_realistisk_jobbmal"
  | "eksisterende_jobb_beholde"
  | "eksisterende_jobb_tilbake";

export type OnboardingStatus = "ikke_startet" | "pagar" | "fullfort";

export interface Alternativ {
  id: string;
  tekst: string;
}

export interface Svar {
  situasjonId?: string;
  retningId?: string;
  yrke?: string;
  erfaringId?: string;
  omfangId?: string;
  omfangUsikkerhetId?: string;
  beholdOmfangId?: string;
  beholdUsikkerhetId?: string;
  tilbakeRetningId?: string;
  ikkeKlarFokusId?: string;
  usikkerFokusId?: string;
  usikkerEksisterendeValgId?: string;
  malTekst?: string;
  aktivitetId?: string;
  egenAktivitetTekst?: string;
  velgMedVeileder?: boolean;
}

export interface OnboardingResultat {
  spor: SporId;
  svar: Svar;
  malTekst: string;
  aktivitetTittel?: string;
  velgMedVeileder: boolean;
}
