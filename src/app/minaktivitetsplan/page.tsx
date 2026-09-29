"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BrukerAktivitetsplanContent } from "@/components/bruker/BrukerAktivitetsplanContent";

function MinAktivitetsplanInnhold() {
  const searchParams = useSearchParams();
  const somVeileder = searchParams.get("somVeileder") === "1";
  return <BrukerAktivitetsplanContent somVeileder={somVeileder} />;
}

export default function MinAktivitetsplanPage() {
  return (
    <Suspense fallback={null}>
      <MinAktivitetsplanInnhold />
    </Suspense>
  );
}
