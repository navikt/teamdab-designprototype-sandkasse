"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, CompassIcon } from "@navikt/aksel-icons";
import { BodyShort } from "@navikt/ds-react";

interface MalLinjeProps {
  mal: string;
}

export function MalLinje({ mal }: MalLinjeProps) {
  const [apen, setApen] = useState(false);

  return (
    <div className="border border-ax-border-neutral-subtle rounded-md bg-ax-bg-default">
      <button
        type="button"
        onClick={() => setApen((v) => !v)}
        className="flex items-center gap-2 w-full px-4 py-2 text-left"
        aria-expanded={apen}
      >
        <CompassIcon aria-hidden fontSize="1.25rem" className="shrink-0 text-ax-text-neutral" />
        <BodyShort className="flex-1 truncate">
          <strong>Mitt mål:</strong> {mal}
        </BodyShort>
        {apen ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
      </button>
      {apen && (
        <div className="px-4 pb-4 pt-1 flex flex-col gap-2 border-t border-ax-border-neutral-subtle">
          <BodyShort>{mal}</BodyShort>
          {/* Fremdriftsmåling er scopet ut for nå, jf. avklaring i planleggingsfasen */}
          <BodyShort size="small" className="text-[var(--ax-text-neutral-subtle)]">
            Fremgang mot målet vises her senere.
          </BodyShort>
        </div>
      )}
    </div>
  );
}
