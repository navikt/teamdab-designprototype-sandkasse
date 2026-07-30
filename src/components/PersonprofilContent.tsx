"use client";

import { useState } from "react";
import { Tabs } from "@navikt/ds-react";
import { Visittkort } from "./Visittkort";
import { InfoCard } from "./InfoCard";
import { AktivitetsplanSection } from "./AktivitetsplanSection";
import { AktivitetsplanBoard } from "./aktivitetsplan/AktivitetsplanBoard";
import { DialogTab } from "./dialog/DialogTab";
import { ForlengOppfolgingModal } from "./ForlengOppfolgingModal";
import { AvsluttOppfolgingModal } from "./AvsluttOppfolgingModal";

import { Merkelapp } from "@/data/brukere";

interface Props {
  navn?: string;
  fnr?: string;
  merkelapper?: Merkelapp[];
}

export function PersonprofilContent({ navn, fnr, merkelapper }: Props) {
  const [infoCardHidden, setInfoCardHidden] = useState(false);
  const [activeTab, setActiveTab] = useState("aktivitetsplan");
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
        merkelapper={merkelapper}
        onOpenForleng={() => setForlengOpen(true)}
        onOpenAvslutt={() => setAvsluttOpen(true)}
      />
      <div
        className="bg-white [&_.navds-tabs__tab--active]:text-[var(--ax-text-neutral)] [&_.navds-tabs__tab--active]:shadow-[inset_0_-4px_0_0_#0067c5] [&_.navds-tabs__tab]:hover:text-[var(--ax-text-neutral)]"
        style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(7,26,54,0.21)" }}
      >
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="aktivitetsplan" label="Aktivitetsplan" />
            <Tabs.Tab value="dialog" label="Dialog" />
            <Tabs.Tab value="overblikk" label="Overblikk" />
            <Tabs.Tab value="oppfolgingsvedtak" label="Oppfølgingsvedtak § 14 a" />
            <Tabs.Tab value="arbeidsmarkedstiltak" label="Arbeidsmarkedstiltak" />
            <Tabs.Tab value="finn-stillinger" label="Finn stillinger" />
          </Tabs.List>
        </Tabs>
      </div>
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "aktivitetsplan" && (
          <div className="flex flex-col items-center gap-6 py-6 overflow-x-hidden overflow-y-auto h-full">
            {!infoCardHidden && (
              <div className="inline-block px-6">
                <InfoCard
                  onHide={() => setInfoCardHidden(true)}
                  onOpenForleng={() => setForlengOpen(true)}
                  onOpenAvslutt={() => setAvsluttOpen(true)}
                />
              </div>
            )}
            <div className="w-full max-w-3xl px-6">
              <AktivitetsplanSection />
            </div>
            <div className="w-full px-6">
              <AktivitetsplanBoard />
            </div>
          </div>
        )}
        {activeTab === "dialog" && <DialogTab />}
      </main>

      <ForlengOppfolgingModal
        open={forlengOpen}
        onClose={() => setForlengOpen(false)}
        onBekreft={handleForlengBekreft}
        merkelapper={merkelapper}
      />
      <AvsluttOppfolgingModal
        open={avsluttOpen}
        onClose={() => setAvsluttOpen(false)}
        onBekreft={handleAvsluttBekreft}
      />
    </>
  );
}
