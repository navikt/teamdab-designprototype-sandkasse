"use client";

import { DekoratorHeader } from "@/components/dekorator-lookalike/DekoratorHeader";
import { SomVeilederBanner } from "@/components/SomVeilederBanner";
import { NaavaerendeAktivitetsplan } from "./NaavaerendeAktivitetsplan";

export function NaavaerendeBrukerSide({ somVeileder }: { somVeileder: boolean }) {
  return (
    <div className="flex flex-col min-h-screen">
      <DekoratorHeader />
      {somVeileder && <SomVeilederBanner />}
      <div className="flex-1 flex flex-col items-center gap-6 py-6 overflow-x-hidden">
        <NaavaerendeAktivitetsplan perspektiv="bruker" />
      </div>
    </div>
  );
}
