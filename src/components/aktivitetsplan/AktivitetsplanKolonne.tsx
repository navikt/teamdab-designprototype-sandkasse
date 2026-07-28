import { useState } from "react";
import { Heading, HelpText, Link } from "@navikt/ds-react";
import { AktivitetsKort, KolonneId, KOLONNE_LABELS, KOLONNE_HELP } from "./types";
import { AktivitetsKortCard } from "./AktivitetsKortCard";

interface Props {
  kolonneId: KolonneId;
  kort: AktivitetsKort[];
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, kolonneId: KolonneId) => void;
}

export function AktivitetsplanKolonne({ kolonneId, kort, onDragStart, onDrop }: Props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const showVisEldre = kolonneId === "fullfort" || kolonneId === "avbrutt";

  return (
    <div
      className={`flex flex-col gap-2 min-w-[260px] flex-1 border-t border-ax-border-neutral-subtle rounded-none p-4 transition-colors sm:border-t-0 sm:rounded-md ${
        isDragOver ? "bg-ax-bg-accent-moderate-hover" : "bg-ax-bg-neutral-soft"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop(e, kolonneId);
      }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between pb-2">
        <Heading level="2" size="small">
          {KOLONNE_LABELS[kolonneId]}
        </Heading>
        <HelpText title={KOLONNE_LABELS[kolonneId]} placement="right">
          {KOLONNE_HELP[kolonneId]}
        </HelpText>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {kort.map((k) => (
          <AktivitetsKortCard key={k.id} kort={k} onDragStart={onDragStart} />
        ))}
      </div>

      {/* Vis eldre link */}
      {showVisEldre && (
        <div className="px-1 pt-1">
          <Link href="#" className="text-sm">
            Vis eldre {KOLONNE_LABELS[kolonneId].toLowerCase()} aktiviteter
          </Link>
        </div>
      )}
    </div>
  );
}
