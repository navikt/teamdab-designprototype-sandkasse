import { AktivitetsKort } from "@/components/aktivitetsplan/types";
import { lagInitialKort } from "@/components/aktivitetsplan/initialData";
import { TimeplanAktivitet, testdataUngeTimeplan } from "@/components/bruker/testdata-unge/timeplanTestdata";

// Register over spor og scenarioer. Ren data uten React, slik at URL-tolkingen (src/demo/oppsett.ts)
// kan bruke den. Skjermene for hvert spor ligger i src/spor/skjermer.ts.
// Legg til et nytt spor eller scenario her, og se AGENTS.md for resten av sjekklisten.

export type SporId = "naavaerende" | "framtid";

export interface Scenario {
  id: string;
  label: string;
  beskrivelse: string;
  lagKort: () => AktivitetsKort[];
  // Fremtidens plan starter med onboarding når planen er tom.
  startMedOnboarding: boolean;
  startVisning: "liste" | "kalender";
  // Fast ukeplan vist i kalendervisningen (ungdomsprogram). Tom liste gir tom kalender.
  timeplan: TimeplanAktivitet[];
}

export interface Spor {
  id: SporId;
  label: string;
  beskrivelse: string;
  scenarioer: Scenario[];
  // Viser «Innstillinger for dette sporet» (forslag som varsel, «ingen delmål»-varsel) i demo-modalen.
  harInnstillinger: boolean;
}

export const SPOR: Record<SporId, Spor> = {
  naavaerende: {
    id: "naavaerende",
    label: "Nåværende",
    beskrivelse: "Aktivitetsplanen slik den er i dag. Brukes til små og mellomstore endringer.",
    harInnstillinger: false,
    scenarioer: [
      {
        id: "aktiviteter",
        label: "Plan med aktiviteter",
        beskrivelse: "Kort av ulike typer i alle kolonner.",
        lagKort: lagInitialKort,
        startMedOnboarding: false,
        startVisning: "liste",
        timeplan: [],
      },
      {
        id: "tom",
        label: "Tom plan",
        beskrivelse: "Ingen aktiviteter.",
        lagKort: () => [],
        startMedOnboarding: false,
        startVisning: "liste",
        timeplan: [],
      },
    ],
  },
  framtid: {
    id: "framtid",
    label: "Framtid",
    beskrivelse: "Framtidsvisjonen: liste og kalender, mål og forslag. Brukes til større ideer.",
    harInnstillinger: true,
    scenarioer: [
      {
        id: "aktiviteter",
        label: "Plan med aktiviteter",
        beskrivelse: "Aktiviteter av ulike typer, mål og forslag.",
        lagKort: lagInitialKort,
        startMedOnboarding: false,
        startVisning: "liste",
        timeplan: [],
      },
      {
        id: "tom",
        label: "Tom plan",
        beskrivelse: "Ingen aktiviteter. Brukeren starter i onboarding.",
        lagKort: () => [],
        startMedOnboarding: true,
        startVisning: "liste",
        timeplan: [],
      },
      {
        id: "ungdomsprogram",
        label: "Ungdomsprogram",
        beskrivelse: "Fast ukeplan med aktivitet hele dagen, hver dag. Åpner i kalendervisning.",
        lagKort: lagInitialKort,
        startMedOnboarding: false,
        startVisning: "kalender",
        timeplan: testdataUngeTimeplan,
      },
    ],
  },
};

export const SPOR_IDER = Object.keys(SPOR) as SporId[];
