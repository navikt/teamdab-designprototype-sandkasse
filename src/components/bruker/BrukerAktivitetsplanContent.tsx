"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowsCirclepathIcon, CompassIcon, PlusIcon, TrashIcon, WrenchIcon } from "@navikt/aksel-icons";
import { ActionMenu, Button, Heading, Link, ToggleGroup } from "@navikt/ds-react";
import { DekoratorHeader } from "../dekorator-lookalike/DekoratorHeader";
import { DekoratorFooter } from "../dekorator-lookalike/DekoratorFooter";
import { MalLinje } from "./MalLinje";
import { ForslagSeksjon, ForslagVisning } from "./ForslagSeksjon";
import { MineAktiviteterListe } from "./MineAktiviteterListe";
import { MineAktiviteterKalender } from "./MineAktiviteterKalender";
import { AvtaleModal } from "./AvtaleModal";
import { NyAktivitetModal, NyAktivitetType } from "./NyAktivitetModal";
import { SamtalereferatModal } from "../aktivitetsplan/samtalereferat/SamtalereferatModal";
import { AktivitetDetaljerModal } from "../aktivitetsplan/visning/AktivitetDetaljerModal";
import { lagInitialKort } from "../aktivitetsplan/initialData";
import { AktivitetsKort, AktivitetStatus } from "../aktivitetsplan/types";
import { MINE_AKTIVITETER_KOLONNER } from "./sortering";
import { useMal } from "./mal/useMal";
import { OnboardingFlow } from "./onboarding/OnboardingFlow";
import { OnboardingResultat } from "./onboarding/types";
import { withBasePath } from "@/lib/basePath";

const VISNING_STORAGE_KEY = "minaktivitetsplan-visning";
const FORSLAG_VISNING_STORAGE_KEY = "minaktivitetsplan-forslag-visning";
const ONBOARDING_STORAGE_KEY = "minaktivitetsplan-vis-onboarding";
const KORT_STORAGE_KEY = "minaktivitetsplan-kort";
type Visning = "liste" | "kalender";

interface BrukerAktivitetsplanContentProps {
  somVeileder?: boolean;
}

