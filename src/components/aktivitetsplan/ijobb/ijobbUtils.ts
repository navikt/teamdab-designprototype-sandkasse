import { AktivitetsKort } from "../types";

export const IJOBB_TYPE = "Jobb jeg har nå";

// Ingressen er hentet fra aktivitetingress.IJOBB i aktivitetsplan-repoet.
export const IJOBB_INGRESS =
  "Her kan du informere om der du jobber nå, for eksempel en deltidsjobb eller en midlertidig stilling. Hvis du sender inn meldekort, så må du også huske å føre opp de timene du har jobbet på meldekortet.";

export const STILLINGSANDELER = ["Heltid", "Deltid"] as const;

export function erIjobb(kort: AktivitetsKort): boolean {
  return kort.type === IJOBB_TYPE;
}

export interface IjobbFormVerdier {
  tittel: string;
  fraDato: Date | undefined;
  fraDatoInput: string;
  tilDato: Date | undefined;
  tilDatoInput: string;
  stillingsandel: string;
  arbeidsgiver: string;
  ansettelsesforhold: string;
  beskrivelse: string;
}

export type IjobbFormFeil = Partial<
  Record<Exclude<keyof IjobbFormVerdier, "fraDatoInput" | "tilDatoInput">, string>
>;

// Feilmeldingene er hentet fra zod-skjemaet i AktivitetIjobbForm i aktivitetsplan-repoet.
export function validerIjobb(v: IjobbFormVerdier): IjobbFormFeil {
  const feil: IjobbFormFeil = {};

  if (!v.tittel.trim()) feil.tittel = "Du må fylle ut stillingstittel";
  else if (v.tittel.length > 100) feil.tittel = "Du må korte ned teksten til 100 tegn";

  if (!v.fraDato) {
    feil.fraDato = v.fraDatoInput.trim() ? "Ikke en gyldig dato" : "Fra dato må være en gyldig dato";
  }

  if (!v.tilDato) {
    if (v.tilDatoInput.trim()) feil.tilDato = "Ikke en gyldig dato";
  } else if (v.fraDato && v.fraDato.getTime() > v.tilDato.getTime()) {
    feil.tilDato = "Til dato kan ikke være før fra dato";
  }

  if (!v.stillingsandel) feil.stillingsandel = "Du må velge heltid eller deltid";
  if (v.arbeidsgiver.length > 255) feil.arbeidsgiver = "Du må korte ned teksten til 255 tegn";
  if (v.ansettelsesforhold.length > 255) feil.ansettelsesforhold = "Du må korte ned teksten til 255 tegn";
  if (v.beskrivelse.length > 5000) feil.beskrivelse = "Du må korte ned teksten til 5000 tegn";

  return feil;
}
