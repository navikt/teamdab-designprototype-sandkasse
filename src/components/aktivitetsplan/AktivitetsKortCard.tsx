import { Tag } from "@navikt/ds-react";
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
      className="bg-white rounded border border-[rgba(2,20,49,0.2)] p-3 flex flex-col gap-1.5 cursor-grab active:cursor-grabbing active:opacity-60 select-none"
    >
      {/* Type label + blue dot */}
      <div className="flex items-center gap-1.5">
        {kort.hasBlueDot && (
          <span
            className="inline-block w-2.5 h-2.5 rounded-full bg-[#0067c5] shrink-0"
            aria-label="Ulest"
          />
        )}
        <span
          className="text-xs font-normal tracking-[0.1em] uppercase"
          style={{ color: "#0067c5", fontSize: "12px", lineHeight: "16px" }}
        >
          {kort.type}
        </span>
      </div>

      {/* Title */}
      <p className="font-semibold text-base leading-5" style={{ color: "#23262a" }}>
        {kort.title}
      </p>

      {/* Subtitle */}
      {kort.subtitle && (
        <p className="text-sm leading-5" style={{ color: "#23262a" }}>
          {kort.subtitle}
        </p>
      )}

      {/* Date range */}
      {kort.dateRange && (
        <p className="text-sm leading-5" style={{ color: "#23262a" }}>
          {kort.dateRange}
        </p>
      )}

      {/* Extra line */}
      {kort.extraLine && (
        <p className="text-sm leading-5" style={{ color: "#23262a" }}>
          {kort.extraLine}
        </p>
      )}

      {/* Tags */}
      {kort.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-0.5">
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
