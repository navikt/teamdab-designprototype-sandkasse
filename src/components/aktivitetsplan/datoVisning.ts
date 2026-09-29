import { AktivitetsKort } from "./types";

const MANEDER = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];

export interface DatoLinje {
  label: string;
  verdi: string;
}

function formatDato(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}. ${MANEDER[d.getMonth()]} ${d.getFullYear()}`;
}

// Datovisning følger faste regler per aktivitetstype:
// - "Møte med Nav": ett tidspunkt (dato + klokkeslett), ikke en periode.
// - "Stilling fra Nav": kun søknadsfrist.
// - "Stilling": startdato (Fra) i tillegg til søknadsfrist.
// - Alle andre: periode med Fra/Til.
export function getDatoLinjer(kort: AktivitetsKort): DatoLinje[] {
  if (kort.type === "Møte med Nav") {
    const linjer: DatoLinje[] = [];
    if (kort.startDato) linjer.push({ label: "Dato", verdi: formatDato(kort.startDato) });
    if (kort.klokkeslett) linjer.push({ label: "Kl.", verdi: kort.klokkeslett });
    return linjer;
  }

  if (kort.type === "Stilling fra Nav") {
    return kort.frist ? [{ label: "Frist", verdi: kort.frist }] : [];
  }

  if (kort.type === "Stilling") {
    const linjer: DatoLinje[] = [];
    if (kort.startDato) linjer.push({ label: "Fra", verdi: formatDato(kort.startDato) });
    if (kort.frist) linjer.push({ label: "Frist", verdi: kort.frist });
    return linjer;
  }

  if (kort.startDato) {
    return [
      { label: "Fra", verdi: formatDato(kort.startDato) },
      { label: "Til", verdi: formatDato(kort.sluttDato ?? kort.startDato) },
    ];
  }

  // Fallback for aktiviteter lagt til via "Ny aktivitet"-modalen, som kun har fritekst i dateRange.
  if (kort.dateRange) {
    return [{ label: "Tidspunkt", verdi: kort.dateRange }];
  }

  return [];
}

export function getDatoTekst(kort: AktivitetsKort): string | undefined {
  const linjer = getDatoLinjer(kort);
  if (linjer.length === 0) return undefined;
  return linjer.map((l) => `${l.label} ${l.verdi}`).join(" · ");
}
