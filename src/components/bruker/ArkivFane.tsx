import { AktivitetsKort } from "../aktivitetsplan/types";
import { AktivitetsKortCard } from "../aktivitetsplan/AktivitetsKortCard";

interface ArkivFaneProps {
  kort: AktivitetsKort[];
  onKortKlikk: (kort: AktivitetsKort) => void;
  tomTekst?: string;
}

export function ArkivFane({ kort, onKortKlikk, tomTekst }: ArkivFaneProps) {
  if (kort.length === 0) {
    return (
      <p className="text-ax-text-subtle">
        {tomTekst ?? "Ingen fullførte eller avbrutte aktiviteter ennå."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {kort.map((k) => (
        <AktivitetsKortCard key={k.id} kort={k} onKlikk={onKortKlikk} visning="romslig" />
      ))}
    </div>
  );
}
