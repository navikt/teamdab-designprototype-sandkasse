"use client";

import { Dispatch, SetStateAction } from "react";
import { AktivitetsKort, Perspektiv } from "../types";
import { MoteDetaljerModal } from "./MoteDetaljerModal";
import { MoteFormModal } from "./MoteFormModal";
import { formatterVarighet, lagEndringsHistorikk, lagHistorikkInnslag } from "./moteUtils";

export type MoteModalState = { type: "opprett" } | { type: "detaljer"; id: string } | { type: "rediger"; id: string } | null;

interface Props {
  state: MoteModalState;
  setState: (s: MoteModalState) => void;
  kort: AktivitetsKort[];
  setKort: Dispatch<SetStateAction<AktivitetsKort[]>>;
  perspektiv: Perspektiv;
  brukerNavn: string;
}

export function MoteModaler({ state, setState, kort, setKort, perspektiv, brukerNavn }: Props) {
  if (!state) return null;

  if (state.type === "opprett") {
    return (
      <MoteFormModal
        brukerNavn={brukerNavn}
        onClose={() => setState(null)}
        onLagre={(v) => {
          const id = `mote-${Date.now()}`;
          const nytt: AktivitetsKort = {
            id,
            kolonne: "planlegger",
            type: "Møte med Nav",
            title: v.tittel,
            tags: [],
            startDato: v.startDato,
            klokkeslett: v.klokkeslett,
            varighetMinutter: v.varighetMinutter,
            varighet: formatterVarighet(v.varighetMinutter),
            moteform: v.moteform,
            moteSted: v.moteSted,
            deltakere: v.deltakere.length > 0 ? v.deltakere : undefined,
            hensikt: v.hensikt,
            forberedelser: v.forberedelser || undefined,
            historikk: [lagHistorikkInnslag("opprettet aktivitet")],
          };
          setKort((prev) => [...prev, nytt]);
          // Som i prod: detaljvisningen åpnes rett etter opprettelse.
          setState({ type: "detaljer", id });
        }}
      />
    );
  }

  const aktivt = kort.find((k) => k.id === state.id);
  if (!aktivt) return null;

  if (state.type === "rediger") {
    return (
      <MoteFormModal
        kort={aktivt}
        brukerNavn={brukerNavn}
        onClose={() => setState({ type: "detaljer", id: aktivt.id })}
        onLagre={(v) => {
          setKort((prev) =>
            prev.map((k) => {
              if (k.id !== aktivt.id) return k;
              const oppdatert: AktivitetsKort = {
                ...k,
                title: v.tittel,
                startDato: v.startDato,
                klokkeslett: v.klokkeslett,
                varighetMinutter: v.varighetMinutter,
                varighet: formatterVarighet(v.varighetMinutter),
                moteform: v.moteform,
                moteSted: v.moteSted,
                deltakere: v.deltakere.length > 0 ? v.deltakere : undefined,
                hensikt: v.hensikt,
                forberedelser: v.forberedelser || undefined,
              };
              return { ...oppdatert, historikk: [...(k.historikk ?? []), ...lagEndringsHistorikk(k, oppdatert)] };
            }),
          );
          setState({ type: "detaljer", id: aktivt.id });
        }}
      />
    );
  }

  return (
    <MoteDetaljerModal
      kort={aktivt}
      perspektiv={perspektiv}
      brukerNavn={brukerNavn}
      setKort={setKort}
      onEndre={() => setState({ type: "rediger", id: aktivt.id })}
      onClose={() => setState(null)}
    />
  );
}
