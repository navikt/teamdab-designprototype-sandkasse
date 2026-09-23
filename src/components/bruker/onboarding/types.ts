export type OnboardingStatus = "ikke_startet" | "pagar" | "fullfort";

export interface Alternativ {
  id: string;
  tekst: string;
}

export interface Svar {
  situasjonId?: string;
  finnJobbFokusId?: string;
  finnJobbAnnetTekst?: string;
  yrke?: string;
  ikkeKlarFokusId?: string;
  ikkeKlarAnnetTekst?: string;
  beholdJobbFokusId?: string;
  beholdJobbAnnetTekst?: string;
  usikkerFokusId?: string;
  interesseIder?: string[];
  malTekst?: string;
  aktivitetId?: string;
  egenAktivitetTekst?: string;
  velgMedVeileder?: boolean;
}

export interface OnboardingResultat {
  svar: Svar;
  malTekst: string;
  aktivitetTittel?: string;
  velgMedVeileder: boolean;
}
