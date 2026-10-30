"use client";

import { useState } from "react";
import { AktivitetsplanSection } from "@/components/AktivitetsplanSection";
import { AktivitetsplanBoard } from "@/components/aktivitetsplan/AktivitetsplanBoard";
import { MoteModaler, MoteModalState } from "@/components/aktivitetsplan/mote/MoteModaler";
import { IjobbModaler, IjobbModalState } from "@/components/aktivitetsplan/ijobb/IjobbModaler";
import { useAktivitetsKort } from "@/components/aktivitetsplan/useAktivitetsKort";
import { Perspektiv } from "@/components/aktivitetsplan/types";

interface Props {
  perspektiv: Perspektiv;
  brukerNavn?: string;
}

// Nåværende aktivitetsplan (kanban-tavle). Brukes både i veilederens personprofil og i brukerens side.
export function NaavaerendeAktivitetsplan({ perspektiv, brukerNavn }: Props) {
  const [kort, setKort] = useAktivitetsKort();
  const [moteModal, setMoteModal] = useState<MoteModalState>(null);
  const [ijobbModal, setIjobbModal] = useState<IjobbModalState>(null);

  return (
    <>
      <div className="w-full max-w-3xl px-6">
        <AktivitetsplanSection onOpprettMote={() => setMoteModal({ type: "opprett" })} onOpprettIjobb={() => setIjobbModal({ type: "opprett" })} />
      </div>
      <div className="w-full px-6">
        <AktivitetsplanBoard
          perspektiv={perspektiv}
          kort={kort}
          setKort={setKort}
          onMoteKlikk={(id) => setMoteModal({ type: "detaljer", id })}
          onIjobbKlikk={(id) => setIjobbModal({ type: "detaljer", id })}
        />
        <IjobbModaler state={ijobbModal} setState={setIjobbModal} kort={kort} setKort={setKort} perspektiv={perspektiv} />
        <MoteModaler
          state={moteModal}
          setState={setMoteModal}
          kort={kort}
          setKort={setKort}
          perspektiv={perspektiv}
          brukerNavn={brukerNavn ?? "Bruker"}
        />
      </div>
    </>
  );
}
