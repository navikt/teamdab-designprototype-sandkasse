"use client";

import { Button, Chips, Detail, TextField } from "@navikt/ds-react";
import { StarIcon } from "@navikt/aksel-icons";

export function FilterHeader() {
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
            Avslutt eller forleng oppfølging
          </Chips.Removable>
        </Chips>

        <Button variant="secondary-neutral" size="small">
          Nullstill filtervalg
        </Button>
      </div>

      <Detail weight="semibold">
        Viser 3 av totalt 3 brukere. 3 brukere valgt.
      </Detail>
    </div>
  );
}
