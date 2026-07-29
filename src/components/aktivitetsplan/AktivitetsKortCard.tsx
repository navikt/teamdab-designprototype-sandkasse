import { Tag, Detail, Heading, BodyShort } from "@navikt/ds-react";
import { AktivitetsKort, TagVariant } from "./types";

interface TagConfig {
  label: string;
  variant: "neutral" | "success" | "warning" | "info";
}

const TAG_CONFIG: Record<TagVariant, TagConfig> = {
  // Meta
  "ulest":              { label: "Ulest",                         variant: "warning" },
  "avtalt-med-nav":     { label: "Avtalt med Nav",                 variant: "info" },
  // Stilling / Stilling fra Nav
  "sendt-soknad":       { label: "Søknaden er sendt",             variant: "neutral" },
  "skal-pa-intervju":   { label: "Skal på intervju",              variant: "info" },
  "fatt-jobbtilbud":    { label: "Fått jobbtilbud",               variant: "success" },
  "ikke-fatt-jobben":   { label: "Ikke fått jobben",              variant: "neutral" },
  "fatt-jobben":        { label: "Fått jobben",                   variant: "success" },
  "venter-pa-kontakt":  { label: "Venter på å bli kontaktet",     variant: "neutral" },
  "cv-er-delt":         { label: "CV er delt med arbeidsgiver",   variant: "info" },
  // Arena-tiltak / ekstern aktivitet
  "sokt-inn":           { label: "Søkt inn på tiltaket",          variant: "neutral" },
  "fatt-plass":         { label: "Fått plass på tiltaket",        variant: "success" },
  "pa-venteliste":      { label: "På venteliste",                 variant: "neutral" },
  "takket-ja":          { label: "Takket ja til tilbud",          variant: "success" },
  "takket-nei":         { label: "Takket nei til tilbud",         variant: "neutral" },
  "infomote":           { label: "Infomøte før tiltaket",         variant: "info" },
  "ikke-mott":          { label: "Ikke møtt på tiltaket",         variant: "warning" },
  "ikke-aktuell":       { label: "Ikke aktuell for tiltaket",     variant: "neutral" },
  "fatt-avslag":        { label: "Fått avslag",                   variant: "neutral" },
};

interface Props {
  kort: AktivitetsKort;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

export function AktivitetsKortCard({ kort, onDragStart }: Props) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, kort.id)}
      className="bg-ax-bg-default rounded-md border border-ax-border-neutral p-3 pb-4 flex flex-col gap-1 cursor-grab active:cursor-grabbing active:opacity-60 select-none"
    >
      {/* Type label + blue dot */}
      <div className="flex items-baseline gap-1.5">
        {kort.hasBlueDot && (
          <span
            className="inline-block w-2 h-2 rounded-full bg-ax-bg-accent-strong shrink-0 self-center"
            aria-label="Ulest"
          />
        )}
        <Detail as="p" className="uppercase text-ax-text-neutral">
          {kort.type}
        </Detail>
      </div>

      {/* Title */}
      <Heading level="3" size="xsmall">
        {kort.title}
      </Heading>

      {/* Date range */}
      {kort.dateRange && (
        <BodyShort>{kort.dateRange}</BodyShort>
      )}

      {/* Extra line */}
      {kort.extraLine && (
        <BodyShort>{kort.extraLine}</BodyShort>
      )}

      {/* Tags */}
      {kort.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {kort.tags.map((t) => {
            const cfg = TAG_CONFIG[t];
            return (
              <Tag key={t} variant={cfg.variant} size="small">
                {cfg.label}
              </Tag>
            );
          })}
        </div>
      )}
    </div>
  );
}
