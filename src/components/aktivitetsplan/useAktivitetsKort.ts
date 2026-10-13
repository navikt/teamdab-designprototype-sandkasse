"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AktivitetsKort } from "./types";
import { lagInitialKort } from "./initialData";

// Øk versjonen når AktivitetsKort endres på en måte som gjør lagrede data ugyldige.
// Nullstill manuelt ved å slette nøkkelen i localStorage.
export const AKTIVITETER_STORAGE_KEY = "aktivitetsplan-prototype:kort:v1";

// Prototypen har ingen backend, så localStorage er "databasen". Initial state brukes i første render
// (likt på server og klient), og lagrede data leses først etter mount for å unngå hydration mismatch.
export function useAktivitetsKort(): [AktivitetsKort[], Dispatch<SetStateAction<AktivitetsKort[]>>] {
  const [kort, setKort] = useState<AktivitetsKort[]>(lagInitialKort);
  const [lastet, setLastet] = useState(false);

  useEffect(() => {
    try {
      const lagret = window.localStorage.getItem(AKTIVITETER_STORAGE_KEY);
      if (lagret) {
        const parsed: unknown = JSON.parse(lagret);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setKort(parsed as AktivitetsKort[]);
      }
    } catch {
      // Ugyldig lagret data: bruk initialdata.
    }
    setLastet(true);
  }, []);

  useEffect(() => {
    if (!lastet) return;
    try {
      window.localStorage.setItem(AKTIVITETER_STORAGE_KEY, JSON.stringify(kort));
    } catch {
      // Lagring kan feile (privat modus, full kvote). Prototypen fungerer fortsatt i minnet.
    }
  }, [kort, lastet]);

  return [kort, setKort];
}
