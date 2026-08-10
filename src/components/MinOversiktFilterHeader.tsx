"use client";

import { Button, Chips, Detail, TextField } from "@navikt/ds-react";
import { StarIcon } from "@navikt/aksel-icons";

const statusFilterLabels: Record<string, string> = {
  "nye-brukere": "Nye brukere",
  "mine-huskelapper": "Mine huskelapper",
  "trenger-oppfolgingsvedtak": "Trenger oppfølgingsvedtak § 14 a",
  "utkast-oppfolgingsvedtak": "Utkast oppfølgingsvedtak § 14 a",
  "sykmeldt-med-arbeidsgiver": "Sykmeldt med arbeidsgiver",
  "venter-svar-nav": "Venter på svar fra Nav",
  "venter-svar-bruker": "Venter på svar fra bruker",
  "mote-nav-i-dag": "Møte med Nav i dag",
  "hendelser-pa-tiltak": "Hendelser på tiltak",
  "utgatte-varsel": "Utgåtte varsel",
  "udelte-samtalereferat": "Udelte samtalereferat",
  "utlopte-aktiviteter": "Utløpte aktiviteter",
  "ikke-i-avtalt-aktivitet": "Ikke i avtalt aktivitet",
  "i-avtalt-aktivitet": "I avtalt aktivitet",
  "ikke-servicebehov": "Ikke servicebehov",
  "avslutt-forleng": "Kandidater for utmelding",
};

export function MinOversiktFilterHeader({
  statusFilter,
  totalRows,
  selectedCount,
  onClearFilter,
}: {
  statusFilter: string | null;
  totalRows: number;
  selectedCount: number;
  onClearFilter: () => void;
}) {
  const brukerTekst =
    selectedCount === 0
      ? "Ingen brukere valgt."
      : `${selectedCount} brukere valgt.`;

  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <TextField
          label="Søk"
          hideLabel
          size="small"
          placeholder="Søk etter navn eller fødselsnummer"
          className="flex-1"
        />
        <Button variant="secondary-neutral" size="small" icon={<StarIcon aria-hidden />} iconPosition="left">
          Lagre filter
        </Button>
      </div>

      {statusFilter && (
        <div className="flex items-center gap-2 flex-wrap">
          <Chips>
            <Chips.Removable onClick={onClearFilter} variant="neutral">
              {statusFilterLabels[statusFilter] ?? statusFilter}
            </Chips.Removable>
          </Chips>

          <Button variant="secondary-neutral" size="small" onClick={onClearFilter}>
            Nullstill filtervalg
          </Button>
        </div>
      )}

      <Detail weight="semibold">
        Viser {totalRows} av totalt {totalRows} brukere. {brukerTekst}
      </Detail>
    </div>
  );
}
