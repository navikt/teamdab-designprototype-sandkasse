"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDemoRouter } from "@/demo/useOppsett";
import { SomVeilederBanner } from "@/components/SomVeilederBanner";
import { brukerSideHref, trygtRetur } from "@/demo/retur";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { Button, Heading } from "@navikt/ds-react";
import { DekoratorHeader } from "@/components/dekorator-lookalike/DekoratorHeader";
import { ArkivFane } from "@/components/bruker/ArkivFane";
import { ArkivFilterMeny } from "@/components/bruker/ArkivFilterMeny";
import { ARKIV_KOLONNER } from "@/components/bruker/sortering";
import { SamtalereferatModal } from "@/components/aktivitetsplan/samtalereferat/SamtalereferatModal";
import { AktivitetDetaljerModal } from "@/components/aktivitetsplan/visning/AktivitetDetaljerModal";
import { useAktivitetsKort } from "@/components/aktivitetsplan/useAktivitetsKort";
import { AktivitetsKort } from "@/components/aktivitetsplan/types";

function ArkivInnhold() {
  const router = useDemoRouter();
  const searchParams = useSearchParams();
  // Fra profilen (embedded) går tilbake rett til profilen; fra «Se som bruker» til forhåndsvisningen.
  const retur = trygtRetur(searchParams.get("retur"));
  const tilbakeHref = retur && searchParams.get("somVeileder") !== "1" ? retur : brukerSideHref(searchParams);
  const [aktivtKort, setAktivtKort] = useState<AktivitetsKort | null>(null);
  const [alleKort] = useAktivitetsKort();
  const arkiv = useMemo(
    () => alleKort.filter((k) => ARKIV_KOLONNER.includes(k.kolonne)),
    [alleKort],
  );
  const alleTyper = useMemo(
    () => Array.from(new Set(arkiv.map((k) => k.type))).sort((a, b) => a.localeCompare(b, "nb")),
    [arkiv],
  );
  const [valgteTyper, setValgteTyper] = useState<string[]>(() => {
    const typeParam = searchParams.get("type");
    return typeParam ? [typeParam] : [];
  });
  const filtrertArkiv = valgteTyper.length === 0 ? arkiv : arkiv.filter((k) => valgteTyper.includes(k.type));

  const toggleType = (type: string) => {
    setValgteTyper((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DekoratorHeader />
      {searchParams.get("somVeileder") === "1" && <SomVeilederBanner />}
      <main className="flex-1 w-full bg-[var(--ax-bg-accent-soft)]">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col gap-4">
          <Button
            variant="tertiary"
            size="small"
            icon={<ArrowLeftIcon aria-hidden />}
            onClick={() => router.push(tilbakeHref)}
            className="self-start"
          >
            Tilbake til aktivitetsplan
          </Button>
          <Heading size="large" level="1">Arkiv</Heading>
          <ArkivFilterMeny
            alleTyper={alleTyper}
            valgteTyper={valgteTyper}
            onToggleType={toggleType}
          />
          <ArkivFane
            kort={filtrertArkiv}
            onKortKlikk={(k) => setAktivtKort(k)}
            tomTekst={
              valgteTyper.length > 0
                ? "Ingen aktiviteter matcher valgt filter."
                : undefined
            }
          />
        </div>
      </main>

      {aktivtKort?.samtalereferatData && (
        <SamtalereferatModal kort={aktivtKort} perspektiv="bruker" onClose={() => setAktivtKort(null)} />
      )}
      {aktivtKort && !aktivtKort.samtalereferatData && aktivtKort.type !== "Jobbsøking" && (
        <AktivitetDetaljerModal kort={aktivtKort} onClose={() => setAktivtKort(null)} />
      )}
    </div>
  );
}

export default function ArkivPage() {
  return (
    <Suspense fallback={null}>
      <ArkivInnhold />
    </Suspense>
  );
}
