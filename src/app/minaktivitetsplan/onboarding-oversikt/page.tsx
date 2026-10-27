"use client";

import Link from "next/link";
import { Heading, BodyShort, Button, Table } from "@navikt/ds-react";
import {
  BEHOLD_JOBB_FOKUS_ALTERNATIVER,
  FINN_JOBB_FOKUS_ALTERNATIVER,
  IKKE_KLAR_FOKUS_ALTERNATIVER,
  USIKKER_FOKUS_ALTERNATIVER,
} from "@/components/bruker/onboarding/data";
import { beregnAktiviteter, beregnMal } from "@/components/bruker/onboarding/logic";
import { Alternativ, Svar } from "@/components/bruker/onboarding/types";
import { DekoratorHeader } from "@/components/dekorator-lookalike/DekoratorHeader";
import { MermaidDiagram } from "@/components/MermaidDiagram";

// Speiler nesteSteg()-logikken i src/components/bruker/onboarding/OnboardingFlow.tsx.
// Hold denne i sync manuelt når stegmaskinen endres.
const VEILEDER = "Jeg vet ikke ennå – vil finne ut<br/>av dette sammen med veilederen min";
const ANNET = "Noe annet enn dette<br/>+ fritekst «Beskriv med egne ord» (påkrevd)";

interface Spor {
  id: string;
  farge: string;
  fyll: string;
  situasjon: string;
  sporsmal: string;
  svar: string[];
}

const SPOR: Spor[] = [
  {
    id: "finn",
    farge: "#0067c5",
    fyll: "#e6f0ff",
    situasjon: "Jeg vil finne meg en jobb",
    sporsmal: "Hva trenger du mest hjelp til<br/>i jobbsøket akkurat nå?",
    svar: [
      "Søke på en bestemt type jobb<br/>+ felt: yrke, stilling eller bransje (valgfritt)",
      "Jeg er usikker på hvilken retning<br/>eller bransje som passer for meg<br/>+ avkrysning: hva slags oppgaver du liker (valgfritt)",
      "Jeg mangler erfaring eller kvalifikasjoner<br/>for jobbene jeg vil ha",
      ANNET,
      VEILEDER,
    ],
  },
  {
    id: "behold",
    farge: "#2a8a3e",
    fyll: "#e3f5e8",
    situasjon: "Jeg har jobb, men trenger hjelp<br/>til å bli værende i den",
    sporsmal: "Hva tror du er viktigst for å<br/>hjelpe deg til å bli i jobben?",
    svar: [
      "Få jobben tilpasset, for eksempel<br/>arbeidstid, oppgaver eller utstyr",
      "Få helsa til å fungere bedre sammen med jobben",
      "Snakke bedre med sjefen min<br/>om hvordan det går",
      ANNET,
      VEILEDER,
    ],
  },
  {
    id: "ikkeklar",
    farge: "#c77300",
    fyll: "#fff1de",
    situasjon: "Jeg er ikke klar for jobb akkurat nå",
    sporsmal: "Hva tror du er viktigst akkurat<br/>nå for å hjelpe deg videre mot jobb?",
    svar: [
      "Mestre en vanskelig livssituasjon bedre",
      "Bli sterkere fysisk eller psykisk",
      "Bygge mer kunnskap og erfaring",
      "Utforske hvilken type arbeid som kan passe for meg",
      ANNET,
      VEILEDER,
    ],
  },
  {
    id: "usikker",
    farge: "#7a3bb5",
    fyll: "#f1e8fb",
    situasjon: "Jeg er usikker på hva som passer",
    sporsmal: "Hva er du mest usikker på?",
    svar: [
      "Hvilke jobber som kan passe for meg",
      "Om jeg har erfaringen eller kompetansen jeg trenger",
      "Om jeg er klar for å jobbe nå",
      "Hvor mye jeg kan jobbe",
      "Jeg vet ikke ennå",
    ],
  },
];

// Bygger diagrammet fra SPOR slik at farger og linjestiler følger de samme nodene og kantene.
function byggDiagram(): string {
  const linjer: string[] = [
    "flowchart TD",
    '  intro["La oss gjøre planen relevant for deg<br/>«Kom i gang»"] --> situasjon',
    '  situasjon{"Hva beskriver din situasjon best?"}',
  ];
  let kantNr = 1; // kant 0 er intro --> situasjon
  const stiler: string[] = [];

  for (const sp of SPOR) {
    const kanter: number[] = [];
    const nyKant = () => {
      kanter.push(kantNr++);
    };
    const noder = [`${sp.id}S`, `${sp.id}Fokus`];

    linjer.push(`  situasjon --> ${sp.id}S["${sp.situasjon}"]`);
    nyKant();
    linjer.push(`  ${sp.id}S --> ${sp.id}Fokus{"${sp.sporsmal}"}`);
    nyKant();
    sp.svar.forEach((tekst, i) => {
      const id = `${sp.id}Svar${i}`;
      noder.push(id);
      linjer.push(`  ${sp.id}Fokus --> ${id}(["${tekst}"])`);
      nyKant();
      linjer.push(`  ${id} --> bekreft`);
      nyKant();
    });

    linjer.push(`  classDef ${sp.id} fill:${sp.fyll},stroke:${sp.farge},stroke-width:2px`);
    linjer.push(`  class ${noder.join(",")} ${sp.id}`);
    stiler.push(`  linkStyle ${kanter.join(",")} stroke:${sp.farge},stroke-width:2px`);
  }

  linjer.push(
    '  bekreft["Passer denne retningen for deg?<br/>(forslag til mål, direkte redigerbart felt)"] -->|"Dette passer"| aktivitet',
    '  aktivitet["Hva vil du starte med?<br/>(forslag / egen aktivitet / sammen med veileder)"] --> oppsummering',
    '  oppsummering["Du er klar til å komme i gang<br/>(mål + første aktivitet)"] --> ferdig(["Gå til aktivitetsplanen"])',
    '  intro -.->|"Hopp rett til aktivitetsplanen<br/>(tilgjengelig på alle steg unntatt oppsummeringen)"| ferdig',
    ...stiler,
  );
  return linjer.join("\n");
}

