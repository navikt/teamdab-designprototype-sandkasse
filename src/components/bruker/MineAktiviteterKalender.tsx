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
      <div className="flex items-center justify-between">
        <Button
          variant="tertiary"
          size="small"
          icon={<ChevronLeftIcon aria-hidden />}
          onClick={() => setUkeStart((u) => leggTilDager(u, -7))}
        >
          Forrige uke
        </Button>
        <BodyShort weight="semibold">
          Uke {ukeStart.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit" })} – {ukeSlutt.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit" })}
        </BodyShort>
        <Button
          variant="tertiary"
          size="small"
          icon={<ChevronRightIcon aria-hidden />}
          iconPosition="right"
          onClick={() => setUkeStart((u) => leggTilDager(u, 7))}
        >
          Neste uke
        </Button>
      </div>

      <Timeplan aktiviteter={testdataUngeTimeplan} ukeStart={ukeStart} onAktivitetKlikk={setValgtAktivitet} />
      {valgtAktivitet && (
        <TimeplanAktivitetModal aktivitet={valgtAktivitet} onClose={() => setValgtAktivitet(null)} />
      )}
    </div>
  );
}
