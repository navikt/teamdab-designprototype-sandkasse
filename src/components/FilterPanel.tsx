"use client";

import { useState } from "react";
import { Label, RadioGroup, Tabs } from "@navikt/ds-react";
import { StarIcon, PersonGroupIcon, FunnelIcon, VitalsIcon } from "@navikt/aksel-icons";
import { statustallEnhet as st } from "@/data/statustall";
import { BarInputRadio } from "./sidebar/BarInputRadio";
import { BarInputCheckbox } from "./sidebar/BarInputCheckbox";

export function FilterPanel({
  statusFilter,
  onStatusFilterChange,
}: {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}) {
  const [checkboxFilters, setCheckboxFilters] = useState<string[]>([]);

  const handleCheckboxChange = (checked: boolean, value: string) => {
    setCheckboxFilters((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  return (
    <div className="bg-ax-bg-default w-[22rem] shrink-0">
      <Tabs defaultValue="status" size="small" iconPosition="top">
        <Tabs.List>
          <Tabs.Tab value="status" icon={<VitalsIcon aria-hidden />} label="Status" />
          <Tabs.Tab value="mine-filter" icon={<StarIcon aria-hidden />} label="Mine filter" />
          <Tabs.Tab value="veiledergrupper" icon={<PersonGroupIcon aria-hidden />} label="Veiledergrupper" />
          <Tabs.Tab value="filter" icon={<FunnelIcon aria-hidden />} label="Filter" />
        </Tabs.List>

        <Tabs.Panel value="status" className="p-6">
          <Label className="mb-4 block">{st.totalt} brukere</Label>

          <div className="mt-2">
            <BarInputCheckbox
              filterVerdi="ufordelte-brukere"
              labelTekst="Ufordelte brukere"
              antall={st.ufordelteBrukere}
              checked={checkboxFilters.includes("ufordelte-brukere")}
              onChange={handleCheckboxChange}
            />
          </div>

          <RadioGroup hideLegend legend="" size="small" value={statusFilter} onChange={onStatusFilterChange}>
            <div className="forste-barlabel-i-gruppe">
              <BarInputRadio filterVerdi="trenger-oppfolgingsvedtak" labelTekst="Trenger oppfølgingsvedtak § 14 a" statustall={st.trengerOppfolgingsvedtak} />
              <BarInputRadio filterVerdi="utkast-oppfolgingsvedtak" labelTekst="Utkast oppfølgingsvedtak § 14 a" statustall={st.underVurdering} />
              <BarInputRadio filterVerdi="sykmeldt-med-arbeidsgiver" labelTekst="Sykmeldt med arbeidsgiver" statustall={st.erSykmeldtMedArbeidsgiver} />
            </div>
            <div className="forste-barlabel-i-gruppe">
              <BarInputRadio filterVerdi="venter-svar-nav" labelTekst="Venter på svar fra Nav" statustall={st.venterPaSvarFraNAV} />
              <BarInputRadio filterVerdi="venter-svar-bruker" labelTekst="Venter på svar fra bruker" statustall={st.venterPaSvarFraBruker} />
              <BarInputRadio filterVerdi="mote-nav-i-dag" labelTekst="Møte med Nav i dag" statustall={st.moterMedNAVIdag} />
              <BarInputRadio filterVerdi="hendelser-pa-tiltak" labelTekst="Hendelser på tiltak" statustall={st.tiltakshendelser} />
            </div>
            <div className="forste-barlabel-i-gruppe">
              <BarInputRadio filterVerdi="utgatte-varsel" labelTekst="Utgåtte varsel" statustall={st.utgatteVarsel} />
              <BarInputRadio filterVerdi="udelte-samtalereferat" labelTekst="Udelte samtalereferat" statustall={st.udelteSamtalereferat} />
              <BarInputRadio filterVerdi="utlopte-aktiviteter" labelTekst="Utløpte aktiviteter" statustall={st.utlopteAktiviteter} />
              <BarInputRadio filterVerdi="ikke-i-avtalt-aktivitet" labelTekst="Ikke i avtalt aktivitet" statustall={st.ikkeIavtaltAktivitet} />
              <BarInputRadio filterVerdi="i-avtalt-aktivitet" labelTekst="I avtalt aktivitet" statustall={st.iavtaltAktivitet} />
            </div>
            <div className="forste-barlabel-i-gruppe">
              <BarInputRadio filterVerdi="ikke-servicebehov" labelTekst="Ikke servicebehov" statustall={st.inaktiveBrukere} />
              <BarInputRadio filterVerdi="avslutt-forleng" labelTekst="Kandidater for avslutning" statustall={st.kandidaterForUtmelding} />
            </div>
          </RadioGroup>
        </Tabs.Panel>

        <Tabs.Panel value="mine-filter" className="p-6">
          {null}
        </Tabs.Panel>
        <Tabs.Panel value="veiledergrupper" className="p-6">
          {null}
        </Tabs.Panel>
        <Tabs.Panel value="filter" className="p-6">
          {null}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
