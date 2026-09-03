"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@navikt/aksel-icons";
import { BodyShort, Button, Detail } from "@navikt/ds-react";
import { AktivitetsKort } from "../aktivitetsplan/types";
import { erLopende } from "./sortering";

interface MineAktiviteterKalenderProps {
  kort: AktivitetsKort[];
  onKortKlikk: (kort: AktivitetsKort) => void;
}

const UKEDAGER = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

function mandagIUke(dato: Date): Date {
  const d = new Date(dato);
  const diff = (d.getDay() + 6) % 7; // mandag = 0
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function leggTilDager(dato: Date, dager: number): Date {
  const d = new Date(dato);
  d.setDate(d.getDate() + dager);
  return d;
}

function erInnenforDag(kort: AktivitetsKort, dag: Date): boolean {
  if (!kort.startDato) return false;
  const start = new Date(kort.startDato);
  const slutt = kort.sluttDato ? new Date(kort.sluttDato) : start;
  return dag >= start && dag <= slutt;
}

export function MineAktiviteterKalender({ kort, onKortKlikk }: MineAktiviteterKalenderProps) {
  const [ukeStart, setUkeStart] = useState(() => mandagIUke(new Date()));

  const lopende = kort.filter((k) => erLopende(k));
  const tidsbestemt = kort.filter((k) => !erLopende(k));
  const dager = Array.from({ length: 7 }, (_, i) => leggTilDager(ukeStart, i));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Button
          variant="tertiary-neutral"
          size="small"
          icon={<ChevronLeftIcon aria-hidden />}
          onClick={() => setUkeStart((u) => leggTilDager(u, -7))}
        >
          Forrige uke
        </Button>
        <BodyShort weight="semibold">
          Uke {dager[0].toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit" })} – {dager[6].toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit" })}
        </BodyShort>
        <Button
          variant="tertiary-neutral"
          size="small"
          icon={<ChevronRightIcon aria-hidden />}
          iconPosition="right"
          onClick={() => setUkeStart((u) => leggTilDager(u, 7))}
        >
          Neste uke
        </Button>
      </div>

      {lopende.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 rounded-md bg-ax-bg-neutral-soft">
          {lopende.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => onKortKlikk(k)}
              className="px-2 py-1 rounded bg-ax-bg-accent-moderate text-sm text-left"
            >
              {k.title}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-7 gap-2">
        {dager.map((dag, i) => (
          <div key={i} className="border border-ax-border-neutral-subtle rounded-md p-2 min-h-[120px] flex flex-col gap-1">
            <Detail className="text-ax-text-subtle">
              {UKEDAGER[i]} {dag.getDate()}.{dag.getMonth() + 1}
            </Detail>
            {tidsbestemt
              .filter((k) => erInnenforDag(k, dag))
              .map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => onKortKlikk(k)}
                  className="px-2 py-1 rounded bg-ax-bg-default border border-ax-border-neutral text-sm text-left"
                >
                  {k.title}
                </button>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
