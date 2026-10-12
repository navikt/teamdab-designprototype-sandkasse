import { AktivitetsKort, Deltaker, DeltakerRolle, HistorikkInnslag, KolonneId, MoteForm } from "../types";

// Testnavn etter reglene i AGENTS.md. Prod forhåndsutfyller «Hilsen {veiledernavn}» i hensiktsfeltet.
export const VEILEDER_NAVN = "Kompass, Trygg";
export const VEILEDER_NAV_IDENT = "Z000000";
export const DELTAKER_ROLLER: DeltakerRolle[] = ["Veileder", "Arbeidsgiver", "Behandler", "Mentor", "Fadder", "Annet"];
export const visningsNavn = (navn: string) => {
  const [etternavn, fornavn] = navn.split(", ");
  return fornavn ? `${fornavn} ${etternavn}` : navn;
};
export const HILSEN_TEKST = `\nHilsen ${visningsNavn(VEILEDER_NAVN)}`;

export const MOTE_INGRESS = "Nav ønsker et møte med deg. Du må gi beskjed så raskt som mulig hvis tidspunktet ikke passer.";

export const MOTEFORMER: MoteForm[] = ["Oppmøte", "Telefonmøte", "Videomøte"];

export function formatterVarighet(minutter: number): string {
  const timer = Math.floor(minutter / 60);
  const rest = minutter % 60;
  if (timer === 0) return `${rest} minutter`;
  const timerTekst = `${timer} ${timer === 1 ? "time" : "timer"}`;
  return rest > 0 ? `${timerTekst}, ${rest} minutter` : timerTekst;
}

// Samme valg som i MoteAktivitetForm i aktivitetsplan-repoet: 15, 30, 45 minutter, deretter 30-minuttersteg til 7,5 timer.
export const VARIGHETER: { minutter: number; tekst: string }[] = [
  { minutter: 15, tekst: "15 minutter" },
  { minutter: 30, tekst: "30 minutter" },
  { minutter: 45, tekst: "45 minutter" },
  ...Array.from({ length: 14 }, (_, i) => {
    const minutter = 60 + i * 30;
    return { minutter, tekst: formatterVarighet(minutter) };
  }),
];

