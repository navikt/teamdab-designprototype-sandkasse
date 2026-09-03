import classNames from "classnames";
import {
  BriefcaseIcon,
  Buildings2Icon,
  ClipboardIcon,
  DocPencilIcon,
  FileCheckmarkIcon,
  PersonChatIcon,
  StethoscopeIcon,
} from "@navikt/aksel-icons";
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

// Ikonvalg per aktivitetstype, uten fargekoding (kommer senere). Fallback: ClipboardIcon.
const TYPE_IKON: Record<string, typeof BriefcaseIcon> = {
  "Stilling": BriefcaseIcon,
  "Stilling fra Nav": BriefcaseIcon,
  "Jobb jeg har nå": BriefcaseIcon,
  "Jobbsøking": DocPencilIcon,
  "Jobbrettet egenaktivitet": DocPencilIcon,
  "Møte med Nav": PersonChatIcon,
  "Tiltak gjennom Nav": Buildings2Icon,
  "Arbeidstrening": Buildings2Icon,
  "Behandling": StethoscopeIcon,
  "Samtalereferat": FileCheckmarkIcon,
};

interface Props {
  kort: AktivitetsKort;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onKlikk: (kort: AktivitetsKort) => void;
  // Vises kun i bruker-flatens kronologiske liste, ikke i veileders kanban.
  visSnart?: boolean;
  onAvtaltKlikk?: () => void;
  // "kompakt" = veileders kanban (uendret), "romslig" = bruker-flatens lister.
  visning?: "kompakt" | "romslig";
}

export function AktivitetsKortCard({ kort, onDragStart, onKlikk, visSnart, onAvtaltKlikk, visning = "kompakt" }: Props) {
  const erKlikkbar = !!kort.samtalereferatData;
  const erRomslig = visning === "romslig";
  const Ikon = TYPE_IKON[kort.type] ?? ClipboardIcon;

  const innhold = (
    <>
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
      {(kort.tags.length > 0 || visSnart) && (
        <div className="flex flex-wrap gap-1 pt-1">
          {visSnart && (
            <Tag variant="warning" size="small">Snart</Tag>
          )}
          {kort.tags.map((t) => {
            const cfg = TAG_CONFIG[t];
            if (t === "avtalt-med-nav" && onAvtaltKlikk) {
              return (
                <button
                  key={t}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAvtaltKlikk();
                  }}
                >
                  <Tag variant={cfg.variant} size="small" className="cursor-pointer hover:opacity-80">
                    {cfg.label}
                  </Tag>
                </button>
              );
            }
            return (
              <Tag key={t} variant={cfg.variant} size="small">
                {cfg.label}
              </Tag>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart ? (e) => onDragStart(e, kort.id) : undefined}
      onClick={erKlikkbar ? () => onKlikk(kort) : undefined}
      className={classNames(
        "bg-ax-bg-default select-none",
        erRomslig ? "rounded-xl p-4 shadow-sm" : "rounded-md p-3 pb-4 flex flex-col gap-1 border border-ax-border-neutral",
        onDragStart && "cursor-grab active:cursor-grabbing active:opacity-60",
        erKlikkbar && (erRomslig
          ? "hover:shadow-[var(--ax-shadow-dialog)] cursor-pointer transition-shadow"
          : "hover:border-ax-border-accent cursor-pointer"),
      )}
    >
      {erRomslig ? (
        <div className="flex items-start gap-4">
          <span className="shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-ax-bg-neutral-moderate">
            <Ikon aria-hidden fontSize="2rem" className="text-[var(--ax-text-neutral-subtle)]" />
          </span>
          <div className="flex flex-col gap-1 flex-1 min-w-0">{innhold}</div>
        </div>
      ) : (
        innhold
      )}
    </div>
  );
}
