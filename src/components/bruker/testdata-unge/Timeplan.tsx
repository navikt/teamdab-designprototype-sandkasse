"use client";

import { Fragment } from "react";
import { TimeplanAktivitet, TimeplanFarge } from "./timeplanTestdata";

const UKEDAGER = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"];
const TIMER = Array.from({ length: 8 }, (_, i) => 8 + i); // 08–15, siste rad dekker til 16

const FARGE_KLASSER: Record<TimeplanFarge, string> = {
  info: "bg-ax-bg-info-moderate border-ax-border-info-subtle",
  success: "bg-ax-bg-success-moderate border-ax-border-success-subtle",
  warning: "bg-ax-bg-warning-moderate border-ax-border-warning-subtle",
  danger: "bg-ax-bg-danger-moderate border-ax-border-danger-subtle",
  "meta-purple": "bg-ax-bg-meta-purple-moderate border-ax-border-meta-purple-subtle",
  "meta-lime": "bg-ax-bg-meta-lime-moderate border-ax-border-meta-lime-subtle",
  "brand-magenta": "bg-ax-bg-brand-magenta-moderate border-ax-border-brand-magenta-subtle",
};

interface TimeplanProps {
  aktiviteter: TimeplanAktivitet[];
  ukeStart: Date;
  onAktivitetKlikk: (aktivitet: TimeplanAktivitet) => void;
}

function leggTilDager(dato: Date, dager: number): Date {
  const d = new Date(dato);
  d.setDate(d.getDate() + dager);
  return d;
}

export function Timeplan({ aktiviteter, ukeStart, onAktivitetKlikk }: TimeplanProps) {
  const ukedagDatoer = UKEDAGER.map((_, i) => leggTilDager(ukeStart, i));
  return (
    <div className="overflow-x-auto rounded-md border border-ax-border-neutral-subtle">
      <div
        className="grid min-w-[640px]"
        style={{
          gridTemplateColumns: "4rem repeat(5, 1fr)",
          gridTemplateRows: `3.5rem repeat(${TIMER.length}, 5rem)`,
        }}
      >
        <div className="border-b border-r border-ax-border-neutral-subtle bg-ax-bg-neutral-soft" style={{ gridColumn: 1, gridRow: 1 }} />
        {UKEDAGER.map((dag, i) => (
          <div
            key={dag}
            className="flex flex-col items-center justify-center gap-0.5 border-b border-ax-border-neutral-subtle bg-ax-bg-neutral-soft py-1 text-sm font-semibold text-ax-text-neutral"
            style={{ gridColumn: i + 2, gridRow: 1 }}
          >
            <span>{dag}</span>
            <span className="text-xs font-normal text-ax-text-subtle">
              {ukedagDatoer[i].toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit" })}
            </span>
          </div>
        ))}

        {TIMER.map((time, i) => (
          <Fragment key={time}>
            <div
              className="flex items-center justify-end border-r border-ax-border-neutral-subtle pr-2 text-sm text-ax-text-subtle"
              style={{ gridColumn: 1, gridRow: i + 2 }}
            >
              {time}:00
            </div>
            {UKEDAGER.map((dag, j) => (
              <div
                key={`${time}-${dag}`}
                className="border-b border-r border-ax-border-neutral-subtle"
                style={{ gridColumn: j + 2, gridRow: i + 2 }}
              />
            ))}
          </Fragment>
        ))}

        {aktiviteter.map((a) => {
          const antallDager = a.ukedagTil - a.ukedagFra + 1;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onAktivitetKlikk(a)}
              className={`relative m-0.5 block cursor-pointer overflow-hidden rounded-md border text-left transition hover:brightness-95 active:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ax-border-accent ${FARGE_KLASSER[a.farge]}`}
              style={{
                gridColumn: `${a.ukedagFra + 1} / ${a.ukedagTil + 2}`,
                gridRow: `${a.timeFra - 8 + 2} / ${a.timeTil - 8 + 2}`,
              }}
            >
              {antallDager > 1 && (
                <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${antallDager}, 1fr)` }}>
                  {Array.from({ length: antallDager - 1 }).map((_, i) => (
                    <div key={i} className="border-r border-black/10" />
                  ))}
                </div>
              )}
              <div className="relative flex h-full flex-col items-start justify-center gap-0.5 px-2 py-1 text-sm leading-snug">
                <span className="font-medium text-ax-text-neutral">{a.tittel}</span>
                {a.sted && <span className="text-xs leading-snug text-ax-text-neutral-subtle">{a.sted}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
