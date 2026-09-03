"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, Heading, Link, ToggleGroup } from "@navikt/ds-react";
import { DekoratorHeader } from "../dekorator-lookalike/DekoratorHeader";
import { DekoratorFooter } from "../dekorator-lookalike/DekoratorFooter";
import { MalLinje } from "./MalLinje";
import { ForslagSeksjon } from "./ForslagSeksjon";
import { MineAktiviteterListe } from "./MineAktiviteterListe";
import { MineAktiviteterKalender } from "./MineAktiviteterKalender";
import { AvtaleModal } from "./AvtaleModal";
import { SamtalereferatModal } from "../aktivitetsplan/samtalereferat/SamtalereferatModal";
import { initialKort } from "../aktivitetsplan/initialData";
import { AktivitetsKort } from "../aktivitetsplan/types";
import { MINE_AKTIVITETER_KOLONNER } from "./sortering";

const VISNING_STORAGE_KEY = "minaktivitetsplan-visning";
type Visning = "liste" | "kalender";

interface BrukerAktivitetsplanContentProps {
  somVeileder?: boolean;
}

export function BrukerAktivitetsplanContent({ somVeileder = false }: BrukerAktivitetsplanContentProps) {
  const router = useRouter();
  const [kort, setKort] = useState<AktivitetsKort[]>(initialKort);
  const [visning, setVisning] = useState<Visning>("liste");
  const [aktivtKort, setAktivtKort] = useState<AktivitetsKort | null>(null);
  const [avtaleModalApen, setAvtaleModalApen] = useState(false);

  useEffect(() => {
    const lagret = window.localStorage.getItem(VISNING_STORAGE_KEY);
    if (lagret === "liste" || lagret === "kalender") setVisning(lagret);
  }, []);

  const byttVisning = (v: Visning) => {
    setVisning(v);
    window.localStorage.setItem(VISNING_STORAGE_KEY, v);
  };

  const forslag = kort.filter((k) => k.kolonne === "forslag");
  const mineAktiviteter = kort.filter((k) => MINE_AKTIVITETER_KOLONNER.includes(k.kolonne));

  const oppdaterKolonne = (id: string, kolonne: AktivitetsKort["kolonne"]) => {
    setKort((prev) => prev.map((k) => (k.id === id ? { ...k, kolonne } : k)));
  };

  const handleKortKlikk = (k: AktivitetsKort) => {
    if (k.samtalereferatData) setAktivtKort(k);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <DekoratorHeader />
      {somVeileder && (
        <div className="bg-[var(--ax-bg-info-moderate)] text-ax-text-info px-6 py-2 text-sm">
          Du ser dette som veileder — dette er nøyaktig det brukeren ser.
        </div>
      )}
      <main className="flex-1 w-full bg-ax-bg-default">
        <div className="max-w-4xl mx-auto px-6 pt-6 pb-[25px] flex items-start gap-4">
          <Image src="/Hero_pictogram.png" alt="" width={160} height={160} />
          <div className="flex flex-col gap-4 flex-1">
            <Heading size="large" level="1">Aktivitetsplan</Heading>

            <MalLinje mal="Jeg ønsker å jobbe som elektriker." />
          </div>
        </div>

        {/* Fullbredde-seksjon, bryter ut av max-w-4xl-kolonnen over */}
        <div className="w-screen relative left-1/2 -translate-x-1/2 bg-[var(--ax-bg-accent-soft)]">
          <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Heading size="medium" level="2">Mine aktiviteter</Heading>
                <Button
                  variant="secondary"
                  size="small"
                  icon={<ArrowRightIcon aria-hidden />}
                  iconPosition="right"
                  onClick={() => router.push("/minaktivitetsplan/arkiv")}
                >
                  Gå til Arkiv
                </Button>
              </div>
              <ToggleGroup
                value={visning}
                onChange={(v) => byttVisning(v as Visning)}
                size="small"
                data-color="accent"
                className="!bg-transparent"
              >
                <ToggleGroup.Item value="liste">Liste</ToggleGroup.Item>
                <ToggleGroup.Item value="kalender">Kalender</ToggleGroup.Item>
              </ToggleGroup>
            </div>
            <ForslagSeksjon
              forslag={forslag}
              onGodta={(id) => oppdaterKolonne(id, "planlegger")}
              onAvsla={(id) => oppdaterKolonne(id, "avbrutt")}
            />
            {visning === "liste" ? (
              <MineAktiviteterListe
                kort={mineAktiviteter}
                onKortKlikk={handleKortKlikk}
                onAvtaltKlikk={() => setAvtaleModalApen(true)}
              />
            ) : (
              <MineAktiviteterKalender kort={mineAktiviteter} onKortKlikk={handleKortKlikk} />
            )}

            <Link href="#" onClick={(e) => { e.preventDefault(); setAvtaleModalApen(true); }} className="text-sm">
              Om avtalen om å søke jobber
            </Link>
          </div>
        </div>
      </main>

      {aktivtKort?.samtalereferatData && (
        <SamtalereferatModal kort={aktivtKort} perspektiv="bruker" onClose={() => setAktivtKort(null)} />
      )}
      <AvtaleModal open={avtaleModalApen} onClose={() => setAvtaleModalApen(false)} />

      <DekoratorFooter />
    </div>
  );
}
