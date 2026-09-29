"use client";

import { useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CompassIcon,
  FlagCrossIcon,
  HandshakeIcon,
  HardHatIcon,
  HospitalIcon,
  LaptopIcon,
  MagnifyingGlassIcon,
  MeetingSmallIcon,
  MenuElipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@navikt/aksel-icons";
import { ActionMenu, BodyShort, Button, Checkbox, Process } from "@navikt/ds-react";
import { DelmalVisning } from "./mal/useMal";
import { RedigerMalModal } from "./mal/RedigerMalModal";
import { LeggTilDelmalModal } from "./mal/LeggTilDelmalModal";
import { AktivitetsKort } from "../aktivitetsplan/types";

// Ikon per aktivitetstype, slik at delmål gjenspeiler hva slags aktivitet de er koblet til.
const AKTIVITET_TYPE_IKON: Record<string, typeof BriefcaseIcon> = {
  "Jobb jeg har nå": BriefcaseIcon,
  Stilling: BriefcaseIcon,
  "Stilling fra Nav": BriefcaseIcon,
  Jobbsøking: MagnifyingGlassIcon,
  Samtalereferat: MeetingSmallIcon,
  "Møte med Nav": MeetingSmallIcon,
  Arbeidstrening: HardHatIcon,
  "Jobbrettet egenaktivitet": LaptopIcon,
  "Tiltak gjennom Nav": HandshakeIcon,
  Behandling: HospitalIcon,
};

function delmalIkon(d: DelmalVisning) {
  const Ikon =
    d.kilde === "aktivitet" ? (d.aktivitetType && AKTIVITET_TYPE_IKON[d.aktivitetType]) || BriefcaseIcon : FlagCrossIcon;
  return <Ikon aria-hidden />;
}

interface MalLinjeProps {
  hovedmal: string;
  onSettHovedmal: (nyttMal: string) => void;
  delmal: DelmalVisning[];
  aktiviteter: AktivitetsKort[];
  erAktivitetDelmal: (aktivitetId: string) => boolean;
  onLeggTilDelmalFraAktivitet: (aktivitetId: string) => void;
  onLeggTilFritekstDelmal: (tekst: string) => void;
  onSettFritekstOppnadd: (id: string, oppnadd: boolean) => void;
  onFjernDelmal: (id: string) => void;
  onFlyttDelmal: (id: string, retning: "opp" | "ned") => void;
}

export function MalLinje({
  hovedmal,
  onSettHovedmal,
  delmal,
  aktiviteter,
  erAktivitetDelmal,
  onLeggTilDelmalFraAktivitet,
  onLeggTilFritekstDelmal,
  onSettFritekstOppnadd,
  onFjernDelmal,
  onFlyttDelmal,
}: MalLinjeProps) {
  const [apen, setApen] = useState(false);
  const [redigerModalApen, setRedigerModalApen] = useState(false);
  const [leggTilModalApen, setLeggTilModalApen] = useState(false);

  return (
    <div className="border border-ax-border-neutral-subtle rounded-md bg-ax-bg-default">
      <div className="flex items-center gap-2 w-full px-4 py-2">
        <button
          type="button"
          onClick={() => setApen((v) => !v)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left rounded px-2 py-1 -mx-2 -my-1 hover:bg-ax-bg-neutral-soft transition-colors"
          aria-expanded={apen}
        >
          <CompassIcon aria-hidden fontSize="1.25rem" className="shrink-0 text-ax-text-neutral" />
          <BodyShort className="flex-1 truncate">
            <strong>Mitt mål:</strong> {hovedmal}
          </BodyShort>
        </button>
        <Button
          variant="tertiary"
          size="small"
          icon={<PencilIcon aria-hidden />}
          onClick={() => setRedigerModalApen(true)}
        >
          Rediger
        </Button>
        <button
          type="button"
          onClick={() => setApen((v) => !v)}
          aria-expanded={apen}
          aria-label={apen ? "Skjul delmål" : "Vis delmål"}
          className="shrink-0 rounded p-1 hover:bg-ax-bg-neutral-soft transition-colors"
        >
          {apen ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
        </button>
      </div>
      {apen && (
        <div className="px-6 pb-6 pt-4 flex flex-col gap-4 border-t border-ax-border-neutral-subtle">
          <BodyShort size="small" className="text-ax-text-neutral-subtle mt-2">
            Mine delmål
          </BodyShort>
          {delmal.length === 0 ? (
            <BodyShort size="small" className="text-ax-text-neutral-subtle">
              Du har ingen delmål ennå.
            </BodyShort>
          ) : (
            <Process>
              {delmal.map((d, index) => (
                <Process.Event
                  key={d.id}
                  status={d.oppnadd ? "completed" : undefined}
                  bullet={delmalIkon(d)}
                >
                  <div className="flex items-center gap-2">
                    <BodyShort className="flex-1">{d.tittel}</BodyShort>
                    <ActionMenu>
                      <ActionMenu.Trigger>
                        <Button
                          data-color="neutral"
                          variant="tertiary"
                          size="small"
                          icon={<MenuElipsisVerticalIcon title="Valg for delmål" />}
                        />
                      </ActionMenu.Trigger>
                      <ActionMenu.Content>
                        <ActionMenu.Item
                          icon={<ArrowUpIcon aria-hidden />}
                          disabled={index === 0}
                          onSelect={() => onFlyttDelmal(d.id, "opp")}
                        >
                          Flytt opp
                        </ActionMenu.Item>
                        <ActionMenu.Item
                          icon={<ArrowDownIcon aria-hidden />}
                          disabled={index === delmal.length - 1}
                          onSelect={() => onFlyttDelmal(d.id, "ned")}
                        >
                          Flytt ned
                        </ActionMenu.Item>
                        <ActionMenu.Item
                          icon={<TrashIcon aria-hidden />}
                          onSelect={() => onFjernDelmal(d.id)}
                        >
                          Fjern
                        </ActionMenu.Item>
                      </ActionMenu.Content>
                    </ActionMenu>
                  </div>
                  {d.kilde === "fritekst" && (
                    <Checkbox
                      checked={d.oppnadd}
                      onChange={(e) => onSettFritekstOppnadd(d.id, e.target.checked)}
                    >
                      Oppnådd
                    </Checkbox>
                  )}
                </Process.Event>
              ))}
            </Process>
          )}
          <div>
            <Button variant="secondary" size="small" onClick={() => setLeggTilModalApen(true)}>
              Legg til delmål
            </Button>
          </div>
        </div>
      )}

      {redigerModalApen && (
        <RedigerMalModal
          hovedmal={hovedmal}
          onLagre={onSettHovedmal}
          onClose={() => setRedigerModalApen(false)}
        />
      )}
      {leggTilModalApen && (
        <LeggTilDelmalModal
          aktiviteter={aktiviteter}
          erAktivitetDelmal={erAktivitetDelmal}
          onLeggTilFraAktivitet={onLeggTilDelmalFraAktivitet}
          onLeggTilFritekst={onLeggTilFritekstDelmal}
          onClose={() => setLeggTilModalApen(false)}
        />
      )}
    </div>
  );
}
