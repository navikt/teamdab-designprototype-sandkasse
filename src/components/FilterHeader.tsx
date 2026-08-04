"use client";

import { Button, Chips, Detail, TextField } from "@navikt/ds-react";
import { StarIcon } from "@navikt/aksel-icons";

const statusFilterLabels: Record<string, string> = {
  "ikke-servicebehov": "Ikke servicebehov",
  "avslutt-forleng": "Avslutt eller forleng oppfølging",
};

export function FilterHeader({
  statusFilter,
  totalRows,
  selectedCount,
}: {
  statusFilter: string;
  totalRows: number;
  selectedCount: number;
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

      <div className="flex items-center gap-2 flex-wrap">
        <Chips>
          <Chips.Removable onClick={() => {}} variant="neutral">
            {statusFilterLabels[statusFilter] ?? statusFilter}
          </Chips.Removable>
        </Chips>

        <Button variant="secondary-neutral" size="small">
          Nullstill filtervalg
        </Button>
      </div>

      <Detail weight="semibold">
        Viser {totalRows} av totalt {totalRows} brukere. {brukerTekst}
      </Detail>
    </div>
  );
}
