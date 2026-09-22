export type SporId =
  | "spor_a_jobb_realistisk_na"
  | "spor_b_styrke_jobbmuligheter"
  | "spor_c_naermere_realistisk_jobbmal"
  | "eksisterende_jobb_beholde";

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
  ikkeKlarFokusId?: string;
  ikkeKlarAnnetTekst?: string;
  usikkerFokusId?: string;
  interesseIder?: string[];
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
