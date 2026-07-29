export type KolonneId =
  | "forslag"
  | "planlegger"
  | "gjennomforer"
  | "fullfort"
  | "avbrutt";

export const KOLONNE_LABELS: Record<KolonneId, string> = {
  forslag: "Forslag",
  planlegger: "Planlegger",
  gjennomforer: "Gjennomfører",
  fullfort: "Fullført",
  avbrutt: "Avbrutt",
};

export const KOLONNE_HELP: Record<KolonneId, string> = {
  forslag: "Aktiviteter som er foreslått, men ikke tatt stilling til ennå.",
  planlegger: "Aktiviteter du planlegger å gjennomføre.",
  gjennomforer: "Aktiviteter du holder på med nå.",
  fullfort: "Aktiviteter som er fullført.",
  avbrutt: "Aktiviteter som er avbrutt.",
};

// Tags som samsvarer med etikett-verdier i prod (aktivitetsplan-repoet):
// stillingsEtikettMapper, stillingFraNavSoknadsstatusMapper, tiltakEtikettMapper
export type TagVariant =
  // Meta
  | "ulest"
  | "avtalt-med-nav"
  // Stilling / Stilling fra Nav
  | "sendt-soknad"           // SOKNAD_SENDT → 'Søknaden er sendt'
  | "skal-pa-intervju"       // INNKALT_TIL_INTERVJU / SKAL_PAA_INTERVJU → 'Skal på intervju'
  | "fatt-jobbtilbud"        // JOBBTILBUD → 'Fått jobbtilbud'
  | "ikke-fatt-jobben"       // AVSLAG / IKKE_FATT_JOBBEN → 'Ikke fått jobben'
  | "fatt-jobben"            // FATT_JOBBEN → 'Fått jobben'
  | "venter-pa-kontakt"      // VENTER → 'Venter på å bli kontaktet'
  | "cv-er-delt"             // CV_DELT → 'CV er delt med arbeidsgiver'
  // Arena-tiltak / ekstern aktivitet
  | "sokt-inn"               // AKTUELL / SOKT_INN → 'Søkt inn på tiltaket'
  | "fatt-plass"             // TILBUD / FATT_PLASS → 'Fått plass på tiltaket'
  | "pa-venteliste"          // VENTELISTE → 'På venteliste'
  | "takket-ja"              // JATAKK / TAKKET_JA → 'Takket ja til tilbud'
  | "takket-nei"             // NEITAKK / TAKKET_NEI → 'Takket nei til tilbud'
  | "infomote"               // INFOMOETE → 'Infomøte før tiltaket'
  | "ikke-mott"              // IKKEM / IKKE_MOETT → 'Ikke møtt på tiltaket'
  | "ikke-aktuell"           // IKKAKTUELL / IKKE_AKTUELL → 'Ikke aktuell for tiltaket'
  | "fatt-avslag";           // AVSLAG (tiltak) → 'Fått avslag'

export interface AktivitetsKort {
  id: string;
  kolonne: KolonneId;
  type: string;
  title: string;
  dateRange?: string;
  extraLine?: string;
  tags: TagVariant[];
  hasBlueDot?: boolean;
}
