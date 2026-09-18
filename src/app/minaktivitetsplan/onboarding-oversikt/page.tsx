import Link from "next/link";
import { Heading, BodyShort, Tag, Button } from "@navikt/ds-react";
import { DekoratorHeader } from "@/components/dekorator-lookalike/DekoratorHeader";
import { DekoratorFooter } from "@/components/dekorator-lookalike/DekoratorFooter";

interface Steg {
  tittel: string;
  detaljer?: string[];
}

interface Gren {
  situasjon: string;
  spor: string;
  sporFarge: "info" | "success" | "warning" | "neutral";
  steg: Steg[];
  malEksempel: string;
  notat?: string;
}

const GRENER: Gren[] = [
  {
    situasjon: "«Jeg vil finne meg en jobb»",
    spor: "Spor A eller B (avhenger av svarene)",
    sporFarge: "info",
    steg: [
      { tittel: "Jobbretning", detaljer: ["Vet → yrke/bransje", "Vurderer → erfaring", "Trenger hjelp → «Hva er du mest usikker på?»"] },
      { tittel: "Yrke/bransje (hvis «vet»)" },
      { tittel: "Erfaring og kompetanse (hvis «vet»/«vurderer»)" },
      { tittel: "Ønsket omfang", detaljer: ["Heltid / Deltid / Begge / Usikker"] },
      { tittel: "Usikker → avklar hva", detaljer: ["Realistisk omfang → Spor C", "Hvilke stillinger → påvirker ikke spor"] },
    ],
    malEksempel: "«Finne en heltidsjobb innen lager og logistikk»",
  },
  {
    situasjon: "«Jeg har jobb, men trenger hjelp til å bli værende»",
    spor: "Eksisterende jobb – beholde",
    sporFarge: "success",
    steg: [
      { tittel: "Ønsket omfang", detaljer: ["Heltid / Deltid / Usikker"] },
      { tittel: "Usikker → avklar hva", detaljer: ["Realistisk omfang", "Få det til i nåværende jobb"] },
    ],
    malEksempel: "«Beholde jobben og jobbe heltid»",
  },
  {
    situasjon: "«Jeg er borte fra jobb og ønsker å komme tilbake»",
    spor: "Eksisterende jobb – tilbake, eller Spor C",
    sporFarge: "success",
    steg: [
      {
        tittel: "Ønsket retning",
        detaljer: [
          "Like mye som før / Heltid / Deltid → Eksisterende jobb – tilbake",
          "Usikker på omfang → Eksisterende jobb – tilbake (foreløpig mål)",
          "Usikker på om retur er realistisk → Spor C",
        ],
      },
    ],
    malEksempel: "«Komme tilbake til jobben på deltid»",
  },
  {
    situasjon: "«Jeg er ikke klar for jobb akkurat nå»",
    spor: "Spor C",
    sporFarge: "warning",
    steg: [
      {
        tittel: "Hva vil du finne ut av først?",
        detaljer: [
          "Hva som skal til for at jobb kan bli mulig",
          "Hva slags arbeid som kan passe",
          "Hvor mye som er realistisk",
          "Hjelp fra veileder før mål settes",
        ],
      },
    ],
    malEksempel: "«Finne ut hva som skal til for at jobb kan bli mulig»",
  },
  {
    situasjon: "«Jeg er usikker på hva som passer»",
    spor: "Spor B, Spor C, eller Eksisterende jobb",
    sporFarge: "neutral",
    steg: [
      {
        tittel: "Hva er du mest usikker på?",
        detaljer: [
          "Hvilke jobber som kan passe → Spor B",
          "Om jeg har rett erfaring/kompetanse → Spor B",
          "Om jeg er klar for å jobbe nå → Spor C",
          "Hvor mye jeg kan jobbe → Spor C",
          "Beholde/komme tilbake til eksisterende jobb → videre spørsmål",
          "Vet ikke ennå → Spor C (sammen med veileder)",
        ],
      },
    ],
    malEksempel: "«Finne en jobbretning som passer kompetansen min»",
    notat: "Ved «beholde eller komme tilbake» stilles et ekstra valg som leder videre inn i «beholde»- eller «tilbake»-sporet over.",
  },
];

function Boks({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-ax-border-neutral-subtle bg-ax-bg-default p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Pil() {
  return <div className="text-ax-text-subtle text-center leading-none">↓</div>;
}

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
            Oversikten viser rekkefølgen på spørsmål og hvordan svarene leder til internt spor og mål.
            Sporene vises aldri til brukeren – kun målet og aktiviteten.
          </BodyShort>

          <Boks className="text-center">
            <Heading size="small" level="2">
              1. Introduksjon
            </Heading>
            <BodyShort>«La oss gjøre planen relevant for deg» → «Kom i gang»</BodyShort>
          </Boks>
          <Pil />
          <Boks className="text-center">
            <Heading size="small" level="2">
              2. «Hva passer best for deg akkurat nå?»
            </Heading>
            <BodyShort>Brukeren velger ett av fem alternativer, som styrer hvilken gren som vises videre.</BodyShort>
          </Boks>
          <Pil />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {GRENER.map((gren) => (
              <div key={gren.situasjon} className="flex flex-col gap-2">
                <Boks className="bg-[var(--ax-bg-accent-soft)]">
                  <BodyShort weight="semibold">{gren.situasjon}</BodyShort>
                </Boks>
                <Pil />
                {gren.steg.map((steg, i) => (
                  <div key={steg.tittel} className="flex flex-col gap-2">
                    <Boks>
                      <BodyShort weight="semibold">{steg.tittel}</BodyShort>
                      {steg.detaljer && (
                        <ul className="list-disc pl-5 mt-1">
                          {steg.detaljer.map((d) => (
                            <li key={d} className="text-sm text-ax-text-subtle">
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Boks>
                    {i < gren.steg.length - 1 && <Pil />}
                  </div>
                ))}
                <Pil />
                <Boks>
                  <div className="flex flex-col gap-2">
                    <Tag variant={gren.sporFarge} size="small">
                      {gren.spor}
                    </Tag>
                    <BodyShort className="text-sm text-ax-text-subtle">Eksempel på mål: {gren.malEksempel}</BodyShort>
                    {gren.notat && <BodyShort className="text-sm text-ax-text-subtle italic">{gren.notat}</BodyShort>}
                  </div>
                </Boks>
              </div>
            ))}
          </div>

          <Pil />
          <Boks className="text-center">
            <Heading size="small" level="2">
              3. «Dette kan være en god retning for deg»
            </Heading>
            <BodyShort>Brukeren ser og kan redigere det foreslåtte målet. «Dette passer» → «Endre»</BodyShort>
          </Boks>
          <Pil />
          <Boks className="text-center">
            <Heading size="small" level="2">
              4. «Hva vil du starte med?»
            </Heading>
            <BodyShort>
              Forslag til aktiviteter tilpasset spor, eller egen aktivitet, eller «velg sammen med veilederen min».
            </BodyShort>
          </Boks>
          <Pil />
          <Boks className="text-center">
            <Heading size="small" level="2">
              5. «Du er klar til å komme i gang»
            </Heading>
            <BodyShort>Oppsummering av mål og første aktivitet → «Gå til aktivitetsplanen»</BodyShort>
          </Boks>
        </div>
      </main>
      <DekoratorFooter />
    </div>
  );
}
