"use client";

import { Button } from "@navikt/ds-react";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { useSearchParams } from "next/navigation";
import { trygtRetur } from "@/demo/retur";
import { useDemoRouter } from "@/demo/useOppsett";

// «Se som bruker» er en ekte funksjon i veilederens verktøymeny, ikke en demo-funksjon.
export function SomVeilederBanner() {
  const router = useDemoRouter();
  const retur = trygtRetur(useSearchParams().get("retur"));
  return (
    <div className="bg-[var(--ax-bg-info-moderate)] text-ax-text-info px-6 py-2 text-sm flex items-center gap-4">
      <span>Du ser dette som veileder. Dette er nøyaktig det brukeren ser.</span>
      <Button variant="tertiary" size="xsmall" icon={<ArrowLeftIcon aria-hidden />} onClick={() => (retur ? router.push(retur) : router.back())}>
        Tilbake til veileder
      </Button>
    </div>
  );
}
