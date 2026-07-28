"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { PersonprofilContent } from "@/components/PersonprofilContent";

// `searchParams` som server-prop krever en server og støttes ikke ved
// statisk eksport (output: "export"). Leser derfor query-param på klienten
// via useSearchParams, som må stå i en Suspense-boundary.
function PersonProfilInnhold() {
  const searchParams = useSearchParams();
  const navn = searchParams.get("navn") ?? undefined;

  return <PersonprofilContent navn={navn} />;
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
