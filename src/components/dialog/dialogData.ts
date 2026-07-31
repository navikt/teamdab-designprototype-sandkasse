export interface DemoDialog {
  id: string;
  overskrift: string;
  lest: boolean;
  sisteDato: string;
  antallMeldinger: number;
  ferdigBehandlet: boolean;
  venterPaSvar: boolean;
  viktig: boolean;
}

export const demoDialoger: DemoDialog[] = [
  {
    id: "1",
    overskrift: "Arbeidsrettet oppfølging",
    lest: false,
    sisteDato: "2026-07-30",
    antallMeldinger: 4,
    ferdigBehandlet: false,
    venterPaSvar: true,
    viktig: false,
  },
  {
    id: "2",
    overskrift: "Søknad om arbeidsmarkedstiltak",
    lest: true,
    sisteDato: "2026-07-28",
    antallMeldinger: 2,
    ferdigBehandlet: false,
    venterPaSvar: false,
    viktig: true,
  },
  {
    id: "3",
    overskrift: "Spørsmål om aktivitetsplan",
    lest: true,
    sisteDato: "2026-07-21",
    antallMeldinger: 7,
    ferdigBehandlet: true,
    venterPaSvar: false,
    viktig: false,
  },
  {
    id: "4",
    overskrift: "Oppfølging etter møte",
    lest: true,
    sisteDato: "2026-07-10",
    antallMeldinger: 1,
    ferdigBehandlet: false,
    venterPaSvar: false,
    viktig: false,
  },
];
