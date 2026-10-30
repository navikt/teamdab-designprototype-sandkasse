"use client";

import { Dispatch, SetStateAction } from "react";
import { AktivitetsKort } from "./types";
import { lagringsNokkel } from "@/demo/oppsett";
import { useLagretTilstand } from "@/demo/useLagretTilstand";
import { useOppsett, useScenario } from "@/demo/useOppsett";

// Aktivitetene lagres per spor + scenario (se src/demo/oppsett.ts), og startdata hentes fra scenarioet.
export function useAktivitetsKort(): [AktivitetsKort[], Dispatch<SetStateAction<AktivitetsKort[]>>] {
  const oppsett = useOppsett();
  const scenario = useScenario();
  return useLagretTilstand<AktivitetsKort[]>(lagringsNokkel(oppsett, "kort"), scenario.lagKort);
}
