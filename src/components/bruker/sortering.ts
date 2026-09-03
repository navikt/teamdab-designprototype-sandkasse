import { AktivitetsKort, KolonneId } from "../aktivitetsplan/types";

export const MINE_AKTIVITETER_KOLONNER: KolonneId[] = ["planlegger", "gjennomforer"];
export const ARKIV_KOLONNER: KolonneId[] = ["fullfort", "avbrutt"];

const SNART_TERSKEL_DAGER = 5;

function dagerTil(dato: string): number {
  const naa = new Date();
  naa.setHours(0, 0, 0, 0);
  const maal = new Date(dato);
  maal.setHours(0, 0, 0, 0);
  return Math.round((maal.getTime() - naa.getTime()) / 86_400_000);
}

export function erLopende(kort: AktivitetsKort): boolean {
  return kort.lopende === true || !kort.startDato;
}

// Regnes som "snart" også når startDato allerede er passert, siden aktiviteten da pågår nå.
export function erSnart(kort: AktivitetsKort): boolean {
  if (erLopende(kort)) return false;
  return dagerTil(kort.startDato!) <= SNART_TERSKEL_DAGER;
}

export function sorterMineAktiviteter(kort: AktivitetsKort[]): AktivitetsKort[] {
  const snart = kort
    .filter((k) => erSnart(k))
    .sort((a, b) => dagerTil(a.startDato!) - dagerTil(b.startDato!));
  const lopende = kort.filter((k) => erLopende(k));
  const senere = kort
    .filter((k) => !erLopende(k) && !erSnart(k))
    .sort((a, b) => dagerTil(a.startDato!) - dagerTil(b.startDato!));
  return [...snart, ...lopende, ...senere];
}
