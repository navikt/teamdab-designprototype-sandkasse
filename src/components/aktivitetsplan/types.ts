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

export type TagVariant =
  | "ulest"
  | "avtalt-med-nav"
  | "deltar"
  | "fatt-jobbtilbud"
  | "cv-er-delt"
  | "sendt-soknad"
  | "skal-pa-intervju"
  | "ikke-ferdig"
  | "venter-svar";

export interface AktivitetsKort {
  id: string;
  kolonne: KolonneId;
  type: string;
  title: string;
  subtitle?: string;
  dateRange?: string;
  extraLine?: string;
  tags: TagVariant[];
  hasBlueDot?: boolean;
}
