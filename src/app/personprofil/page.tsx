"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { PersonprofilContent } from "@/components/PersonprofilContent";
import { brukere, avsluttForlengBrukere, avsluttForlengBrukereFase2 } from "@/data/brukere";

// `searchParams` som server-prop krever en server og støttes ikke ved
// statisk eksport (output: "export"). Leser derfor query-param på klienten
// via useSearchParams, som må stå i en Suspense-boundary.
function PersonProfilInnhold() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const avslutning = searchParams.get("avslutning") === "1";
  const fase2 = searchParams.get("fase2") === "1";
  const bruker = id
    ? [...brukere, ...avsluttForlengBrukere, ...avsluttForlengBrukereFase2].find((b) => b.id === id)
    : undefined;
  const navn = bruker?.navn;
  const fnr = bruker?.fnr;

  return (
    <PersonprofilContent
      brukerId={bruker?.id}
      navn={navn}
      fnr={fnr}
      merkelapper={bruker?.merkelapper}
      status={bruker?.status}
      statusVariant={bruker?.statusVariant}
      dagerTilAvslutning={bruker?.dagerTilAvslutning}
      avslutning={avslutning}
      fase2={fase2}
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
