"use client";

import { ComponentType } from "react";
import { SporId } from "./spor";
import { NaavaerendeAktivitetsplan } from "./naavaerende/NaavaerendeAktivitetsplan";
import { NaavaerendeBrukerSide } from "./naavaerende/NaavaerendeBrukerSide";
import { FramtidBrukerSide, FramtidVeilederAktivitetsplan } from "./framtid/FramtidSkjermer";

export interface SporSkjermer {
  // Aktivitetsplanen inne i veilederens personprofil.
  VeilederAktivitetsplan: ComponentType<{ brukerNavn?: string }>;
  // Hele brukerflaten (/minaktivitetsplan). somVeileder = veilederen ser det brukeren ser.
  BrukerSide: ComponentType<{ somVeileder: boolean }>;
}

export const SKJERMER: Record<SporId, SporSkjermer> = {
  naavaerende: {
    VeilederAktivitetsplan: ({ brukerNavn }) => <NaavaerendeAktivitetsplan perspektiv="veileder" brukerNavn={brukerNavn} />,
    BrukerSide: NaavaerendeBrukerSide,
  },
  framtid: {
    VeilederAktivitetsplan: FramtidVeilederAktivitetsplan,
    BrukerSide: FramtidBrukerSide,
  },
};
