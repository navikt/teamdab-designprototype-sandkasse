"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@navikt/aksel-icons";
import { Button, ToggleGroup } from "@navikt/ds-react";
import { Timeplan, TimeplanVisning } from "./testdata-unge/Timeplan";
import { TimeplanAktivitet } from "./testdata-unge/timeplanTestdata";
import { TimeplanAktivitetModal } from "./testdata-unge/TimeplanAktivitetModal";

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

export function MineAktiviteterKalender({ timeplan, sentrerPaaNaa = true }: { timeplan: TimeplanAktivitet[]; sentrerPaaNaa?: boolean }) {
  const [valgtAktivitet, setValgtAktivitet] = useState<TimeplanAktivitet | null>(null);
  const [visning, setVisning] = useState<TimeplanVisning>("uke");
  const [valgtDag, setValgtDag] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const navRef = useRef<HTMLDivElement>(null);
  const [navHoyde, setNavHoyde] = useState(0);
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setNavHoyde(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const ukeStart = mandagIUke(valgtDag);
  const ukeSlutt = leggTilDager(ukeStart, 6);
  const erUke = visning === "uke";
  const steg = erUke ? 7 : 1;
  const enhet = erUke ? "uke" : "dag";
  const statusTekst = erUke
    ? `Viser uke ${ukeStart.toLocaleDateString("nb-NO", { day: "numeric", month: "long" })} til ${ukeSlutt.toLocaleDateString("nb-NO", { day: "numeric", month: "long" })}`
    : `Viser ${valgtDag.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" })}`;

  return (
    <div
      className="flex flex-col gap-4"
      style={{ "--kalender-header-top": `calc(var(--kalender-sticky-top, 0px) + ${navHoyde}px)` } as React.CSSProperties}
    >
      <div
        ref={navRef}
        className="sticky z-30 flex items-center justify-between gap-2 bg-[var(--ax-bg-accent-soft)] px-2 pb-2 sm:px-0"
        style={{ top: "var(--kalender-sticky-top, 0px)" }}
      >
        <Button
          variant="tertiary"
          size="xsmall"
          icon={<ChevronLeftIcon aria-hidden />}
          onClick={() => setValgtDag((d) => leggTilDager(d, -steg))}
          aria-label={`Forrige ${enhet}`}
        >
          <span className="hidden sm:inline">Forrige {enhet}</span>
        </Button>
        <ToggleGroup
          value={visning}
          onChange={(v) => setVisning(v as TimeplanVisning)}
          size="small"
          data-color="accent"
          aria-label="Visning"
        >
          <ToggleGroup.Item value="dag">Dag</ToggleGroup.Item>
          <ToggleGroup.Item value="uke">Uke</ToggleGroup.Item>
        </ToggleGroup>
        <Button
          variant="tertiary"
          size="xsmall"
          icon={<ChevronRightIcon aria-hidden />}
          iconPosition="right"
          onClick={() => setValgtDag((d) => leggTilDager(d, steg))}
          aria-label={`Neste ${enhet}`}
        >
          <span className="hidden sm:inline">Neste {enhet}</span>
        </Button>
      </div>
      <span className="sr-only" aria-live="polite">{statusTekst}</span>

      <Timeplan
        aktiviteter={timeplan}
        ukeStart={ukeStart}
        visning={visning}
        valgtDag={valgtDag}
        sentrerPaaNaa={sentrerPaaNaa}
        onAktivitetKlikk={setValgtAktivitet}
      />
      {valgtAktivitet && (
        <TimeplanAktivitetModal aktivitet={valgtAktivitet} onClose={() => setValgtAktivitet(null)} />
      )}
    </div>
  );
}
