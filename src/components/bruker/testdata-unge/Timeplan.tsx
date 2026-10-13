"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { TimeplanAktivitet, TimeplanFarge } from "./timeplanTestdata";

const UKEDAGER = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

export type TimeplanVisning = "uke" | "dag";
const FORSTE_TIME = 7;
const SISTE_TIME = 23; // kalenderen slutter ved 23:00
const TIMER = Array.from({ length: SISTE_TIME - FORSTE_TIME }, (_, i) => FORSTE_TIME + i);
const TIME_HOYDE_REM = 5;
const MIN_KOLONNE_REM = 6.5;
const HEADER_HOYDE_REM = 3.5;

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
  visning: TimeplanVisning;
  valgtDag: Date;
  onAktivitetKlikk: (aktivitet: TimeplanAktivitet) => void;
}

function leggTilDager(dato: Date, dager: number): Date {
  const d = new Date(dato);
  d.setDate(d.getDate() + dager);
  return d;
}

export function Timeplan({ aktiviteter, ukeStart, visning, valgtDag, onAktivitetKlikk }: TimeplanProps) {
  const datoer = visning === "uke" ? [0, 1, 2, 3, 4, 5, 6].map((i) => leggTilDager(ukeStart, i)) : [valgtDag];
  const dager = datoer.map((dato) => ({ dato, ukedagIndeks: (dato.getDay() + 6) % 7 }));
  const antallKolonner = dager.length;
  const erDag = visning === "dag";
  const [naa, setNaa] = useState<Date | null>(null);
  useEffect(() => {
    setNaa(new Date());
    const id = setInterval(() => setNaa(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  const iDagIndeks = naa ? datoer.findIndex((d) => d.toDateString() === naa.toDateString()) : -1;
  const minutterIDag = naa ? naa.getHours() * 60 + naa.getMinutes() : 0;

  const gridRef = useRef<HTMLDivElement>(null);
  const sondeRef = useRef<HTMLDivElement>(null);
  // Horisontal scroll gjør containeren til scroll-container, og da fungerer ikke position: sticky mot siden.
  // Headerraden flyttes derfor med transform ved sidescroll.
  useEffect(() => {
    const grid = gridRef.current;
    const sonde = sondeRef.current;
    if (!grid || !sonde) return;
    const oppdater = () => {
      const celler = grid.querySelectorAll<HTMLElement>("[data-header-celle]");
      const stickyTop = parseFloat(getComputedStyle(sonde).top) || 0;
      const headerHoyde = celler[0]?.offsetHeight ?? 0;
      const forskyvning = Math.min(
        Math.max(0, stickyTop - grid.getBoundingClientRect().top),
        Math.max(0, grid.offsetHeight - headerHoyde),
      );
      celler.forEach((c) => (c.style.transform = `translateY(${forskyvning}px)`));
    };
    oppdater();
    window.addEventListener("scroll", oppdater, { passive: true });
    window.addEventListener("resize", oppdater);
    const observer = new ResizeObserver(oppdater);
    observer.observe(grid);
    return () => {
      window.removeEventListener("scroll", oppdater);
      window.removeEventListener("resize", oppdater);
      observer.disconnect();
    };
  }, [visning]);

  const naaLinjeRef = useRef<HTMLDivElement>(null);
  const harSentrert = useRef(false);
  const naaLinjeSynlig = iDagIndeks >= 0 && minutterIDag >= FORSTE_TIME * 60 && minutterIDag < SISTE_TIME * 60;
  useEffect(() => {
    if (harSentrert.current || !naaLinjeSynlig) return;
    harSentrert.current = true;
    naaLinjeRef.current?.scrollIntoView({ block: "center" });
  }, [naaLinjeSynlig]);

  return (
    <div className="overflow-x-auto border-y border-ax-border-neutral-subtle sm:rounded-md sm:border">
      <div
        ref={gridRef}
        className="relative grid"
        style={{
          minWidth: erDag ? undefined : `${2.75 + MIN_KOLONNE_REM * antallKolonner}rem`,
          gridTemplateColumns: `2.75rem repeat(${antallKolonner}, minmax(${erDag ? 0 : MIN_KOLONNE_REM}${erDag ? "" : "rem"}, 1fr))`,
          gridTemplateRows: `${HEADER_HOYDE_REM}rem repeat(${TIMER.length}, ${TIME_HOYDE_REM}rem)`,
        }}
      >
        <div data-header-celle className="sticky left-0 z-30 border-b border-r border-ax-border-neutral-subtle bg-ax-bg-neutral-soft" style={{ gridColumn: 1, gridRow: 1 }} />
        {dager.map(({ dato, ukedagIndeks }, i) => (
          <div
            key={dato.toDateString()}
            data-header-celle
            className={`relative z-20 flex flex-col items-center justify-center gap-0.5 border-b border-ax-border-neutral-subtle bg-ax-bg-neutral-soft py-1 ${erDag ? "text-sm sm:text-base" : "text-xs sm:text-sm"} font-semibold text-ax-text-neutral`}
            style={{ gridColumn: i + 2, gridRow: 1 }}
          >
            <span>{UKEDAGER[ukedagIndeks]}</span>
            <span className={`${erDag ? "text-sm" : "text-xs"} font-normal text-ax-text-subtle`}>
              {dato.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit" })}
            </span>
          </div>
        ))}

        <div
          ref={sondeRef}
          aria-hidden
          className="pointer-events-none invisible absolute"
          style={{ top: "var(--kalender-header-top, 0px)" }}
        />
        <div
          className="sticky left-0 z-10 border-r border-ax-border-neutral-subtle bg-ax-bg-default"
          style={{ gridColumn: 1, gridRow: `2 / ${TIMER.length + 2}` }}
        />
        {TIMER.map((time, i) => (
          <Fragment key={time}>
            <div
              className="sticky left-0 z-20 pr-2 text-right text-xs sm:text-sm text-ax-text-subtle"
              style={{ gridColumn: 1, gridRow: i + 2 }}
            >
              <span className={`absolute right-2 ${time === FORSTE_TIME ? "top-1" : "top-0 -translate-y-1/2"}`}>{time}:00</span>
            </div>
            {dager.map((dag, j) => (
              <div
                key={`${time}-${dag.dato.toDateString()}`}
                className="border-b border-r border-ax-border-neutral-subtle"
                style={{ gridColumn: j + 2, gridRow: i + 2 }}
              />
            ))}
          </Fragment>
        ))}

        {naaLinjeSynlig && (
          <div
            aria-hidden
            className="pointer-events-none relative z-[5]"
            style={{ gridColumn: `2 / ${antallKolonner + 2}`, gridRow: `2 / ${TIMER.length + 2}` }}
          >
            <div ref={naaLinjeRef} className="absolute inset-x-0 h-0.5" style={{ top: `${((minutterIDag - FORSTE_TIME * 60) / ((SISTE_TIME - FORSTE_TIME) * 60)) * 100}%`, backgroundColor: "var(--ax-bg-danger-strong)" }}>
              <div className="absolute rounded-full" style={{ left: `calc(${(iDagIndeks / antallKolonner) * 100}% - 4px)`, top: -3, width: 8, height: 8, backgroundColor: "var(--ax-bg-danger-strong)" }} />
            </div>
          </div>
        )}

        {aktiviteter.map((a) => {
          const dagIndeks = dager.findIndex(({ ukedagIndeks }) => ukedagIndeks >= a.ukedagFra - 1 && ukedagIndeks <= a.ukedagTil - 1);
          if (visning === "dag" && dagIndeks < 0) return null;
          const antallDager = visning === "uke" ? a.ukedagTil - a.ukedagFra + 1 : 1;
          const kolonneFra = visning === "uke" ? a.ukedagFra + 1 : 2;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onAktivitetKlikk(a)}
              className={`relative m-0.5 block cursor-pointer overflow-hidden rounded-md border text-left transition hover:brightness-95 active:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ax-border-accent ${FARGE_KLASSER[a.farge]}`}
              style={{
                gridColumn: `${kolonneFra} / ${kolonneFra + antallDager}`,
                gridRow: `${Math.max(a.timeFra, FORSTE_TIME) - FORSTE_TIME + 2} / ${Math.min(a.timeTil, SISTE_TIME) - FORSTE_TIME + 2}`,
              }}
            >
              {antallDager > 1 && (
                <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${antallDager}, 1fr)` }}>
                  {Array.from({ length: antallDager - 1 }).map((_, i) => (
                    <div key={i} className="border-r border-black/10" />
                  ))}
                </div>
              )}
              <div className={`relative flex h-full flex-col items-start justify-center gap-0.5 px-1 py-1 leading-snug sm:px-2 ${erDag ? "text-sm sm:text-base" : "text-xs sm:text-sm"}`}>
                <span className="font-medium text-ax-text-neutral">{a.tittel}</span>
                {a.sted && <span className={`${erDag ? "text-sm" : "text-xs"} leading-snug text-ax-text-neutral-subtle`}>{a.sted}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
