export type Avsender = "BRUKER" | "VEILEDER";

export interface Melding {
  id: string;
  dialogId: string;
  avsender: Avsender;
  avsenderId: string;
  sendt: string;
  viktig: boolean;
  tekst: string;
}

export interface Dialog {
  id: string;
  overskrift: string;
  sisteDato: string;
  historisk: boolean;
  lest: boolean;
  venterPaSvar: boolean;
  ferdigBehandlet: boolean;
  aktivitetId: string | null;
  henvendelser: Melding[];
  egenskaper: string[];
}

export const mockDialoger: Dialog[] = [
  {
    id: "1",
    overskrift: "Arbeidstrening",
    sisteDato: "2026-07-28T10:30:00.000+02:00",
    historisk: false,
    lest: false,
    venterPaSvar: true,
    ferdigBehandlet: false,
    aktivitetId: null,
    egenskaper: [],
    henvendelser: [
      {
        id: "1-1",
        dialogId: "1",
        avsender: "BRUKER",
        avsenderId: "00010112345",
        sendt: "2026-07-25T09:12:00.000+02:00",
        viktig: false,
        tekst: "Hei! Jeg lurte på om du kan hjelpe meg med å finne noe å gjøre mens jeg venter på svar fra arbeidsgivere. Har du noen forslag?",
      },
      {
        id: "1-2",
        dialogId: "1",
        avsender: "VEILEDER",
        avsenderId: "Z123456",
        sendt: "2026-07-25T13:44:00.000+02:00",
        viktig: false,
        tekst: "Hei! Ja, vi kan se på muligheter for arbeidstrening. Det kan være nyttig å holde seg aktiv og bygge erfaring mens du søker. Hva slags type arbeid er du interessert i?",
      },
      {
        id: "1-3",
        dialogId: "1",
        avsender: "BRUKER",
        avsenderId: "00010112345",
        sendt: "2026-07-26T08:55:00.000+02:00",
        viktig: false,
        tekst: "Jeg har jobbet mye med service og kunde tidligere, men er åpen for andre ting også. Har ikke noe imot å prøve noe nytt.",
      },
      {
        id: "1-4",
        dialogId: "1",
        avsender: "VEILEDER",
        avsenderId: "Z123456",
        sendt: "2026-07-28T10:30:00.000+02:00",
        viktig: false,
        tekst: "Bra! Jeg registrerer en aktivitet for arbeidstrening i aktivitetsplanen din. Ta en titt og gi meg beskjed om du har spørsmål.",
      },
    ],
  },
  {
    id: "2",
    overskrift: "Oppfølging og neste steg",
    sisteDato: "2026-07-22T14:10:00.000+02:00",
    historisk: false,
    lest: true,
    venterPaSvar: false,
    ferdigBehandlet: false,
    aktivitetId: null,
    egenskaper: [],
    henvendelser: [
      {
        id: "2-1",
        dialogId: "2",
        avsender: "VEILEDER",
        avsenderId: "Z123456",
        sendt: "2026-07-20T11:00:00.000+02:00",
        viktig: false,
        tekst: "Hei! Vi hadde et møte forrige uke, og jeg ville følge opp. Har du fått sendt søknaden vi snakket om?",
      },
      {
        id: "2-2",
        dialogId: "2",
        avsender: "BRUKER",
        avsenderId: "00010112345",
        sendt: "2026-07-21T16:30:00.000+02:00",
        viktig: false,
        tekst: "Ja, sendte den i går kveld! Litt nervøs, men det gikk bra.",
      },
      {
        id: "2-3",
        dialogId: "2",
        avsender: "VEILEDER",
        avsenderId: "Z123456",
        sendt: "2026-07-22T14:10:00.000+02:00",
        viktig: false,
        tekst: "Flott jobbet! Gi meg beskjed hvis du hører noe, så hjelper vi deg med neste steg.",
      },
    ],
  },
  {
    id: "3",
    overskrift: "Viktig beskjed fra Nav",
    sisteDato: "2026-07-15T09:00:00.000+02:00",
    historisk: false,
    lest: true,
    venterPaSvar: false,
    ferdigBehandlet: true,
    aktivitetId: null,
    egenskaper: ["ESKALERINGSVARSEL"],
    henvendelser: [
      {
        id: "3-1",
        dialogId: "3",
        avsender: "VEILEDER",
        avsenderId: "Z123456",
        sendt: "2026-07-15T09:00:00.000+02:00",
        viktig: true,
        tekst: "Det er viktig at du gjennomfører den planlagte aktiviteten i aktivitetsplanen din. Tar du ikke kontakt innen fristen, kan det påvirke ytelsene dine. Ta kontakt med veilederen din hvis du har spørsmål.",
      },
    ],
  },
  {
    id: "4",
    overskrift: "CV og jobbsøking",
    sisteDato: "2026-07-10T15:20:00.000+02:00",
    historisk: true,
    lest: true,
    venterPaSvar: false,
    ferdigBehandlet: true,
    aktivitetId: null,
    egenskaper: [],
    henvendelser: [
      {
        id: "4-1",
        dialogId: "4",
        avsender: "VEILEDER",
        avsenderId: "Z123456",
        sendt: "2026-07-08T10:00:00.000+02:00",
        viktig: false,
        tekst: "Hei! Jeg har sett gjennom CV-en du lastet opp. Den ser bra ut, men jeg har noen innspill til avsnittet om arbeidserfaring. Kan vi ta en gjennomgang?",
      },
      {
        id: "4-2",
        dialogId: "4",
        avsender: "BRUKER",
        avsenderId: "00010112345",
        sendt: "2026-07-09T08:40:00.000+02:00",
        viktig: false,
        tekst: "Ja, gjerne! Passer det i morgen?",
      },
      {
        id: "4-3",
        dialogId: "4",
        avsender: "VEILEDER",
        avsenderId: "Z123456",
        sendt: "2026-07-10T15:20:00.000+02:00",
        viktig: false,
        tekst: "Fint, vi tar det på telefon kl. 10. Jeg ringer deg.",
      },
    ],
  },
];
