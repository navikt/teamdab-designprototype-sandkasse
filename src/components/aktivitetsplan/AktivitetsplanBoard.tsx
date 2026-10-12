"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { AktivitetsKort, KolonneId, Perspektiv } from "./types";
import { AktivitetsplanKolonne } from "./AktivitetsplanKolonne";
import { SamtalereferatModal } from "./samtalereferat/SamtalereferatModal";

const KOLONNER: KolonneId[] = ["forslag", "planlegger", "gjennomforer", "fullfort", "avbrutt"];

interface Props {
  perspektiv: Perspektiv;
  kort: AktivitetsKort[];
  setKort: Dispatch<SetStateAction<AktivitetsKort[]>>;
  onMoteKlikk: (id: string) => void;
}

export function AktivitetsplanBoard({ perspektiv, kort, setKort, onMoteKlikk }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [aktivtKort, setAktivtKort] = useState<AktivitetsKort | null>(null);

  const handleKortKlikk = (k: AktivitetsKort) => {
    if (k.type === "Møte med Nav") onMoteKlikk(k.id);
    else if (k.samtalereferatData) setAktivtKort(k);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, targetKolonne: KolonneId) => {
    e.preventDefault();
    if (!draggingId) return;
    setKort((prev) =>
      prev.map((k) => (k.id === draggingId ? { ...k, kolonne: targetKolonne } : k))
    );
    setDraggingId(null);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {KOLONNER.map((kolonneId) => (
        <AktivitetsplanKolonne
          key={kolonneId}
          kolonneId={kolonneId}
          kort={kort.filter((k) => k.kolonne === kolonneId)}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onKortKlikk={handleKortKlikk}
        />
      ))}
      {aktivtKort?.samtalereferatData && (
        <SamtalereferatModal kort={aktivtKort} perspektiv={perspektiv} onClose={() => setAktivtKort(null)} />
      )}
    </div>
  );
}
