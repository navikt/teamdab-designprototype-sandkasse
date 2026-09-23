import Link from "next/link";
import { Heading, BodyShort, Button } from "@navikt/ds-react";
import { DekoratorHeader } from "@/components/dekorator-lookalike/DekoratorHeader";
import { DekoratorFooter } from "@/components/dekorator-lookalike/DekoratorFooter";
import { MermaidDiagram } from "@/components/MermaidDiagram";

// Speiler nesteSteg()-logikken i src/components/bruker/onboarding/OnboardingFlow.tsx.
// Hold denne i sync manuelt når stegmaskinen endres.
const FLYT_DIAGRAM = `
flowchart TD
  intro["La oss gjøre planen relevant for deg<br/>«Kom i gang»"] --> situasjon

  situasjon{"Hva beskriver din situasjon best?"}

  situasjon -->|"Jeg vil finne meg en jobb"| finnjobbFokus
  situasjon -->|"Trenger hjelp til å bli værende i jobben"| beholdJobbFokus
  situasjon -->|"Ikke klar for jobb akkurat nå"| ikkeKlarFokus
  situasjon -->|"Usikker på hva som passer"| usikkerFokus

  finnjobbFokus{"Hva trenger du mest hjelp til<br/>i jobbsøket akkurat nå?"}
  finnjobbFokus -->|"Søke på en bestemt type jobb"| finnjobbYrke["Yrke, stilling eller bransje (valgfritt)"]
  finnjobbFokus -->|"Jeg er usikker på hvilken retning<br/>eller bransje som passer for meg"| finnjobbInteresser["Hva slags oppgaver liker du å jobbe med? (valgfritt)"]
  finnjobbFokus -->|"Jeg mangler erfaring eller kvalifikasjoner<br/>for jobbene jeg vil ha"| bekreft
  finnjobbFokus -->|"Noe annet enn dette"| finnjobbAnnet["Beskriv med egne ord (fritekst)"]
  finnjobbFokus -->|"Jeg vet ikke ennå – vil finne ut<br/>av dette sammen med veilederen min"| bekreft
  finnjobbYrke --> bekreft
  finnjobbInteresser --> bekreft
  finnjobbAnnet --> bekreft

  beholdJobbFokus{"Hva tror du kan hjelpe deg<br/>til å bli i jobben?"}
  beholdJobbFokus -->|"Få jobben tilpasset, for eksempel<br/>arbeidstid, oppgaver eller utstyr"| bekreft
  beholdJobbFokus -->|"Få helsa til å fungere bedre sammen med jobben"| bekreft
  beholdJobbFokus -->|"Snakke bedre med sjefen min<br/>om hvordan det går"| bekreft
  beholdJobbFokus -->|"Noe annet enn dette"| beholdJobbAnnet["Beskriv med egne ord (fritekst)"]
  beholdJobbFokus -->|"Jeg vet ikke ennå – vil finne ut<br/>av dette sammen med veilederen min"| bekreft
  beholdJobbAnnet --> bekreft

  ikkeKlarFokus{"Hva tror du kan hjelpe<br/>deg videre mot jobb?"}
  ikkeKlarFokus -->|"Mestre en vanskelig livssituasjon bedre"| bekreft
  ikkeKlarFokus -->|"Bli sterkere fysisk eller psykisk"| bekreft
  ikkeKlarFokus -->|"Bygge mer kunnskap og erfaring"| bekreft
  ikkeKlarFokus -->|"Utforske hvilken type arbeid som kan passe for meg"| bekreft
  ikkeKlarFokus -->|"Noe annet enn dette"| ikkeKlarAnnet["Beskriv med egne ord (fritekst)"]
  ikkeKlarFokus -->|"Jeg vet ikke ennå – vil finne ut<br/>av dette sammen med veilederen min"| bekreft
  ikkeKlarAnnet --> bekreft

  usikkerFokus{"Hva er du mest usikker på?"}
  usikkerFokus -->|"Hvilke jobber som kan passe for meg"| bekreft
  usikkerFokus -->|"Om jeg har erfaringen eller kompetansen jeg trenger"| bekreft
  usikkerFokus -->|"Om jeg er klar for å jobbe nå"| bekreft
  usikkerFokus -->|"Hvor mye jeg kan jobbe"| bekreft
  usikkerFokus -->|"Jeg vet ikke ennå"| bekreft

  bekreft["Passer denne retningen for deg?<br/>(forslag til mål, direkte redigerbart felt)"] -->|"Dette passer"| aktivitet

  aktivitet["Hva vil du starte med?<br/>(forslag / egen aktivitet / sammen med veileder)"] --> oppsummering

  oppsummering["Du er klar til å komme i gang<br/>(mål + første aktivitet)"] --> ferdig(["Gå til aktivitetsplanen"])

  intro -.->|"Hopp rett til aktivitetsplanen<br/>(tilgjengelig på alle steg)"| ferdig
`;


export default function OnboardingOversiktPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <DekoratorHeader />
      <main className="flex-1 w-full bg-ax-bg-default">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
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

          <MermaidDiagram chart={FLYT_DIAGRAM} />
        </div>
      </main>
      <DekoratorFooter />
    </div>
  );
}
