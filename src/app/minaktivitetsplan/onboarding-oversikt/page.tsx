import Link from "next/link";
import { Heading, BodyShort, Button } from "@navikt/ds-react";
import { DekoratorHeader } from "@/components/dekorator-lookalike/DekoratorHeader";
import { DekoratorFooter } from "@/components/dekorator-lookalike/DekoratorFooter";
import { MermaidDiagram } from "@/components/MermaidDiagram";

// Speiler nesteSteg()-logikken i src/components/bruker/onboarding/OnboardingFlow.tsx.
// Hold denne i sync manuelt når stegmaskinen endres.
const FLYT_DIAGRAM = `
flowchart TD
  intro["Velkommen til din aktivitetsplan<br/>«Kom i gang»"] --> situasjon

  situasjon{"Hva beskriver din situasjon best?"}

  situasjon -->|"Jeg vil finne meg en jobb"| finnjobbRetning
  situasjon -->|"Trenger hjelp til å bli værende i jobben"| beholdJobbFokus
  situasjon -->|"Ikke klar for jobb akkurat nå"| ikkeKlarFokus
  situasjon -->|"Usikker på hva som passer"| usikkerFokus

  finnjobbRetning{"Vet du hvilken type jobb du ser etter?"}
  finnjobbRetning -->|"Ja"| finnjobbYrke["Søk etter yrke, stilling eller bransje"]
  finnjobbRetning -->|"Nei"| finnjobbAvklaring["Litt mer om deg<br/>(oppgavetyper, flervalg)"]

  finnjobbYrke --> finnjobbErfaring{"Hva slags erfaring har du<br/>med jobbene du ser etter?"}
  finnjobbErfaring -->|"Relevant erfaring/utdanning → Spor A"| bekreft
  finnjobbErfaring -->|"Mangler erfaring/vet ikke → Spor B"| bekreft

  finnjobbAvklaring -->|"Fast: Spor B"| bekreft

  beholdJobbFokus{"Hva tenker du kan være et realistisk<br/>første steg for å bli værende i jobben?"}
  beholdJobbFokus -->|"Få bedre tilrettelegging på arbeidsplassen"| bekreft
  beholdJobbFokus -->|"Håndtere en helseutfordring som påvirker jobben"| bekreft
  beholdJobbFokus -->|"Bedre dialog eller avklaring med arbeidsgiveren min"| bekreft
  beholdJobbFokus -->|"Noe annet enn dette"| beholdJobbAnnet["Beskriv med egne ord (fritekst)"]
  beholdJobbFokus -->|"Vet ikke ennå – sammen med veileder"| bekreft
  beholdJobbAnnet --> bekreft

  ikkeKlarFokus{"Hva tenker du kan være et realistisk<br/>første steg mot jobb?"}
  ikkeKlarFokus -->|"Mestre en vanskelig livssituasjon bedre"| bekreft
  ikkeKlarFokus -->|"Styrke helsen og funksjonsevnen min"| bekreft
  ikkeKlarFokus -->|"Bygge mer kunnskap og erfaring"| bekreft
  ikkeKlarFokus -->|"Utforske hvilken type arbeid som kan passe for meg"| bekreft
  ikkeKlarFokus -->|"Noe annet enn dette"| ikkeKlarAnnet["Beskriv med egne ord (fritekst)"]
  ikkeKlarFokus -->|"Vet ikke ennå – sammen med veileder"| bekreft
  ikkeKlarAnnet --> bekreft

  usikkerFokus{"Hva er du mest usikker på?"}
  usikkerFokus -->|"Hvilke jobber som kan passe / Erfaring og kompetanse → Spor B"| bekreft
  usikkerFokus -->|"Klar for å jobbe nå / Hvor mye jeg kan jobbe / Vet ikke ennå → Spor C"| bekreft

  bekreft["Dette kan være en god retning for deg<br/>(mål vises, kan redigeres)"] -->|"Dette passer"| aktivitet
  bekreft -->|"Endre"| bekreft

  aktivitet["Hva vil du starte med?<br/>(forslag / egen aktivitet / sammen med veileder)"] --> oppsummering

  oppsummering["Du er klar til å komme i gang<br/>(mål + første aktivitet)"] --> ferdig(["Gå til aktivitetsplanen"])
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
