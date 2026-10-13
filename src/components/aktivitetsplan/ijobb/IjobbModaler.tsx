"use client";

import { Dispatch, SetStateAction } from "react";
import { AktivitetsKort, Perspektiv } from "../types";
import { lagHistorikkInnslag } from "../mote/moteUtils";
import { IjobbDetaljerModal } from "./IjobbDetaljerModal";
import { IjobbFormModal, IjobbLagreVerdier } from "./IjobbFormModal";
import { IJOBB_TYPE } from "./ijobbUtils";

export type IjobbModalState = { type: "opprett" } | { type: "detaljer"; id: string } | { type: "rediger"; id: string } | null;

interface Props {
  state: IjobbModalState;
  setState: (s: IjobbModalState) => void;
  kort: AktivitetsKort[];
  setKort: Dispatch<SetStateAction<AktivitetsKort[]>>;
  perspektiv: Perspektiv;
}

function formaterDatoKort(iso: string | undefined): string {
  if (!iso) return "ikke satt";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

// Én historikklinje per endret felt, med formuleringer fra mocks/aktivitetHistorikk.ts i aktivitetsplan-repoet.
function lagEndringsHistorikk(gammel: AktivitetsKort, ny: AktivitetsKort) {
  const tekster: string[] = [];
  if (gammel.title !== ny.title) tekster.push(`endret tittel fra "${gammel.title}" til "${ny.title}"`);
  if (gammel.startDato !== ny.startDato || gammel.sluttDato !== ny.sluttDato) {
    tekster.push(
      `endret datoene fra ${formaterDatoKort(gammel.startDato)} - ${formaterDatoKort(gammel.sluttDato)} til ${formaterDatoKort(ny.startDato)} - ${formaterDatoKort(ny.sluttDato)}`,
    );
  }
  if (gammel.stillingsandel !== ny.stillingsandel) tekster.push("endret stillingsandel");
  if ((gammel.arbeidsgiver ?? "") !== (ny.arbeidsgiver ?? "")) tekster.push("endret arbeidsgiver");
  if ((gammel.ansettelsesforhold ?? "") !== (ny.ansettelsesforhold ?? "")) tekster.push("endret ansettelsesforhold");
  if ((gammel.beskrivelse ?? "") !== (ny.beskrivelse ?? "")) tekster.push("endret beskrivelse");
  return tekster.map(lagHistorikkInnslag);
}

function tilFelter(v: IjobbLagreVerdier) {
  return {
    title: v.tittel,
    startDato: v.startDato,
    sluttDato: v.sluttDato,
    stillingsandel: v.stillingsandel,
    arbeidsgiver: v.arbeidsgiver,
    ansettelsesforhold: v.ansettelsesforhold,
    beskrivelse: v.beskrivelse,
  };
}

export function IjobbModaler({ state, setState, kort, setKort, perspektiv }: Props) {
  if (!state) return null;

  if (state.type === "opprett") {
    return (
      <IjobbFormModal
        onClose={() => setState(null)}
        onLagre={(v) => {
          const id = `ijobb-${Date.now()}`;
          const nytt: AktivitetsKort = {
            id,
            // Nye aktiviteter får status «Planlagt» i prod.
            kolonne: "planlegger",
            type: IJOBB_TYPE,
            tags: [],
            ...tilFelter(v),
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
      <IjobbFormModal
        kort={aktivt}
        onClose={() => setState({ type: "detaljer", id: aktivt.id })}
        onLagre={(v) => {
          setKort((prev) =>
            prev.map((k) => {
              if (k.id !== aktivt.id) return k;
              const oppdatert: AktivitetsKort = { ...k, ...tilFelter(v) };
              return { ...oppdatert, historikk: [...(k.historikk ?? []), ...lagEndringsHistorikk(k, oppdatert)] };
            }),
          );
          setState({ type: "detaljer", id: aktivt.id });
        }}
      />
    );
  }

  return (
    <IjobbDetaljerModal
      kort={aktivt}
      perspektiv={perspektiv}
      setKort={setKort}
      onEndre={() => setState({ type: "rediger", id: aktivt.id })}
      onClose={() => setState(null)}
    />
  );
}
