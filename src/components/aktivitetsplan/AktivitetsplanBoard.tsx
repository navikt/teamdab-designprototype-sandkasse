"use client";

import { useState } from "react";
import { KolonneId } from "./types";
import { initialKort } from "./initialData";
import { AktivitetsplanKolonne } from "./AktivitetsplanKolonne";

const KOLONNER: KolonneId[] = ["forslag", "planlegger", "gjennomforer", "fullfort", "avbrutt"];

export function AktivitetsplanBoard() {
  const [kort, setKort] = useState(initialKort);
  const [draggingId, setDraggingId] = useState<string | null>(null);

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
        />
      ))}
    </div>
  );
}
