"use client";

import { useEffect, useState } from "react";
import { ActionMenu, Button, Tabs, ToggleGroup } from "@navikt/ds-react";
import { TimerStartIcon, XMarkIcon, ExclamationmarkTriangleFillIcon, InformationSquareFillIcon, LeaveIcon, ChatIcon, ArrowsCirclepathIcon, WrenchIcon } from "@navikt/aksel-icons";
import { Topbar } from "./Topbar";
import { Visittkort } from "./Visittkort";
import { DekoratorHeader } from "./dekorator-lookalike/DekoratorHeader";
import { BrukerAktivitetsplanContent } from "./bruker/BrukerAktivitetsplanContent";
import { PersonprofilTabBar } from "./PersonprofilTabBar";
import { AktivitetsplanSection } from "./AktivitetsplanSection";
import { AktivitetsplanBoard } from "./aktivitetsplan/AktivitetsplanBoard";
import { MoteModaler, MoteModalState } from "./aktivitetsplan/mote/MoteModaler";
import { IjobbModaler, IjobbModalState } from "./aktivitetsplan/ijobb/IjobbModaler";
import { useAktivitetsKort } from "./aktivitetsplan/useAktivitetsKort";
import { lagInitialKort } from "./aktivitetsplan/initialData";
import { DialogSection } from "./dialog/DialogSection";
import { ForlengOppfolgingModal } from "./ForlengOppfolgingModal";
import { AvsluttOppfolgingModal } from "./AvsluttOppfolgingModal";
import { KanIkkeAvslutteModal } from "./KanIkkeAvslutteModal";

import { Merkelapp } from "@/data/brukere";
import { Perspektiv, Visning } from "./aktivitetsplan/types";

const BLOKKERTE_BRUKERE = new Set(["a3"]);
const VISNING_STORAGE_KEY = "aktivitetsplan-prototype:vis-som:v1";
const GYLDIGE_VISNINGER: Visning[] = ["gammel-veileder", "gammel-bruker", "ny"];

interface Props {
  brukerId?: string;
  navn?: string;
  fnr?: string;
  merkelapper?: Merkelapp[];
  status?: string;
  statusVariant?: "danger" | "neutral" | "warning" | "info";
  dagerTilAvslutning?: number;
  avslutning?: boolean;
  fase2?: boolean;
  startVisning?: Visning;
}

