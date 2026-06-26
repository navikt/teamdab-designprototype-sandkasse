"use client";

import { useState } from "react";
import { Visittkort } from "./Visittkort";
import { InfoCard } from "./InfoCard";
import { PersonprofilTabBar } from "./PersonprofilTabBar";
import { AktivitetsplanSection } from "./AktivitetsplanSection";
import { AktivitetsplanBoard } from "./aktivitetsplan/AktivitetsplanBoard";
import { ForlengOppfolgingModal } from "./ForlengOppfolgingModal";
import { AvsluttOppfolgingModal } from "./AvsluttOppfolgingModal";

interface Props {
  navn?: string;
}

export function PersonprofilContent({ navn }: Props) {
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
        onOpenForleng={() => setForlengOpen(true)}
        onOpenAvslutt={() => setAvsluttOpen(true)}
      />
      <PersonprofilTabBar />
      <main className="flex-1 flex flex-col items-center gap-6 py-6 overflow-x-hidden">
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
      </main>

      <ForlengOppfolgingModal
        open={forlengOpen}
        onClose={() => setForlengOpen(false)}
        onBekreft={handleForlengBekreft}
      />
      <AvsluttOppfolgingModal
        open={avsluttOpen}
        onClose={() => setAvsluttOpen(false)}
        onBekreft={handleAvsluttBekreft}
      />
    </>
  );
}
