"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@navikt/aksel-icons";
import { BodyShort, Button } from "@navikt/ds-react";
import { Timeplan } from "./testdata-unge/Timeplan";
import { TimeplanAktivitet, testdataUngeTimeplan } from "./testdata-unge/timeplanTestdata";
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

export function MineAktiviteterKalender() {
  const [valgtAktivitet, setValgtAktivitet] = useState<TimeplanAktivitet | null>(null);
  const [ukeStart, setUkeStart] = useState(() => mandagIUke(new Date()));
  const ukeSlutt = leggTilDager(ukeStart, 4);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="tertiary"
          size="xsmall"
          icon={<ChevronLeftIcon aria-hidden />}
          onClick={() => setUkeStart((u) => leggTilDager(u, -7))}
          aria-label="Forrige uke"
        >
          <span className="hidden sm:inline">Forrige uke</span>
        </Button>
        <BodyShort weight="semibold" className="text-xs sm:text-base">
          Uke {ukeStart.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit" })} – {ukeSlutt.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit" })}
        </BodyShort>
        <Button
          variant="tertiary"
          size="xsmall"
          icon={<ChevronRightIcon aria-hidden />}
          iconPosition="right"
          onClick={() => setUkeStart((u) => leggTilDager(u, 7))}
          aria-label="Neste uke"
        >
          <span className="hidden sm:inline">Neste uke</span>
        </Button>
      </div>

      <Timeplan aktiviteter={testdataUngeTimeplan} ukeStart={ukeStart} onAktivitetKlikk={setValgtAktivitet} />
      {valgtAktivitet && (
        <TimeplanAktivitetModal aktivitet={valgtAktivitet} onClose={() => setValgtAktivitet(null)} />
      )}
    </div>
  );
}