export function tilIsoDato(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function fraIsoDato(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formaterDatoLang(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  return fraIsoDato(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
}

function formaterDatoKort(iso: string | undefined): string {
  if (!iso) return "ikke satt";
  const d = fraIsoDato(iso);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

export function moteStart(kort: AktivitetsKort): Date | undefined {
  if (!kort.startDato) return undefined;
  const dato = fraIsoDato(kort.startDato);
  const [t, m] = (kort.klokkeslett ?? "00:00").split(":").map(Number);
  dato.setHours(t || 0, m || 0, 0, 0);
  return dato;
}

export function erMerEnnSyvDagerTil(dato: Date): boolean {
  const grense = new Date();
  grense.setHours(0, 0, 0, 0);
  grense.setDate(grense.getDate() + 7);
  return dato.getTime() > grense.getTime();
}

export function erMote(kort: AktivitetsKort): boolean {
  return kort.type === "Møte med Nav";
}

export function erFerdig(kort: AktivitetsKort): boolean {
  return kort.kolonne === "fullfort" || kort.kolonne === "avbrutt";
}

export interface MoteFormVerdier {
  tittel: string;
  dato: Date | undefined;
  datoInput: string;
  klokkeslett: string;
  varighet: string;
  kanal: string;
  adresse: string;
  beskrivelse: string;
  forberedelser: string;
}

export type MoteFormFeil = Partial<Record<Exclude<keyof MoteFormVerdier, "datoInput">, string>>;

// Feilmeldingene er hentet fra valideringen i MoteAktivitetForm i aktivitetsplan-repoet.
export function validerMote(v: MoteFormVerdier): MoteFormFeil {
  const feil: MoteFormFeil = {};

  if (!v.tittel.trim()) feil.tittel = "Du må fylle ut tema for møtet";
  else if (v.tittel.length > 100) feil.tittel = "Du må korte ned teksten til 100 tegn";

  if (!v.dato) {
    feil.dato = v.datoInput.trim() ? "Ikke en gyldig dato" : "Dato må fylles ut";
  } else {
    const iDag = new Date();
    iDag.setHours(0, 0, 0, 0);
    if (v.dato.getTime() < iDag.getTime()) feil.dato = "Dato kan ikke være tilbake i tid";
  }

  if (!v.klokkeslett) feil.klokkeslett = "Du må fylle ut klokkeslett";
  if (!v.varighet) feil.varighet = "Du må velge varighet";
  if (!v.kanal) feil.kanal = "Du må velge møteform";

  if (!v.adresse.trim()) feil.adresse = "Du må fylle ut møtested eller annen praktisk informasjon";
  else if (v.adresse.length > 255) feil.adresse = "Du må korte ned teksten til 255 tegn";

  const hensiktUtenHilsen = v.beskrivelse.replace(HILSEN_TEKST, "").trim();
  if (!hensiktUtenHilsen) feil.beskrivelse = "Du må fylle ut hensikten med møtet";

  return feil;
}

export const VEILEDER_RAD_ID = "veileder";

export interface DeltakerRad {
  id: string;
  navn: string;
  rolle: string;
}

export interface DeltakerRadFeil {
  navn?: string;
  rolle?: string;
}

// Helt tomme rader ignoreres, halvfylte gir feil.
export function validerDeltakerRad(r: DeltakerRad): DeltakerRadFeil {
  const harNavn = r.navn.trim() !== "";
  const harRolle = r.rolle !== "";
  if (r.id === VEILEDER_RAD_ID) return harNavn ? {} : { navn: "Du må fylle ut navn på veilederen" };
  if (!harNavn && !harRolle) return {};
  return {
    navn: harNavn ? undefined : "Du må fylle ut navn på deltakeren",
    rolle: harRolle ? undefined : "Du må velge rolle for deltakeren",
  };
}

export function raderTilDeltakere(rader: DeltakerRad[]): Deltaker[] {
  return rader
    .filter((r) => r.navn.trim() !== "" && r.rolle !== "")
    .map((r) => ({ navn: r.navn.trim(), rolle: r.rolle as DeltakerRolle }));
}

export function lagHistorikkInnslag(beskrivelse: string): HistorikkInnslag {
  return { tidspunkt: new Date().toISOString(), beskrivelse };
}

// Én historikklinje per endret felt, med formuleringer fra mocks/aktivitetHistorikk.ts i aktivitetsplan-repoet.
export function lagEndringsHistorikk(gammel: AktivitetsKort, ny: AktivitetsKort): HistorikkInnslag[] {
  const tekster: string[] = [];
  if (gammel.title !== ny.title) tekster.push(`endret tittel fra "${gammel.title}" til "${ny.title}"`);
  if (
    gammel.startDato !== ny.startDato ||
    gammel.klokkeslett !== ny.klokkeslett ||
    gammel.varighetMinutter !== ny.varighetMinutter
  ) {
    tekster.push(`endret møtetidspunkt fra ${formaterDatoKort(gammel.startDato)} til ${formaterDatoKort(ny.startDato)}`);
  }
  if (gammel.moteform !== ny.moteform) {
    tekster.push(`endret møtekanal fra "${gammel.moteform ?? "ikke satt"}" til "${ny.moteform ?? "ikke satt"}"`);
  }
  if (gammel.moteSted !== ny.moteSted) {
    tekster.push(`endret møtested fra "${gammel.moteSted ?? "ikke satt"}" til "${ny.moteSted ?? "ikke satt"}"`);
  }
  if (JSON.stringify(gammel.deltakere ?? []) !== JSON.stringify(ny.deltakere ?? [])) tekster.push("endret deltakere");
  if (gammel.hensikt !== ny.hensikt) tekster.push("endret beskrivelse");
  if ((gammel.forberedelser ?? "") !== (ny.forberedelser ?? "")) tekster.push("endret forberedelser til møtet");
  return tekster.map(lagHistorikkInnslag);
}

export const STATUS_REKKEFOLGE: KolonneId[] = ["forslag", "planlegger", "gjennomforer", "fullfort", "avbrutt"];

const RELATIV = new Intl.RelativeTimeFormat("nb-NO", { numeric: "always" });

// Som formaterDatoEllerTidSiden i prod: relativ tid siste to døgn, ellers dato og klokkeslett.
export function formaterTidspunkt(iso: string): string {
  const d = new Date(iso);
  const diffMin = Math.round((Date.now() - d.getTime()) / 60_000);
  if (diffMin < 2 * 24 * 60) {
    if (diffMin < 1) return "for under ett minutt siden";
    if (diffMin < 60) return RELATIV.format(-diffMin, "minute");
    if (diffMin < 24 * 60) return RELATIV.format(-Math.floor(diffMin / 60), "hour");
    return RELATIV.format(-Math.floor(diffMin / (24 * 60)), "day");
  }
  const dato = d.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
  const tid = `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`;
  return `${dato} kl. ${tid}`;
}
