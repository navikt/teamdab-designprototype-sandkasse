"use client";

import { SomVeilederBanner } from "@/components/SomVeilederBanner";
import { BrukerAktivitetsplanContent } from "@/components/bruker/BrukerAktivitetsplanContent";

export function FramtidBrukerSide({ somVeileder }: { somVeileder: boolean }) {
  return <BrukerAktivitetsplanContent banner={somVeileder ? <SomVeilederBanner /> : undefined} />;
}

// Plassholder: framtidens aktivitetsplan vist inne i veilederens personprofil.
// Byttes ut når veilederens versjon av framtidsvisjonen designes.
export function FramtidVeilederAktivitetsplan() {
  return (
    <div className="w-full">
      <BrukerAktivitetsplanContent embedded skjulDekorator />
    </div>
  );
}
