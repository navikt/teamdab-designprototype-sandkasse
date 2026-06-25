"use client";

import { Button } from "@navikt/ds-react";
import { PersonPlusIcon, MagnifyingGlassIcon, TableIcon } from "@navikt/aksel-icons";

export function Toolbar() {
  return (
    <div className="px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Button variant="tertiary-neutral" size="xsmall" icon={<PersonPlusIcon aria-hidden />} iconPosition="left">
          Tildel veileder
        </Button>
        <Button variant="tertiary-neutral" size="xsmall" icon={<MagnifyingGlassIcon aria-hidden />} iconPosition="left">
          Søk veileder
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="tertiary-neutral" size="xsmall" icon={<TableIcon aria-hidden />} iconPosition="left">
          Velg kolonner
        </Button>
        <Button variant="tertiary-neutral" size="xsmall" disabled>
          Vis 200 per side
        </Button>
        <Button variant="primary" size="small" style={{ backgroundColor: "var(--ax-bg-neutral-strong)", borderColor: "var(--ax-bg-neutral-strong)" }}>
          1
        </Button>
      </div>
    </div>
  );
}
