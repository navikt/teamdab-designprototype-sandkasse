"use client";

import { useState } from "react";
import { Button, Tabs, ToggleGroup } from "@navikt/ds-react";
import { TimerStartIcon, XMarkIcon, ExclamationmarkTriangleFillIcon, InformationSquareFillIcon, LeaveIcon, ChatIcon } from "@navikt/aksel-icons";
import { Visittkort } from "./Visittkort";
import { PersonprofilTabBar } from "./PersonprofilTabBar";
import { AktivitetsplanSection } from "./AktivitetsplanSection";
import { AktivitetsplanBoard } from "./aktivitetsplan/AktivitetsplanBoard";
import { DialogSection } from "./dialog/DialogSection";
import { ForlengOppfolgingModal } from "./ForlengOppfolgingModal";
import { AvsluttOppfolgingModal } from "./AvsluttOppfolgingModal";
import { KanIkkeAvslutteModal } from "./KanIkkeAvslutteModal";

import { Merkelapp } from "@/data/brukere";
import { Perspektiv } from "./aktivitetsplan/types";

const BLOKKERTE_BRUKERE = new Set(["a3"]);

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
}

export function PersonprofilContent({ brukerId, navn, fnr, merkelapper, status, statusVariant, dagerTilAvslutning, avslutning = false, fase2 = false }: Props) {
  const erBlokkerteAvslutt = brukerId ? BLOKKERTE_BRUKERE.has(brukerId) : false;
  const [infoCardHidden, setInfoCardHidden] = useState(false);
  const [alertVariant, setAlertVariant] = useState<"info" | "warning">("warning");
  const [perspektiv, setPerspektiv] = useState<Perspektiv>("veileder");
  const [aktivTab, setAktivTab] = useState("aktivitetsplan");
  const [forlengOpen, setForlengOpen] = useState(false);
  const [avsluttOpen, setAvsluttOpen] = useState(false);

  const handleForlengBekreft = () => {
    setForlengOpen(false);
    setInfoCardHidden(true);
  };

  const handleAvsluttBekreft = () => {
    setAvsluttOpen(false);
    setInfoCardHidden(true);
  };

  return (
    <>
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
      {!infoCardHidden && fase2 && dagerTilAvslutning != null && (
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
          <div className="w-full max-w-3xl px-6">
            <AktivitetsplanSection perspektiv={perspektiv} onPerspektivChange={setPerspektiv} />
          </div>
          <div className="w-full px-6">
            <AktivitetsplanBoard perspektiv={perspektiv} />
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="dialog" className="flex flex-1 overflow-hidden">
          <DialogSection />
        </Tabs.Panel>
      </Tabs>

      <div className="fixed bottom-6 right-6 z-50 bg-ax-bg-default shadow-lg rounded-lg p-2">
        <ToggleGroup
          value={perspektiv}
          onChange={(v) => setPerspektiv(v as Perspektiv)}
          size="small"
          label="Vis som"
        >
          <ToggleGroup.Item value="veileder">Veileder</ToggleGroup.Item>
          <ToggleGroup.Item value="bruker">Bruker</ToggleGroup.Item>
        </ToggleGroup>
      </div>

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
