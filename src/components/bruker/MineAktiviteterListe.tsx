import { AktivitetsKort } from "../aktivitetsplan/types";
import { AktivitetsKortCard } from "../aktivitetsplan/AktivitetsKortCard";
import { erSnart, sorterMineAktiviteter } from "./sortering";

interface MineAktiviteterListeProps {
  kort: AktivitetsKort[];
  onKortKlikk: (kort: AktivitetsKort) => void;
  onAvtaltKlikk: () => void;
}

export function MineAktiviteterListe({ kort, onKortKlikk, onAvtaltKlikk }: MineAktiviteterListeProps) {
  const sortert = sorterMineAktiviteter(kort);

  if (sortert.length === 0) {
    return <p className="text-ax-text-subtle">Du har ingen aktiviteter ennå.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {sortert.map((k) => (
        <AktivitetsKortCard
          key={k.id}
          kort={k}
          onKlikk={onKortKlikk}
          visSnart={erSnart(k)}
          onAvtaltKlikk={onAvtaltKlikk}
          visning="romslig"
        />
      ))}
    </div>
  );
}
