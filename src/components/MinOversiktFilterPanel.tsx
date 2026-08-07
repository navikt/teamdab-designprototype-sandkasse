"use client";

import { Heading, Radio, RadioGroup, Tabs } from "@navikt/ds-react";
import { StarIcon, FunnelIcon, VitalsIcon } from "@navikt/aksel-icons";

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

          <div className="flex flex-col gap-4">
            <RadioGroup legend="Status" hideLegend size="small" value={statusFilter} onChange={onStatusFilterChange}>
              <Radio value="nye-brukere">Nye brukere</Radio>
              <Radio value="mine-huskelapper">Mine huskelapper</Radio>
            </RadioGroup>

            <hr className="border-t border-[var(--ax-border-default,#c6c2bf)]" />

            <RadioGroup legend="Status 2" hideLegend size="small" value="">
              <Radio value="trenger-oppfolgingsvedtak">Trenger oppfølgingsvedtak § 14 a</Radio>
              <Radio value="utkast-oppfolgingsvedtak">Utkast oppfølgingsvedtak § 14 a</Radio>
              <Radio value="sykmeldt-med-arbeidsgiver">Sykmeldt med arbeidsgiver</Radio>
            </RadioGroup>

            <hr className="border-t border-[var(--ax-border-default,#c6c2bf)]" />

            <RadioGroup legend="Status 3" hideLegend size="small" value="">
              <Radio value="venter-svar-nav">Venter på svar fra Nav</Radio>
              <Radio value="venter-svar-bruker">Venter på svar fra bruker</Radio>
              <Radio value="mote-nav-i-dag">Møte med Nav i dag</Radio>
              <Radio value="hendelser-pa-tiltak">Hendelser på tiltak</Radio>
            </RadioGroup>

            <hr className="border-t border-[var(--ax-border-default,#c6c2bf)]" />

            <RadioGroup legend="Status 4" hideLegend size="small" value="">
              <Radio value="utgatte-varsel">Utgåtte varsel</Radio>
              <Radio value="udelte-samtalereferat">Udelte samtalereferat</Radio>
              <Radio value="utlopte-aktiviteter">Utløpte aktiviteter</Radio>
              <Radio value="ikke-i-avtalt-aktivitet">Ikke i avtalt aktivitet</Radio>
              <Radio value="i-avtalt-aktivitet">I avtalt aktivitet</Radio>
            </RadioGroup>

            <hr className="border-t border-[var(--ax-border-default,#c6c2bf)]" />

            <RadioGroup legend="Status 5" hideLegend size="small" value={statusFilter} onChange={onStatusFilterChange}>
              <Radio value="ikke-servicebehov">Ikke servicebehov</Radio>
              <Radio value="avslutt-forleng">Kandidater for utmelding</Radio>
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