export function BrukerAktivitetsplanContent({ somVeileder = false }: BrukerAktivitetsplanContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [kort, setKort] = useState<AktivitetsKort[]>(lagInitialKort);
  const [visning, setVisning] = useState<Visning>("liste");
  const [forslagVisning, setForslagVisning] = useState<ForslagVisning>("liste");
  const [avtaleModalApen, setAvtaleModalApen] = useState(false);
  const [nyAktivitetType, setNyAktivitetType] = useState<NyAktivitetType | null>(null);
  const [visOnboarding, setVisOnboarding] = useState(false);
  const [visIngenDelmalVarsel, setVisIngenDelmalVarsel] = useState(false);
  const erForstePersistering = useRef(true);
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
    setKort(lagInitialKort());
    nullstillMal();
    setVisOnboarding(false);
    setForslagVisning("liste");
    setVisIngenDelmalVarsel(false);
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    window.localStorage.removeItem(FORSLAG_VISNING_STORAGE_KEY);
  };

  const visTomAktivitetsplan = () => {
    setKort([]);
    nullstillMal();
    setVisOnboarding(true);
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
  };

  const fullforOnboarding = (resultat: OnboardingResultat) => {
    setHovedmal(resultat.malTekst);
    if (resultat.aktivitetTittel) {
      setKort((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          kolonne: "planlegger",
          type: "Jobbrettet egenaktivitet",
          title: resultat.aktivitetTittel!,
          tags: [],
        },
      ]);
    }
    setVisOnboarding(false);
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  };

  const hoppOverOnboarding = () => {
    setVisOnboarding(false);
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  };

  useEffect(() => {
    const lagret = window.localStorage.getItem(VISNING_STORAGE_KEY);
    if (lagret === "liste" || lagret === "kalender") setVisning(lagret);
    const lagretForslagVisning = window.localStorage.getItem(FORSLAG_VISNING_STORAGE_KEY);
    if (lagretForslagVisning === "varsel" || lagretForslagVisning === "liste") setForslagVisning(lagretForslagVisning);
    if (window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === "1") setVisOnboarding(true);
    const lagretKort = window.localStorage.getItem(KORT_STORAGE_KEY);
    if (lagretKort) {
      try {
        setKort(JSON.parse(lagretKort));
      } catch {
        // ignorer korrupt lagret data, behold demo-kortene
      }
    }
  }, []);

  // Persisterer kortene slik at en refresh midt i onboardingen ikke faller tilbake til demo-utvalget.
  // Hopper over selve mount-skrivingen for å unngå å overskrive lagret data med demo-verdien før den er lastet inn.
  useEffect(() => {
    if (erForstePersistering.current) {
      erForstePersistering.current = false;
      return;
    }
    window.localStorage.setItem(KORT_STORAGE_KEY, JSON.stringify(kort));
  }, [kort]);

  const byttVisning = (v: Visning) => {
    setVisning(v);
    window.localStorage.setItem(VISNING_STORAGE_KEY, v);
  };

  const byttForslagVisning = (visSomVarsel: boolean) => {
    const nyVisning: ForslagVisning = visSomVarsel ? "varsel" : "liste";
    setForslagVisning(nyVisning);
    window.localStorage.setItem(FORSLAG_VISNING_STORAGE_KEY, nyVisning);
  };

  const forslag = kort.filter((k) => k.kolonne === "forslag");
  const mineAktiviteter = kort.filter((k) => MINE_AKTIVITETER_KOLONNER.includes(k.kolonne));

  // Routet modal (samme mønster som /aktivitet/vis/:id og /aktivitet/endre/:id i prod-appen):
  // hvilken aktivitet som vises/redigeres ligger i URL-en, slik at nettleserens tilbakeknapp
  // og delbare lenker fungerer som forventet, i stedet for kun client-side state.
  const aktivitetId = searchParams.get("aktivitetId");
  const redigerModus = searchParams.get("rediger") === "1";
  const aktivtKort = kort.find((k) => k.id === aktivitetId) ?? null;

  const navigerMedParams = (endringer: Record<string, string | null>) => {
    const nyeParams = new URLSearchParams(searchParams.toString());
    for (const [navn, verdi] of Object.entries(endringer)) {
      if (verdi === null) nyeParams.delete(navn);
      else nyeParams.set(navn, verdi);
    }
    const qs = nyeParams.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const apneAktivitet = (id: string) => navigerMedParams({ aktivitetId: id, rediger: null });
  const lukkAktivitet = () => navigerMedParams({ aktivitetId: null, rediger: null });
  const settRedigerModus = (v: boolean) => navigerMedParams({ rediger: v ? "1" : null });

  const oppdaterKolonne = (id: string, kolonne: AktivitetsKort["kolonne"]) => {
    setKort((prev) => prev.map((k) => (k.id === id ? { ...k, kolonne } : k)));
  };

  const handleKortKlikk = (k: AktivitetsKort) => {
    apneAktivitet(k.id);
  };

  const kortTilStatus = (k: AktivitetsKort): AktivitetStatus =>
    k.kolonne === "fullfort" ? "fullfort" : k.kolonne === "avbrutt" ? "avbrutt" : "aktiv";

  const endreAktivitetStatus = (id: string, status: AktivitetStatus) => {
    const nyKolonne: AktivitetsKort["kolonne"] = status === "aktiv" ? "gjennomforer" : status;
    oppdaterKolonne(id, nyKolonne);
    if (status === "avbrutt") fjernDelmalForAktivitet(id);
    lukkAktivitet();
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
        {visOnboarding ? (
          <OnboardingFlow onFullfor={fullforOnboarding} onHopp={hoppOverOnboarding} />
        ) : (
        <>
        <div className="max-w-4xl mx-auto px-6 pt-6 pb-[25px] flex flex-col gap-4 relative">
          <Image
            src={withBasePath("/Trenger-hjelp-til-a-komme-i-jobb.png")}
            alt=""
            width={80}
            height={80}
            loading="eager"
            style={{ width: "80px", height: "80px" }}
            className="hidden lg:block absolute right-full top-8 mr-8 shrink-0"
          />
          <div className="flex flex-col gap-4 flex-1">
            <Heading size="large" level="1">Aktivitetsplan</Heading>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lg">
              <Link href="#" onClick={(e) => { e.preventDefault(); router.push("/minaktivitetsplan/arkiv"); }}>
                Arkiv
              </Link>
              <Link href="#" onClick={(e) => { e.preventDefault(); router.push("/minaktivitetsplan/arkiv?type=Samtalereferat"); }}>
                Samtalereferater
              </Link>
              <Link href="#">
                Dialog med veileder
              </Link>
              <Link href="#" onClick={(e) => { e.preventDefault(); setAvtaleModalApen(true); }}>
                Avtale om å søke jobber
              </Link>
            </div>

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
              visIngenDelmalVarsel={visIngenDelmalVarsel}
              onSkjulIngenDelmalVarsel={() => setVisIngenDelmalVarsel(false)}
            />
          </div>
        </div>

        {/* Fullbredde-seksjon, bryter ut av max-w-4xl-kolonnen over */}
        <div className="w-screen relative left-1/2 -translate-x-1/2 bg-[var(--ax-bg-accent-soft)]">
          <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ActionMenu>
                  <ActionMenu.Trigger>
                    <Button variant="primary" size="small" icon={<PlusIcon aria-hidden />}>
                      Ny aktivitet
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
            <div className={forslagVisning === "liste" && forslag.length > 0 ? "mb-4" : undefined}>
              <ForslagSeksjon
                forslag={forslag}
                visning={forslagVisning}
                onGodta={(id) => oppdaterKolonne(id, "planlegger")}
                onAvsla={(id) => oppdaterKolonne(id, "avbrutt")}
                onKortKlikk={handleKortKlikk}
              />
            </div>
            {visning === "liste" ? (
              <MineAktiviteterListe
                kort={mineAktiviteter}
                onKortKlikk={handleKortKlikk}
                onAvtaltKlikk={() => setAvtaleModalApen(true)}
              />
            ) : (
              <MineAktiviteterKalender />
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="#">
                Hva er aktivitetsplanen?
              </Link>
              <Link href="#" onClick={(e) => { e.preventDefault(); window.print(); }}>
                Skriv ut
              </Link>
            </div>
          </div>
        </div>
        </>
        )}
      </main>

      {aktivtKort?.samtalereferatData && (
        <SamtalereferatModal kort={aktivtKort} perspektiv="bruker" onClose={lukkAktivitet} />
      )}
      {aktivtKort && !aktivtKort.samtalereferatData && aktivtKort.type !== "Jobbsøking" && (
        <AktivitetDetaljerModal
          kort={aktivtKort}
          onClose={lukkAktivitet}
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
          onOppdater={(oppdatertKort) =>
            setKort((prev) => prev.map((k) => (k.id === oppdatertKort.id ? oppdatertKort : k)))
          }
          redigerModus={redigerModus}
          onEndreRedigerModus={settRedigerModus}
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
            <ActionMenu.CheckboxItem
              checked={forslagVisning === "varsel"}
              onCheckedChange={byttForslagVisning}
            >
              Vis forslag som varsel
            </ActionMenu.CheckboxItem>
            <ActionMenu.CheckboxItem
              checked={visIngenDelmalVarsel}
              onCheckedChange={setVisIngenDelmalVarsel}
            >
              Vis &quot;ingen delmål&quot;-varsel
            </ActionMenu.CheckboxItem>
            <ActionMenu.Item icon={<CompassIcon aria-hidden />} onSelect={() => router.push("/minaktivitetsplan/onboarding-oversikt")}>
              Vis onboarding-flyt (oversikt)
            </ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
      </div>
    </div>
  );
}
