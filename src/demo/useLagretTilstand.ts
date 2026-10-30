"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useEffectEvent, useState } from "react";
import { nullstillVedOppstart } from "./nullstillVedOppstart";

nullstillVedOppstart();

interface Tilstand<T> {
  nokkel: string | null;
  verdi: T;
}

// Prototypen har ingen backend, så localStorage er «databasen». Første render bruker initialverdien
// (lik på server og klient), og lagret verdi leses etter mount for å unngå hydration mismatch.
// Hver nøkkel hører til ett oppsett (spor + scenario), så oppsett påvirker ikke hverandre.
export function useLagretTilstand<T>(nokkel: string, lagInitial: () => T): [T, Dispatch<SetStateAction<T>>] {
  const [tilstand, setTilstand] = useState<Tilstand<T>>(() => ({ nokkel: null, verdi: lagInitial() }));
  const hentInitial = useEffectEvent(lagInitial);

  useEffect(() => {
    let verdi = hentInitial();
    try {
      const lagret = window.localStorage.getItem(nokkel);
      if (lagret !== null) verdi = JSON.parse(lagret) as T;
    } catch {
      // Ugyldig lagret data: bruk initialverdien.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTilstand({ nokkel, verdi });
  }, [nokkel]);

  useEffect(() => {
    // Hopp over til dataene tilhører gjeldende nøkkel, ellers kan gammelt oppsett skrives til nytt.
    if (tilstand.nokkel !== nokkel) return;
    try {
      window.localStorage.setItem(nokkel, JSON.stringify(tilstand.verdi));
    } catch {
      // Lagring kan feile (privat modus, full kvote). Prototypen fungerer fortsatt i minnet.
    }
  }, [tilstand, nokkel]);

  const setVerdi = useCallback<Dispatch<SetStateAction<T>>>((oppdatering) => {
    setTilstand((forrige) => ({
      ...forrige,
      verdi: typeof oppdatering === "function" ? (oppdatering as (v: T) => T)(forrige.verdi) : oppdatering,
    }));
  }, []);

  return [tilstand.verdi, setVerdi];
}
