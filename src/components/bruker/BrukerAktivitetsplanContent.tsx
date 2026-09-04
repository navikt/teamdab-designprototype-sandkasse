"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRightIcon, ArrowsCirclepathIcon, PlusIcon, TrashIcon, WrenchIcon } from "@navikt/aksel-icons";
import { ActionMenu, Button, Heading, Link, ToggleGroup } from "@navikt/ds-react";
import { DekoratorHeader } from "../dekorator-lookalike/DekoratorHeader";
import { DekoratorFooter } from "../dekorator-lookalike/DekoratorFooter";
import { MalLinje } from "./MalLinje";
import { ForslagSeksjon } from "./ForslagSeksjon";
import { MineAktiviteterListe } from "./MineAktiviteterListe";
import { MineAktiviteterKalender } from "./MineAktiviteterKalender";
import { AvtaleModal } from "./AvtaleModal";
import { NyAktivitetModal, NyAktivitetType } from "./NyAktivitetModal";
import { SamtalereferatModal } from "../aktivitetsplan/samtalereferat/SamtalereferatModal";
import { AktivitetDetaljerModal } from "../aktivitetsplan/visning/AktivitetDetaljerModal";
import { initialKort } from "../aktivitetsplan/initialData";
import { AktivitetsKort, AktivitetStatus } from "../aktivitetsplan/types";
import { MINE_AKTIVITETER_KOLONNER } from "./sortering";
import { useMal } from "./mal/useMal";

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
  const [nyAktivitetType, setNyAktivitetType] = useState<NyAktivitetType | null>(null);
  const {
    hovedmal,
    setHovedmal,
    delmal,
    erAktivitetDelmal,
    leggTilDelmalFraAktivitet,
    fjernDelmalForAktivitet,
    leggTilFritekstDelmal,
    settFritekstOppnadd,
    fjernDelmal,
    flyttDelmal,
    nullstillMal,
  } = useMal(kort);

  const nullstillPrototype = () => {
    setKort(initialKort);
    nullstillMal();
  };

  const visTomAktivitetsplan = () => {
    setKort([]);
    nullstillMal();
  };

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
    setAktivtKort(k);
  };

  const kortTilStatus = (k: AktivitetsKort): AktivitetStatus =>
    k.kolonne === "fullfort" ? "fullfort" : k.kolonne === "avbrutt" ? "avbrutt" : "aktiv";

  const endreAktivitetStatus = (id: string, status: AktivitetStatus) => {
    const nyKolonne: AktivitetsKort["kolonne"] = status === "aktiv" ? "gjennomforer" : status;
    oppdaterKolonne(id, nyKolonne);
    if (status === "avbrutt") fjernDelmalForAktivitet(id);
    setAktivtKort(null);
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
          <Image src="/Hero_pictogram.png" alt="" width={160} height={103} loading="eager" style={{ width: "160px", height: "103px" }} />
          <div className="flex flex-col gap-4 flex-1">
            <Heading size="large" level="1">Aktivitetsplan</Heading>

            <MalLinje
              hovedmal={hovedmal}
              onSettHovedmal={setHovedmal}
              delmal={delmal}
              aktiviteter={kort}
              erAktivitetDelmal={erAktivitetDelmal}
              onLeggTilDelmalFraAktivitet={leggTilDelmalFraAktivitet}
              onLeggTilFritekstDelmal={leggTilFritekstDelmal}
              onSettFritekstOppnadd={settFritekstOppnadd}
              onFjernDelmal={fjernDelmal}
              onFlyttDelmal={flyttDelmal}
            />
          </div>
        </div>

        {/* Fullbredde-seksjon, bryter ut av max-w-4xl-kolonnen over */}
        <div className="w-screen relative left-1/2 -translate-x-1/2 bg-[var(--ax-bg-accent-soft)]">
          <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Heading size="medium" level="2">Mine aktiviteter</Heading>
                <ActionMenu>
                  <ActionMenu.Trigger>
                    <Button variant="primary" size="small" icon={<PlusIcon aria-hidden />}>
                      Legg til aktivitet
                    </Button>
                  </ActionMenu.Trigger>
                  <ActionMenu.Content>
                    <ActionMenu.Item onSelect={() => setNyAktivitetType("Stilling")}>
                      En jobb jeg vil søke på
                    </ActionMenu.Item>
                    <ActionMenu.Item onSelect={() => setNyAktivitetType("Jobb jeg har nå")}>
                      En jobb jeg har nå
                    </ActionMenu.Item>
                    <ActionMenu.Item onSelect={() => setNyAktivitetType("Jobbrettet egenaktivitet")}>
                      Jobbrettet egenaktivitet
                    </ActionMenu.Item>
                    <ActionMenu.Item onSelect={() => setNyAktivitetType("Behandling")}>
                      Medisinsk behandling
                    </ActionMenu.Item>
                  </ActionMenu.Content>
                </ActionMenu>
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
      {aktivtKort && !aktivtKort.samtalereferatData && aktivtKort.type !== "Jobbsøking" && (
        <AktivitetDetaljerModal
          kort={aktivtKort}
          onClose={() => setAktivtKort(null)}
          erDelmal={erAktivitetDelmal(aktivtKort.id)}
          onEndreDelmal={(erDelmal) =>
            erDelmal ? leggTilDelmalFraAktivitet(aktivtKort.id) : fjernDelmalForAktivitet(aktivtKort.id)
          }
          status={aktivtKort.kolonne === "forslag" ? undefined : kortTilStatus(aktivtKort)}
          onEndreStatus={
            aktivtKort.kolonne === "forslag"
              ? undefined
              : (status) => endreAktivitetStatus(aktivtKort.id, status)
          }
        />
      )}
      <AvtaleModal open={avtaleModalApen} onClose={() => setAvtaleModalApen(false)} />
      {nyAktivitetType && (
        <NyAktivitetModal
          type={nyAktivitetType}
          onOpprett={(kort, gjorTilDelmal) => {
            setKort((prev) => [...prev, kort]);
            if (gjorTilDelmal) leggTilDelmalFraAktivitet(kort.id);
          }}
          onClose={() => setNyAktivitetType(null)}
        />
      )}

      <DekoratorFooter />

      <div className="fixed bottom-4 right-4 z-50">
        <ActionMenu>
          <ActionMenu.Trigger>
            <Button
              variant="tertiary-neutral"
              size="small"
              icon={<WrenchIcon aria-hidden title="Prototype-verktøy" />}
            />
          </ActionMenu.Trigger>
          <ActionMenu.Content>
            <ActionMenu.Item icon={<ArrowsCirclepathIcon aria-hidden />} onSelect={nullstillPrototype}>
              Nullstill til standardtilstand
            </ActionMenu.Item>
            <ActionMenu.Item icon={<TrashIcon aria-hidden />} onSelect={visTomAktivitetsplan}>
              Vis tom aktivitetsplan
            </ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
      </div>
    </div>
  );
}
