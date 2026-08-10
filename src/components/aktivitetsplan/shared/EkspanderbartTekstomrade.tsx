"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { useState } from "react";
import { CustomBodyLong } from "./CustomBodyLong";

interface Props {
  tekst: string;
  antallTegn: number;
}

export function EkspanderbartTekstomrade({ tekst, antallTegn }: Props) {
  const [erTrunkert, setErTrunkert] = useState(true);

  if (tekst.length <= antallTegn) {
    return (
      <div className="mb-4">
        <CustomBodyLong formatLinks formatLinebreaks>
          {tekst}
        </CustomBodyLong>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <CustomBodyLong className="inline" formatLinks formatLinebreaks>
        {erTrunkert ? tekst.slice(0, antallTegn) + " ... " : tekst + " "}
      </CustomBodyLong>
      <Button variant="tertiary" onClick={() => setErTrunkert(!erTrunkert)} className="align-baseline">
        {erTrunkert ? "Les mer" : "Vis mindre"}
        {erTrunkert ? (
          <ChevronDownIcon fontSize="1.5rem" className="inline" />
        ) : (
          <ChevronUpIcon fontSize="1.5rem" className="inline" />
        )}
      </Button>
    </div>
  );
}
