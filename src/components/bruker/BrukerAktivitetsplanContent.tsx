"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Heading, Link, ToggleGroup } from "@navikt/ds-react";
import { DekoratorHeader } from "../dekorator-lookalike/DekoratorHeader";
import { MalLinje } from "./MalLinje";
import { ForslagSeksjon, ForslagVisning } from "./ForslagSeksjon";
import { MineAktiviteterListe } from "./MineAktiviteterListe";
import { MineAktiviteterKalender } from "./MineAktiviteterKalender";
import { AvtaleModal } from "./AvtaleModal";
import { LeggTilAktivitetMeny } from "../aktivitetsplan/mote/LeggTilAktivitetMeny";
import { MoteModaler, MoteModalState } from "../aktivitetsplan/mote/MoteModaler";
import { IjobbModaler, IjobbModalState } from "../aktivitetsplan/ijobb/IjobbModaler";
import { useAktivitetsKort } from "../aktivitetsplan/useAktivitetsKort";
import { SamtalereferatModal } from "../aktivitetsplan/samtalereferat/SamtalereferatModal";
import { AktivitetDetaljerModal } from "../aktivitetsplan/visning/AktivitetDetaljerModal";
import { AktivitetsKort, AktivitetStatus } from "../aktivitetsplan/types";
import { MINE_AKTIVITETER_KOLONNER } from "./sortering";
import { useMal } from "./mal/useMal";
import { OnboardingFlow } from "./onboarding/OnboardingFlow";
import { OnboardingResultat } from "./onboarding/types";
import { withBasePath } from "@/lib/basePath";
import { lagringsNokkel } from "@/demo/oppsett";
import { medRetur, trygtRetur } from "@/demo/retur";
import { useLagretTilstand } from "@/demo/useLagretTilstand";
import { useDemoRouter, useOppsett, useScenario } from "@/demo/useOppsett";

type Visning = "liste" | "kalender";

interface BrukerAktivitetsplanContentProps {
  // Vises inne i personprofilen: fyller ikke hele skjermhøyden.
  embedded?: boolean;
  skjulDekorator?: boolean;
  // Vises under dekoratøren, f.eks. «Du ser dette som veileder».
  banner?: ReactNode;
}

