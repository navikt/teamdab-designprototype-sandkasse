"use client";

import { Heading, Radio, RadioGroup, Tabs } from "@navikt/ds-react";
import { StarIcon, FunnelIcon, VitalsIcon } from "@navikt/aksel-icons";
import { avsluttForlengBrukere, brukere } from "@/data/brukere";

const filterCounts: Record<string, number> = {
  "ikke-servicebehov": brukere.length,
  "avslutt-forleng": avsluttForlengBrukere.length,
};

function RadioLabel({ label, count }: { label: string; count: number }) {
  return (
    <span className="grid grid-cols-[1fr_auto] gap-2 flex-1">
      <span>{label}</span>
      <span className="text-ax-text-subtle tabular-nums font-bold justify-self-end">{count}</span>
    </span>
  );
}

export function MinOversiktFilterPanel({
  statusFilter,
  onStatusFilterChange,
}: {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}) {
  return (
    <div className="bg-ax-bg-default w-[22rem] shrink-0">
      <Tabs defaultValue="status" size="small" iconPosition="top">
        <Tabs.List>
          <Tabs.Tab value="status" icon={<VitalsIcon aria-hidden />} label="Status" />
          <Tabs.Tab value="mine-filter" icon={<StarIcon aria-hidden />} label="Mine filter" />
          <Tabs.Tab value="filter" icon={<FunnelIcon aria-hidden />} label="Filter" />
        </Tabs.List>

        <Tabs.Panel value="status" className="p-6">
          <Heading level="2" size="medium" spacing>
            Status
          </Heading>

          <div className="flex flex-col gap-4 [&_.aksel-radio]:w-full">
            <RadioGroup legend="Status" hideLegend size="small" value={statusFilter} onChange={onStatusFilterChange}>
              <Radio value="nye-brukere"><RadioLabel label="Nye brukere" count={filterCounts["nye-brukere"] ?? 0} /></Radio>
              <Radio value="mine-huskelapper"><RadioLabel label="Mine huskelapper" count={filterCounts["mine-huskelapper"] ?? 0} /></Radio>
            </RadioGroup>

            <hr className="border-t border-[var(--ax-border-default,#c6c2bf)]" />

            <RadioGroup legend="Status 2" hideLegend size="small" value="">
              <Radio value="trenger-oppfolgingsvedtak"><RadioLabel label="Trenger oppfølgingsvedtak § 14 a" count={filterCounts["trenger-oppfolgingsvedtak"] ?? 0} /></Radio>
              <Radio value="utkast-oppfolgingsvedtak"><RadioLabel label="Utkast oppfølgingsvedtak § 14 a" count={filterCounts["utkast-oppfolgingsvedtak"] ?? 0} /></Radio>
              <Radio value="sykmeldt-med-arbeidsgiver"><RadioLabel label="Sykmeldt med arbeidsgiver" count={filterCounts["sykmeldt-med-arbeidsgiver"] ?? 0} /></Radio>
            </RadioGroup>

            <hr className="border-t border-[var(--ax-border-default,#c6c2bf)]" />

            <RadioGroup legend="Status 3" hideLegend size="small" value="">
              <Radio value="venter-svar-nav"><RadioLabel label="Venter på svar fra Nav" count={filterCounts["venter-svar-nav"] ?? 0} /></Radio>
              <Radio value="venter-svar-bruker"><RadioLabel label="Venter på svar fra bruker" count={filterCounts["venter-svar-bruker"] ?? 0} /></Radio>
              <Radio value="mote-nav-i-dag"><RadioLabel label="Møte med Nav i dag" count={filterCounts["mote-nav-i-dag"] ?? 0} /></Radio>
              <Radio value="hendelser-pa-tiltak"><RadioLabel label="Hendelser på tiltak" count={filterCounts["hendelser-pa-tiltak"] ?? 0} /></Radio>
            </RadioGroup>

            <hr className="border-t border-[var(--ax-border-default,#c6c2bf)]" />

            <RadioGroup legend="Status 4" hideLegend size="small" value="">
              <Radio value="utgatte-varsel"><RadioLabel label="Utgåtte varsel" count={filterCounts["utgatte-varsel"] ?? 0} /></Radio>
              <Radio value="udelte-samtalereferat"><RadioLabel label="Udelte samtalereferat" count={filterCounts["udelte-samtalereferat"] ?? 0} /></Radio>
              <Radio value="utlopte-aktiviteter"><RadioLabel label="Utløpte aktiviteter" count={filterCounts["utlopte-aktiviteter"] ?? 0} /></Radio>
              <Radio value="ikke-i-avtalt-aktivitet"><RadioLabel label="Ikke i avtalt aktivitet" count={filterCounts["ikke-i-avtalt-aktivitet"] ?? 0} /></Radio>
              <Radio value="i-avtalt-aktivitet"><RadioLabel label="I avtalt aktivitet" count={filterCounts["i-avtalt-aktivitet"] ?? 0} /></Radio>
            </RadioGroup>

            <hr className="border-t border-[var(--ax-border-default,#c6c2bf)]" />

            <RadioGroup legend="Status 5" hideLegend size="small" value={statusFilter} onChange={onStatusFilterChange}>
              <Radio value="ikke-servicebehov"><RadioLabel label="Ikke servicebehov" count={filterCounts["ikke-servicebehov"] ?? 0} /></Radio>
              <Radio value="avslutt-forleng"><RadioLabel label="Kandidater for utmelding" count={filterCounts["avslutt-forleng"] ?? 0} /></Radio>
            </RadioGroup>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="mine-filter" className="p-6">
          {null}
        </Tabs.Panel>
        <Tabs.Panel value="filter" className="p-6">
          {null}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