export function PersonprofilContent({ brukerId, navn, fnr, merkelapper, status, statusVariant, dagerTilAvslutning, avslutning = false, fase2 = false, startVisning }: Props) {
  const erBlokkerteAvslutt = brukerId ? BLOKKERTE_BRUKERE.has(brukerId) : false;
  const [infoCardHidden, setInfoCardHidden] = useState(false);
  const [alertVariant, setAlertVariant] = useState<"info" | "warning">("warning");
  const [visning, setVisning] = useState<Visning>("gammel-veileder");
  const perspektiv: Perspektiv = visning === "gammel-veileder" ? "veileder" : "bruker";
  const [aktivTab, setAktivTab] = useState("aktivitetsplan");
  const [aktivitetsKort, setAktivitetsKort] = useAktivitetsKort();
  const [moteModal, setMoteModal] = useState<MoteModalState>(null);
  const [ijobbModal, setIjobbModal] = useState<IjobbModalState>(null);
  const [forlengOpen, setForlengOpen] = useState(false);
  const [avsluttOpen, setAvsluttOpen] = useState(false);

  // Lagret valg leses etter mount for å unngå hydration mismatch (samme mønster som useAktivitetsKort).
  useEffect(() => {
    // Navigasjon fra oversiktene skal alltid lande i gammel aktivitetsplan (veileder-visning).
    const lagret = startVisning ?? window.localStorage.getItem(VISNING_STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (GYLDIGE_VISNINGER.includes(lagret as Visning)) setVisning(lagret as Visning);
  }, [startVisning]);

  const byttVisning = (v: Visning) => {
    setVisning(v);
    window.localStorage.setItem(VISNING_STORAGE_KEY, v);
  };

  const nullstillAktivitetsplan = () => {
    setAktivitetsKort(lagInitialKort());
    setMoteModal(null);
    setIjobbModal(null);
  };

  const handleForlengBekreft = () => {
    setForlengOpen(false);
    setInfoCardHidden(true);
  };

  const handleAvsluttBekreft = () => {
    setAvsluttOpen(false);
    setInfoCardHidden(true);
  };

  const aktivitetsplanInnhold = (
    <>
          <div className="w-full max-w-3xl px-6">
            <AktivitetsplanSection onOpprettMote={() => setMoteModal({ type: "opprett" })} onOpprettIjobb={() => setIjobbModal({ type: "opprett" })} />
          </div>
          <div className="w-full px-6">
            <AktivitetsplanBoard
              perspektiv={perspektiv}
              kort={aktivitetsKort}
              setKort={setAktivitetsKort}
              onMoteKlikk={(id) => setMoteModal({ type: "detaljer", id })}
              onIjobbKlikk={(id) => setIjobbModal({ type: "detaljer", id })}
            />
            <IjobbModaler
              state={ijobbModal}
              setState={setIjobbModal}
              kort={aktivitetsKort}
              setKort={setAktivitetsKort}
              perspektiv={perspektiv}
            />
            <MoteModaler
              state={moteModal}
              setState={setMoteModal}
              kort={aktivitetsKort}
              setKort={setAktivitetsKort}
              perspektiv={perspektiv}
              brukerNavn={navn ?? "Bruker"}
            />
          </div>
    </>
  );

  const verktoyMeny = (
    <div className="fixed bottom-24 right-6 z-50">
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button variant="tertiary-neutral" size="small" icon={<WrenchIcon aria-hidden title="Prototype-verktøy" />} />
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Item icon={<ArrowsCirclepathIcon aria-hidden />} onSelect={nullstillAktivitetsplan}>
            Nullstill til standardtilstand
          </ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
    </div>
  );

  const visSomPanel = (
    <div className="fixed bottom-6 right-6 z-50 bg-ax-bg-default shadow-lg rounded-lg p-2">
      <ToggleGroup value={visning} onChange={(v) => byttVisning(v as Visning)} size="small" label="Vis som">
        <ToggleGroup.Item value="gammel-veileder">Veileder</ToggleGroup.Item>
        <ToggleGroup.Item value="gammel-bruker">Bruker</ToggleGroup.Item>
        <ToggleGroup.Item value="ny">Bruker (ny)</ToggleGroup.Item>
      </ToggleGroup>
    </div>
  );

  if (visning === "ny") {
    return (
      <>
        <div className="flex-1 overflow-y-auto">
          <BrukerAktivitetsplanContent embedded />
        </div>
        {visSomPanel}
      </>
    );
  }

  if (visning === "gammel-bruker") {
    return (
      <>
        <DekoratorHeader />
        <div className="flex-1 flex flex-col items-center gap-6 py-6 overflow-y-auto overflow-x-hidden">
          {aktivitetsplanInnhold}
        </div>
        {verktoyMeny}
        {visSomPanel}
      </>
    );
  }

  return (
    <>
      <Topbar />
      <Visittkort
        navn={navn}
        fnr={fnr}
        status={status}
        statusVariant={statusVariant}
        merkelapper={merkelapper}
        onOpenForleng={() => setForlengOpen(true)}
        onOpenAvslutt={() => setAvsluttOpen(true)}
      />
      {!infoCardHidden && avslutning && !(fase2 && dagerTilAvslutning != null) && (
        <div className="bg-[var(--ax-bg-warning-moderate)] text-[var(--ax-text-warning)] flex items-center w-full px-4 py-2">
          <ExclamationmarkTriangleFillIcon
            aria-hidden
            fontSize="1.25rem"
            className="shrink-0 -translate-y-[2px]"
            style={{ color: "var(--ax-border-warning)" }}
          />
          <div className="flex items-center gap-3 flex-1 mx-3">
            <span>Skal denne brukeren fortsatt ha oppfølging?</span>
            <Button
              variant="secondary-neutral"
              size="small"
              icon={<TimerStartIcon aria-hidden />}
              iconPosition="left"
              onClick={() => setForlengOpen(true)}
              className="shrink-0 !bg-white hover:!bg-[var(--ax-bg-neutral-moderate-hover)]"
            >
              Ja, forleng oppfølging
            </Button>
            <Button
              variant="secondary-neutral"
              size="small"
              icon={<LeaveIcon aria-hidden />}
              iconPosition="left"
              onClick={() => setAvsluttOpen(true)}
              className="shrink-0 !bg-white hover:!bg-[var(--ax-bg-neutral-moderate-hover)]"
            >
              Nei, avslutt nå
            </Button>
          </div>
          <Button
            variant="tertiary-neutral"
            size="small"
            icon={<XMarkIcon aria-hidden />}
            aria-label="Lukk"
            onClick={() => setInfoCardHidden(true)}
            className="shrink-0"
          />
        </div>
      )}
      {!infoCardHidden && avslutning && fase2 && dagerTilAvslutning != null && (
        <div className={`flex items-center w-full px-4 py-2 ${
            alertVariant === "info"
              ? "bg-[var(--ax-bg-info-moderate)] text-[var(--ax-text-info)]"
              : "bg-[var(--ax-bg-warning-moderate)] text-[var(--ax-text-warning)]"
          }`}>
          {alertVariant === "info" ? (
            <InformationSquareFillIcon
              aria-hidden
              fontSize="1.25rem"
              className="shrink-0 -translate-y-[2px] cursor-pointer"
              style={{ color: "var(--ax-border-info)" }}
              onClick={() => setAlertVariant("warning")}
            />
          ) : (
            <ExclamationmarkTriangleFillIcon
              aria-hidden
              fontSize="1.25rem"
              className="shrink-0 -translate-y-[2px] cursor-pointer"
              style={{ color: "var(--ax-border-warning)" }}
              onClick={() => setAlertVariant("info")}
            />
          )}
          <div className="flex items-center gap-3 flex-1 mx-3">
            <span><strong>Oppfølging avsluttes automatisk om {dagerTilAvslutning} dager hvis du ikke foretar deg noe.</strong></span>
            <span>Skal denne brukeren fortsatt ha oppfølging?</span>
            <Button
              variant="secondary-neutral"
              size="small"
              icon={<TimerStartIcon aria-hidden />}
              iconPosition="left"
              onClick={() => setForlengOpen(true)}
              className="shrink-0 !bg-white hover:!bg-[var(--ax-bg-neutral-moderate-hover)]"
            >
              Ja, forleng oppfølging
            </Button>
            <Button
              variant="secondary-neutral"
              size="small"
              icon={<LeaveIcon aria-hidden />}
              iconPosition="left"
              onClick={() => setAvsluttOpen(true)}
              className="shrink-0 !bg-white hover:!bg-[var(--ax-bg-neutral-moderate-hover)]"
            >
              Nei, avslutt nå
            </Button>
          </div>
          <Button
            variant="tertiary-neutral"
            size="small"
            icon={<XMarkIcon aria-hidden />}
            aria-label="Lukk"
            onClick={() => setInfoCardHidden(true)}
            className="shrink-0"
          />
        </div>
      )}
<Tabs value={aktivTab} onChange={setAktivTab} className="flex flex-col flex-1 overflow-hidden">
        <PersonprofilTabBar />
        <Tabs.Panel value="aktivitetsplan" className="flex-1 flex flex-col items-center gap-6 py-6 overflow-x-hidden">
          {aktivitetsplanInnhold}
        </Tabs.Panel>
        <Tabs.Panel value="dialog" className="flex flex-1 overflow-hidden">
          <DialogSection />
        </Tabs.Panel>
      </Tabs>

      {verktoyMeny}
      {visSomPanel}

      <ForlengOppfolgingModal
        open={forlengOpen}
        onClose={() => setForlengOpen(false)}
        onBekreft={handleForlengBekreft}
        status={status}
        merkelapper={merkelapper}
      />
      {erBlokkerteAvslutt ? (
        <KanIkkeAvslutteModal
          open={avsluttOpen}
          onClose={() => setAvsluttOpen(false)}
        />
      ) : (
        <AvsluttOppfolgingModal
          open={avsluttOpen}
          onClose={() => setAvsluttOpen(false)}
          onBekreft={handleAvsluttBekreft}
        />
      )}
    </>
  );
}