export function BrukerAktivitetsplanContent({ embedded = false, skjulDekorator = false, banner }: BrukerAktivitetsplanContentProps) {
  const router = useRouter();
  const demoRouter = useDemoRouter();
  const oppsett = useOppsett();
  const scenario = useScenario();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [kort, setKort] = useAktivitetsKort();
  const [visning, setVisning] = useLagretTilstand<Visning>(lagringsNokkel(oppsett, "visning"), () => scenario.startVisning);
  const forslagVisning: ForslagVisning = oppsett.forslagSomVarsel ? "varsel" : "liste";
  const [avtaleModalApen, setAvtaleModalApen] = useState(false);
  const [moteModal, setMoteModal] = useState<MoteModalState>(null);
  const [ijobbModal, setIjobbModal] = useState<IjobbModalState>(null);
  const [visOnboarding, setVisOnboarding] = useLagretTilstand<boolean>(
    lagringsNokkel(oppsett, "onboarding"),
    () => scenario.startMedOnboarding,
  );
  const [delmalVarselSkjult, setDelmalVarselSkjult] = useState(false);
  const visIngenDelmalVarsel = oppsett.visIngenDelmalVarsel && !delmalVarselSkjult;
  const stickyRef = useRef<HTMLDivElement>(null);
  const [harByttetVisning, setHarByttetVisning] = useState(false);
  const [stickyHoyde, setStickyHoyde] = useState(0);
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
  } = useMal(kort);

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
  };

  const hoppOverOnboarding = () => {
    setVisOnboarding(false);
  };

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setStickyHoyde(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, [visOnboarding, embedded]);

  const byttVisning = (v: Visning) => {
    setVisning(v);
    setHarByttetVisning(true);
  };

  const forslag = kort.filter((k) => k.kolonne === "forslag");
  const mineAktiviteter = kort.filter((k) => MINE_AKTIVITETER_KOLONNER.includes(k.kolonne));

  // Routet modal (samme mønster som /aktivitet/vis/:id og /aktivitet/endre/:id i prod-appen):
  // hvilken aktivitet som vises/redigeres ligger i URL-en, slik at nettleserens tilbakeknapp
  // og delbare lenker fungerer som forventet, i stedet for kun client-side state.
  const aktivitetId = searchParams.get("aktivitetId");
  const redigerModus = searchParams.get("rediger") === "1";
  const aktivtKort = kort.find((k) => k.id === aktivitetId) ?? null;

  // Arkivet må vite hvor veilederen kom fra: profilen (embedded) eller «Se som bruker»-forhåndsvisningen.
  const arkivHref = (href: string) => {
    if (embedded) {
      const retur = new URLSearchParams(searchParams.toString());
      retur.delete("aktivitetId");
      retur.delete("rediger");
      return medRetur(href, `${pathname}?${retur.toString()}`);
    }
    const retur = trygtRetur(searchParams.get("retur"));
    return searchParams.get("somVeileder") === "1" && retur ? medRetur(href, retur, true) : href;
  };

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
    if (k.type === "Møte med Nav") setMoteModal({ type: "detaljer", id: k.id });
    else if (k.type === "Jobb jeg har nå") setIjobbModal({ type: "detaljer", id: k.id });
    else apneAktivitet(k.id);
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
    <div className={`flex flex-col overflow-x-clip ${embedded ? "" : "min-h-screen"}`}>
      {!skjulDekorator && <DekoratorHeader />}
      {banner}
      <main className="flex-1 w-full bg-ax-bg-default">
        {visOnboarding && !embedded ? (
          <OnboardingFlow onFullfor={fullforOnboarding} onHopp={hoppOverOnboarding} />
        ) : (
        <>
        <div className={`max-w-4xl mx-auto px-6 ${embedded ? "pt-12" : "pt-6"} pb-[25px] flex flex-col gap-4 relative`}>
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
              <Link href="#" onClick={(e) => { e.preventDefault(); demoRouter.push(arkivHref("/minaktivitetsplan/arkiv")); }}>
                Arkiv
              </Link>
              <Link href="#" onClick={(e) => { e.preventDefault(); demoRouter.push(arkivHref("/minaktivitetsplan/arkiv?type=Samtalereferat")); }}>
                Samtalereferater
              </Link>
              <Link href="#">
                Dialog med veileder
              </Link>
              <Link href="#" onClick={(e) => { e.preventDefault(); setAvtaleModalApen(true); }}>
                Avtale om å søke jobber
              </Link>
              <Link href="#">
                Hva er aktivitetsplanen?
              </Link>
              <Link href="#" onClick={(e) => { e.preventDefault(); window.print(); }}>
                Skriv ut
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
              onSkjulIngenDelmalVarsel={() => setDelmalVarselSkjult(true)}
            />
          </div>
        </div>

        {/* Fullbredde-seksjon, bryter ut av max-w-4xl-kolonnen over */}
        <div
          className="w-screen relative left-1/2 -translate-x-1/2 bg-[var(--ax-bg-accent-soft)]"
          style={{ "--kalender-sticky-top": `${stickyHoyde}px` } as React.CSSProperties}
        >
          <div ref={stickyRef} className="sticky top-0 z-40 bg-[var(--ax-bg-accent-soft)]">
            <div className="max-w-4xl mx-auto px-6 pt-6 pb-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <LeggTilAktivitetMeny
                  onVelgMote={() => setMoteModal({ type: "opprett" })}
                  onVelgIjobb={() => setIjobbModal({ type: "opprett" })}
                />
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
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-6 pb-6 flex flex-col gap-3">
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
              <div className="-mx-6">
                <MineAktiviteterKalender timeplan={scenario.timeplan} sentrerPaaNaa={!harByttetVisning} />
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </main>

      {aktivtKort?.samtalereferatData && (
        <SamtalereferatModal kort={aktivtKort} perspektiv="bruker" onClose={lukkAktivitet} />
      )}
      {aktivtKort &&
        !aktivtKort.samtalereferatData &&
        aktivtKort.type !== "Jobbsøking" &&
        aktivtKort.type !== "Møte med Nav" &&
        aktivtKort.type !== "Jobb jeg har nå" && (
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
      <MoteModaler
        state={moteModal}
        setState={setMoteModal}
        kort={kort}
        setKort={setKort}
        perspektiv="bruker"
        brukerNavn="Bruker"
      />
      <IjobbModaler
        state={ijobbModal}
        setState={setIjobbModal}
        kort={kort}
        setKort={setKort}
        perspektiv="bruker"
      />
    </div>
  );
}
