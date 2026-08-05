"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { PersonprofilContent } from "@/components/PersonprofilContent";
import { brukere, avsluttForlengBrukere } from "@/data/brukere";

// `searchParams` som server-prop krever en server og støttes ikke ved
// statisk eksport (output: "export"). Leser derfor query-param på klienten
// via useSearchParams, som må stå i en Suspense-boundary.
function PersonProfilInnhold() {
  const searchParams = useSearchParams();
  const navn = searchParams.get("navn") ?? undefined;
  const fnr = searchParams.get("fnr") ?? undefined;
  const bruker = fnr
    ? [...brukere, ...avsluttForlengBrukere].find((b) => b.fnr === fnr)
    : undefined;

  return (
    <PersonprofilContent
      brukerId={bruker?.id}
      navn={navn}
      fnr={fnr}
      merkelapper={bruker?.merkelapper}
      status={bruker?.status}
      dagerTilAvslutning={bruker?.dagerTilAvslutning}
    />
  );
}

export default function PersonProfilPage() {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <Suspense fallback={null}>
        <PersonProfilInnhold />
      </Suspense>
    </div>
  );
}
