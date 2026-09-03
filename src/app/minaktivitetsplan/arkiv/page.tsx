"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { Button, Heading } from "@navikt/ds-react";
import { DekoratorHeader } from "@/components/dekorator-lookalike/DekoratorHeader";
import { DekoratorFooter } from "@/components/dekorator-lookalike/DekoratorFooter";
import { ArkivFane } from "@/components/bruker/ArkivFane";
import { ARKIV_KOLONNER } from "@/components/bruker/sortering";
import { SamtalereferatModal } from "@/components/aktivitetsplan/samtalereferat/SamtalereferatModal";
import { initialKort } from "@/components/aktivitetsplan/initialData";
import { AktivitetsKort } from "@/components/aktivitetsplan/types";

export default function ArkivPage() {
  const router = useRouter();
  const [aktivtKort, setAktivtKort] = useState<AktivitetsKort | null>(null);
  const arkiv = initialKort.filter((k) => ARKIV_KOLONNER.includes(k.kolonne));

  return (
    <div className="flex flex-col min-h-screen">
      <DekoratorHeader />
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-6 flex flex-col gap-4">
        <Button
          variant="tertiary"
          size="small"
          icon={<ArrowLeftIcon aria-hidden />}
          onClick={() => router.push("/minaktivitetsplan")}
          className="self-start"
        >
          Tilbake til aktivitetsplan
        </Button>
        <Heading size="large" level="1">Arkiv</Heading>
        <ArkivFane
          kort={arkiv}
          onKortKlikk={(k) => {
            if (k.samtalereferatData) setAktivtKort(k);
          }}
        />
      </main>

      {aktivtKort?.samtalereferatData && (
        <SamtalereferatModal kort={aktivtKort} perspektiv="bruker" onClose={() => setAktivtKort(null)} />
      )}
      <DekoratorFooter />
    </div>
  );
}
