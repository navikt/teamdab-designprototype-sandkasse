"use client";

import { SetStateAction } from "react";
import { AktivitetsKort, Delmal } from "../../aktivitetsplan/types";
import { lagringsNokkel } from "@/demo/oppsett";
import { useLagretTilstand } from "@/demo/useLagretTilstand";
import { useOppsett } from "@/demo/useOppsett";

const DEFAULT_HOVEDMAL = "Komme tilbake i jobb som elektriker";

interface LagretMal {
  hovedmal: string;
  delmal: Delmal[];
}

export interface DelmalVisning {
  id: string;
  tittel: string;
  oppnadd: boolean;
  kilde: Delmal["kilde"];
  aktivitetId?: string;
  aktivitetType?: string;
}

export function useMal(kort: AktivitetsKort[]) {
  const oppsett = useOppsett();
  const [mal, setMal] = useLagretTilstand<LagretMal>(lagringsNokkel(oppsett, "mal"), () => ({
    hovedmal: DEFAULT_HOVEDMAL,
    delmal: [],
  }));
  const { hovedmal, delmal } = mal;
  const setHovedmalState = (nyttMal: string) => setMal((prev) => ({ ...prev, hovedmal: nyttMal }));
  const setDelmal = (oppdatering: SetStateAction<Delmal[]>) =>
    setMal((prev) => ({
      ...prev,
      delmal: typeof oppdatering === "function" ? oppdatering(prev.delmal) : oppdatering,
    }));

  const setHovedmal = (nyttMal: string) => setHovedmalState(nyttMal);

  const erAktivitetDelmal = (aktivitetId: string) => delmal.some((d) => d.aktivitetId === aktivitetId);

  const leggTilDelmalFraAktivitet = (aktivitetId: string) => {
    if (erAktivitetDelmal(aktivitetId)) return;
    setDelmal((prev) => [...prev, { id: crypto.randomUUID(), kilde: "aktivitet", aktivitetId }]);
  };

  const fjernDelmalForAktivitet = (aktivitetId: string) => {
    setDelmal((prev) => prev.filter((d) => d.aktivitetId !== aktivitetId));
  };

  const leggTilFritekstDelmal = (tekst: string) => {
    const trimmet = tekst.trim();
    if (!trimmet) return;
    setDelmal((prev) => [...prev, { id: crypto.randomUUID(), kilde: "fritekst", tekst: trimmet, oppnadd: false }]);
  };

  const oppdaterFritekstDelmal = (id: string, tekst: string) => {
    setDelmal((prev) => prev.map((d) => (d.id === id ? { ...d, tekst } : d)));
  };

  const settFritekstOppnadd = (id: string, oppnadd: boolean) => {
    setDelmal((prev) => prev.map((d) => (d.id === id ? { ...d, oppnadd } : d)));
  };

  const fjernDelmal = (id: string) => {
    setDelmal((prev) => prev.filter((d) => d.id !== id));
  };

  const nullstillMal = (nyttHovedmal: string = DEFAULT_HOVEDMAL) => {
    setHovedmalState(nyttHovedmal);
    setDelmal([]);
  };

  const flyttDelmal = (id: string, retning: "opp" | "ned") => {
    setDelmal((prev) => {
      const index = prev.findIndex((d) => d.id === id);
      const nyIndex = retning === "opp" ? index - 1 : index + 1;
      if (index === -1 || nyIndex < 0 || nyIndex >= prev.length) return prev;
      const kopi = [...prev];
      [kopi[index], kopi[nyIndex]] = [kopi[nyIndex], kopi[index]];
      return kopi;
    });
  };

  const delmalVisning: DelmalVisning[] = delmal.map((d) => {
    if (d.kilde === "aktivitet") {
      const aktivitet = kort.find((k) => k.id === d.aktivitetId);
      return {
        id: d.id,
        tittel: aktivitet?.title ?? d.tekst ?? "Ukjent aktivitet",
        oppnadd: aktivitet?.kolonne === "fullfort",
        kilde: d.kilde,
        aktivitetId: d.aktivitetId,
        aktivitetType: aktivitet?.type,
      };
    }
    return { id: d.id, tittel: d.tekst ?? "", oppnadd: d.oppnadd ?? false, kilde: d.kilde };
  });

  return {
    hovedmal,
    setHovedmal,
    delmal: delmalVisning,
    erAktivitetDelmal,
    leggTilDelmalFraAktivitet,
    fjernDelmalForAktivitet,
    leggTilFritekstDelmal,
    oppdaterFritekstDelmal,
    settFritekstOppnadd,
    fjernDelmal,
    flyttDelmal,
    nullstillMal,
  };
}
