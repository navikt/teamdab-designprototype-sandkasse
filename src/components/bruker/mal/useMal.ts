"use client";

import { useEffect, useState } from "react";
import { AktivitetsKort, Delmal } from "../../aktivitetsplan/types";

const MAL_STORAGE_KEY = "minaktivitetsplan-mal";
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

function lastLagretMal(): LagretMal {
  if (typeof window === "undefined") return { hovedmal: DEFAULT_HOVEDMAL, delmal: [] };
  try {
    const raw = window.localStorage.getItem(MAL_STORAGE_KEY);
    if (!raw) return { hovedmal: DEFAULT_HOVEDMAL, delmal: [] };
    const parsed = JSON.parse(raw) as Partial<LagretMal>;
    return {
      hovedmal: parsed.hovedmal ?? DEFAULT_HOVEDMAL,
      delmal: parsed.delmal ?? [],
    };
  } catch {
    return { hovedmal: DEFAULT_HOVEDMAL, delmal: [] };
  }
}

export function useMal(kort: AktivitetsKort[]) {
  const [hovedmal, setHovedmalState] = useState(DEFAULT_HOVEDMAL);
  const [delmal, setDelmal] = useState<Delmal[]>([]);
  const [lastet, setLastet] = useState(false);

  useEffect(() => {
    const lagret = lastLagretMal();
    setHovedmalState(lagret.hovedmal);
    setDelmal(lagret.delmal);
    setLastet(true);
  }, []);

  useEffect(() => {
    if (!lastet) return;
    window.localStorage.setItem(MAL_STORAGE_KEY, JSON.stringify({ hovedmal, delmal }));
  }, [hovedmal, delmal, lastet]);

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
