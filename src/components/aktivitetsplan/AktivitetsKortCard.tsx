import { Tag, Detail, Heading, BodyShort } from "@navikt/ds-react";
import { AktivitetsKort, TagVariant } from "./types";

interface TagConfig {
  label: string;
  variant: "neutral" | "success" | "warning" | "info";
}

const TAG_CONFIG: Record<TagVariant, TagConfig> = {
  "ulest": { label: "Ulest", variant: "warning" },
  "avtalt-med-nav": { label: "Avtalt med NAV", variant: "info" },
  "deltar": { label: "Deltar", variant: "success" },
  "fatt-jobbtilbud": { label: "Fått jobbtilbud", variant: "success" },
  "cv-er-delt": { label: "CV er delt", variant: "success" },
  "sendt-soknad": { label: "Sendt søknad", variant: "success" },
  "skal-pa-intervju": { label: "Skal på intervju", variant: "neutral" },
  "ikke-ferdig": { label: "Ikke ferdig", variant: "neutral" },
  "venter-svar": { label: "Venter svar fra deg", variant: "neutral" },
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

      {/* Subtitle */}
      {kort.subtitle && (
        <BodyShort>{kort.subtitle}</BodyShort>
      )}

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
