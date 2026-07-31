"use client";

import { useState } from "react";
import { Tabs } from "@navikt/ds-react";
import { Visittkort } from "./Visittkort";
import { InfoCard } from "./InfoCard";
import { PersonprofilTabBar } from "./PersonprofilTabBar";
import { AktivitetsplanSection } from "./AktivitetsplanSection";
import { AktivitetsplanBoard } from "./aktivitetsplan/AktivitetsplanBoard";
import { DialogSection } from "./dialog/DialogSection";
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
<Tabs defaultValue="aktivitetsplan" className="flex flex-col flex-1 overflow-hidden">
        <PersonprofilTabBar />
        <Tabs.Panel value="aktivitetsplan" className="flex-1 flex flex-col items-center gap-6 py-6 overflow-x-hidden">
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
        </Tabs.Panel>
        <Tabs.Panel value="dialog" className="flex flex-1 overflow-hidden">
          <DialogSection />
        </Tabs.Panel>
      </Tabs>

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
