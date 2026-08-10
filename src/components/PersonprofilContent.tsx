"use client";

import { useState } from "react";
import { Tabs, ToggleGroup } from "@navikt/ds-react";
import { Visittkort } from "./Visittkort";
import { InfoCard } from "./InfoCard";
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
}

export function PersonprofilContent({ brukerId, navn, fnr, merkelapper, status, statusVariant, dagerTilAvslutning }: Props) {
  const erBlokkerteAvslutt = brukerId ? BLOKKERTE_BRUKERE.has(brukerId) : false;
  const [infoCardHidden, setInfoCardHidden] = useState(false);
  const [perspektiv, setPerspektiv] = useState<Perspektiv>("veileder");
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
<Tabs defaultValue="aktivitetsplan" className="flex flex-col flex-1 overflow-hidden">
        <PersonprofilTabBar />
        <Tabs.Panel value="aktivitetsplan" className="flex-1 flex flex-col items-center gap-6 py-6 overflow-x-hidden">
          {!infoCardHidden && (
            <div className="inline-block px-6">
              <InfoCard
                onHide={() => setInfoCardHidden(true)}
                onOpenForleng={() => setForlengOpen(true)}
                onOpenAvslutt={() => setAvsluttOpen(true)}
                status={status}
                dagerTilAvslutning={dagerTilAvslutning}
              />
            </div>
          )}
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
