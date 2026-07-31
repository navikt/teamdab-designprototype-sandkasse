export interface DemoMelding {
  id: string;
  avsender: "VEILEDER" | "BRUKER";
  tekst: string;
  sendt: string;
}

export interface DemoDialog {
  id: string;
  overskrift: string;
  lest: boolean;
  sisteDato: string;
  antallMeldinger: number;
  ferdigBehandlet: boolean;
  venterPaSvar: boolean;
  viktig: boolean;
  meldinger: DemoMelding[];
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
    meldinger: [
      {
        id: "1-1",
        avsender: "VEILEDER",
        tekst: "Hei! Jeg ønsker å følge opp status på jobbsøkingen din. Har du hatt noen relevante samtaler med arbeidsgivere den siste uken?",
        sendt: "2026-07-25T10:15:00",
      },
      {
        id: "1-2",
        avsender: "BRUKER",
        tekst: "Ja, jeg hadde en samtale med en arbeidsgiver i forrige uke. De skal gi meg tilbakemelding innen fredag.",
        sendt: "2026-07-26T14:30:00",
      },
      {
        id: "1-3",
        avsender: "VEILEDER",
        tekst: "Det høres lovende ut! Husk å registrere aktiviteten i aktivitetsplanen. Gi meg gjerne en oppdatering når du har hørt noe.",
        sendt: "2026-07-28T09:00:00",
      },
      {
        id: "1-4",
        avsender: "BRUKER",
        tekst: "Jeg venter fortsatt på svar. Skal oppdatere deg så snart jeg hører noe.",
        sendt: "2026-07-30T11:45:00",
      },
    ],
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
    meldinger: [
      {
        id: "2-1",
        avsender: "BRUKER",
        tekst: "Jeg ønsker å søke om arbeidsavklaringspenger mens jeg er i tiltak. Hva er prosessen for dette?",
        sendt: "2026-07-27T08:20:00",
      },
      {
        id: "2-2",
        avsender: "VEILEDER",
        tekst: "Du må søke via nav.no. Jeg legger ved informasjon om hvilken dokumentasjon som trengs. Ta kontakt hvis du har spørsmål underveis.",
        sendt: "2026-07-28T13:10:00",
      },
    ],
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
    meldinger: [
      {
        id: "3-1",
        avsender: "BRUKER",
        tekst: "Jeg ser ikke aktiviteten jeg la til i går i planen. Har den blitt slettet?",
        sendt: "2026-07-15T09:00:00",
      },
      {
        id: "3-2",
        avsender: "VEILEDER",
        tekst: "Aktiviteten er synlig på vår side. Prøv å laste siden på nytt.",
        sendt: "2026-07-15T09:45:00",
      },
      {
        id: "3-3",
        avsender: "BRUKER",
        tekst: "Det fungerte! Takk.",
        sendt: "2026-07-15T10:00:00",
      },
    ],
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
    meldinger: [
      {
        id: "4-1",
        avsender: "VEILEDER",
        tekst: "Takk for møtet i dag. Som avtalt sender jeg over en oppsummering av det vi gikk gjennom.",
        sendt: "2026-07-10T15:30:00",
      },
    ],
  },
];