const FLYT_DIAGRAM = byggDiagram();

// Tabellene bygges fra data.ts og logic.ts, så de kan ikke komme ut av sync med appen.
const FORSLAG: {
  sporId: string;
  situasjonId: string;
  fokusNokkel: keyof Svar;
  alternativer: Alternativ[];
}[] = [
  { sporId: "finn", situasjonId: "finn-jobb", fokusNokkel: "finnJobbFokusId", alternativer: FINN_JOBB_FOKUS_ALTERNATIVER },
  { sporId: "behold", situasjonId: "behold-jobb", fokusNokkel: "beholdJobbFokusId", alternativer: BEHOLD_JOBB_FOKUS_ALTERNATIVER },
  { sporId: "ikkeklar", situasjonId: "ikke-klar", fokusNokkel: "ikkeKlarFokusId", alternativer: IKKE_KLAR_FOKUS_ALTERNATIVER },
  { sporId: "usikker", situasjonId: "usikker", fokusNokkel: "usikkerFokusId", alternativer: USIKKER_FOKUS_ALTERNATIVER },
];

function foreslattMal(situasjonId: string, fokusNokkel: keyof Svar, fokusId: string): string {
  if (fokusId === "annet") return "Teksten brukeren skriver selv";
  const svar: Svar = { situasjonId, [fokusNokkel]: fokusId };
  if (fokusId === "vet-hva") svar.yrke = "[yrke]";
  const mal = beregnMal(svar);
  return fokusId === "usikker-retning" ? `${mal} [, med utgangspunkt i valgte interesser]` : mal;
}

function ForslagTabeller() {
  return (
    <section className="flex flex-col gap-6" aria-labelledby="forslag-overskrift">
      <div className="flex flex-col gap-2">
        <Heading size="medium" level="2" id="forslag-overskrift">
          Forslag til mål og første aktivitet
        </Heading>
        <BodyShort className="text-ax-text-subtle">
          Målet og aktivitetene som foreslås i stegene «Passer denne retningen for deg?» og «Hva vil du starte med?»
          avhenger av svaret på hovedspørsmålet. I tillegg kan brukeren alltid velge «Legg inn en annen aktivitet» eller
          «Jeg vil velge sammen med veilederen min».
        </BodyShort>
      </div>
      {FORSLAG.map((f) => {
        const spor = SPOR.find((s) => s.id === f.sporId)!;
        return (
          <div
            key={f.sporId}
            className="flex flex-col gap-2 rounded-lg border-l-8 p-4"
            style={{ borderLeftColor: spor.farge, backgroundColor: spor.fyll }}
          >
            <Heading size="small" level="3">
              {spor.situasjon.replace("<br/>", " ")}
            </Heading>
            <div className="bg-ax-bg-default rounded-md overflow-x-auto">
              <Table size="small">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell scope="col">Svar</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Foreslått mål</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Foreslåtte aktiviteter</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {f.alternativer.map((a) => (
                    <Table.Row key={a.id}>
                      <Table.DataCell>{a.tekst}</Table.DataCell>
                      <Table.DataCell>{foreslattMal(f.situasjonId, f.fokusNokkel, a.id)}</Table.DataCell>
                      <Table.DataCell>
                        <ul className="list-disc pl-4">
                          {beregnAktiviteter({ situasjonId: f.situasjonId, [f.fokusNokkel]: a.id }).map((akt) => (
                            <li key={akt.id}>{akt.tekst}</li>
                          ))}
                        </ul>
                      </Table.DataCell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        );
      })}
    </section>
  );
}


export default function OnboardingOversiktPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <DekoratorHeader />
      <main className="flex-1 w-full bg-ax-bg-default">
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-6 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <Heading size="large" level="1">
              Flyt for onboarding i Min aktivitetsplan
            </Heading>
            <Link href="/minaktivitetsplan">
              <Button variant="secondary" size="small">
                Tilbake til aktivitetsplanen
              </Button>
            </Link>
          </div>
          <BodyShort className="text-ax-text-subtle">
            Diagrammet viser den faktiske stegmaskinen: spørsmålstekst, svaralternativer og hvor de leder.
            Interne spornavn (A/B/C) vises aldri til brukeren – kun målet og aktiviteten.
          </BodyShort>
        </div>
        <div className="w-full px-6 pb-8">
          <MermaidDiagram chart={FLYT_DIAGRAM} />
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <ForslagTabeller />
        </div>
      </main>
    </div>
  );
}
