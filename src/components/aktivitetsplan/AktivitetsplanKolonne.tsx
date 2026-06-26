import { useState } from "react";
import { HelpText, Link } from "@navikt/ds-react";
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
      className={`flex flex-col gap-2 min-w-[260px] flex-1 rounded-lg p-2 transition-colors ${
        isDragOver ? "bg-[#cce1ff] ring-2 ring-[#0067c5]" : "bg-[#eceef0]"
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
      <div className="flex items-center gap-1 px-1 pb-1">
        <span className="font-semibold text-sm uppercase tracking-widest" style={{ color: "#23262a" }}>
          {KOLONNE_LABELS[kolonneId]}
        </span>
        <span className="text-sm font-normal text-gray-500">({kort.length})</span>
        <HelpText title={KOLONNE_LABELS[kolonneId]} placement="right" className="ml-0.5">
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
