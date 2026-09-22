"use client";

import { useState } from "react";
import Image from "next/image";
import { BodyLong, Button, Checkbox, CheckboxGroup, FormProgress, Heading, Radio, RadioGroup, TextField, VStack } from "@navikt/ds-react";
import {
  AKTIVITETER_PER_SPOR,
  ERFARING_ALTERNATIVER,
  IKKE_KLAR_FOKUS_ALTERNATIVER,
  INTERESSE_ALTERNATIVER,
  RETNING_ALTERNATIVER,
  SITUASJON_ALTERNATIVER,
  USIKKER_FOKUS_ALTERNATIVER,
} from "./data";
import { beregnMal, beregnSpor } from "./logic";
import { OnboardingResultat, Svar } from "./types";

// Opplæringsvideo om aktivitetsplanen, hentet fra nav.no.
// 720p brukt i stedet for 144p — lydsporet i 144p-proxyen er nærmest hørbart tomt.
const OPPLAERINGSVIDEO_SRC =
  "https://8ddea47b592f7070a4d71e706ef5ec37-httpcache0-15227-cachedown99.dna.contentdelivery.net/15227-cachedown99/assets/2023-09-21/fb0502e7-2ed9-4f27-a6d5-3a40a68975d2/fb0502e7-2ed9-4f27-a6d5-3a40a68975d2_720p.mp4";

interface OnboardingFlowProps {
  onFullfor: (resultat: OnboardingResultat) => void;
  onHopp: () => void;
}

type Steg =
  | "intro"
  | "situasjon"
  | "finnjobb-retning"
  | "finnjobb-yrke"
  | "finnjobb-erfaring"
  | "finnjobb-avklaring"
  | "ikkeklar-fokus"
  | "usikker-fokus"
  | "bekreft"
  | "aktivitet"
  | "oppsummering";

// Neste steg avhenger av forrige svar, så flyten kan hoppe over irrelevante spørsmål.
function nesteSteg(steg: Steg, svar: Svar): Steg {
  switch (steg) {
    case "intro":
      return "situasjon";
    case "situasjon":
      switch (svar.situasjonId) {
        case "finn-jobb":
          return "finnjobb-retning";
        case "behold-jobb":
          return "bekreft";
        case "ikke-klar":
          return "ikkeklar-fokus";
        default:
          return "usikker-fokus";
      }
    case "finnjobb-retning":
      return svar.retningId === "vet" ? "finnjobb-yrke" : "finnjobb-avklaring";
    case "finnjobb-yrke":
      return "finnjobb-erfaring";
    case "finnjobb-erfaring":
      return "bekreft";
    case "finnjobb-avklaring":
      return "bekreft";
    case "ikkeklar-fokus":
      return "bekreft";
    case "usikker-fokus":
      return "bekreft";
    case "bekreft":
      return "aktivitet";
    case "aktivitet":
      return "oppsummering";
    default:
      return "oppsummering";
  }
}

// Sørger for at et eksklusivt alternativ (f.eks. "vet ikke") ikke kan velges sammen med andre.
function medEksklusiv(forrige: string[] | undefined, nye: string[], eksklusivId: string): string[] {
  const eksklusivNyligLagtTil = nye.includes(eksklusivId) && !(forrige ?? []).includes(eksklusivId);
  if (eksklusivNyligLagtTil) return [eksklusivId];
  return nye.filter((id) => id !== eksklusivId);
}

const FASE_NAVN = ["Innledning", "Din situasjon", "Forslag til mål", "Din første aktivitet", "Oppsummering"];

// Slår sammen de mange dynamiske situasjonsstegene til ett stepper-punkt.
function stegTilFase(steg: Steg): number {
  switch (steg) {
    case "intro":
      return 1;
    case "bekreft":
      return 3;
    case "aktivitet":
      return 4;
    case "oppsummering":
      return 5;
    default:
      return 2;
  }
}

export function OnboardingFlow({ onFullfor, onHopp }: OnboardingFlowProps) {
  const [steg, setSteg] = useState<Steg>("intro");
  const [historikk, setHistorikk] = useState<Steg[]>([]);
  const [svar, setSvar] = useState<Svar>({});
  const [egetMal, setEgetMal] = useState<string | undefined>(undefined);

  const oppdaterSvar = (delvis: Partial<Svar>) => setSvar((prev) => ({ ...prev, ...delvis }));

  const gaVidere = (delvis?: Partial<Svar>) => {
    const nyttSvar = delvis ? { ...svar, ...delvis } : svar;
    if (delvis) setSvar(nyttSvar);
    setHistorikk((prev) => [...prev, steg]);
    setSteg(nesteSteg(steg, nyttSvar));
  };

  const gaTilbake = () => {
    setHistorikk((prev) => {
      const kopi = [...prev];
      const forrige = kopi.pop();
      if (forrige) setSteg(forrige);
      return kopi;
    });
  };

  // Lar brukeren klikke seg tilbake til et tidligere faseoverskrift i FormProgress, men ikke fremover.
  const hoppTilFase = (fase: number) => {
    const naavarendeFase = stegTilFase(steg);
    if (fase >= naavarendeFase) return;
    const alleSteg = [...historikk, steg];
    const idx = alleSteg.map(stegTilFase).lastIndexOf(fase);
    if (idx === -1) return;
    setHistorikk(alleSteg.slice(0, idx));
    setSteg(alleSteg[idx]);
  };

  const spor = beregnSpor(svar);
  const foreslattMal = spor ? beregnMal(svar, spor) : "";
  const malTekst = egetMal ?? svar.malTekst ?? foreslattMal;
  const aktiviteter = spor ? AKTIVITETER_PER_SPOR[spor] : [];
  const aktivitetTittel =
    svar.aktivitetId === "eget"
      ? svar.egenAktivitetTekst?.trim()
      : aktiviteter.find((a) => a.id === svar.aktivitetId)?.tekst;

  const fullfor = () => {
    if (!spor) return;
    onFullfor({
      spor,
      svar: { ...svar, malTekst },
      malTekst,
      aktivitetTittel: svar.velgMedVeileder ? undefined : aktivitetTittel,
      velgMedVeileder: Boolean(svar.velgMedVeileder),
    });
  };

  const TilbakeKnapp = () =>
    historikk.length > 0 ? (
      <Button variant="secondary" onClick={gaTilbake}>
        Tilbake
      </Button>
    ) : null;

  const HoppKnapp = () => (
    <Button variant="tertiary" onClick={onHopp}>
      Hopp rett til aktivitetsplanen
    </Button>
  );

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 md:px-6 flex flex-col gap-4 pt-6 pb-[25px] relative">
        <Image
          src="/Trenger-hjelp-til-a-komme-i-jobb.png"
          alt=""
          width={80}
          height={80}
          loading="eager"
          style={{ width: "80px", height: "80px" }}
          className="hidden lg:block absolute right-full top-8 mr-8 shrink-0"
        />
        <div className="flex flex-col gap-4 flex-1">
          <Heading size="large" level="1">
            Velkommen til din aktivitetsplan
          </Heading>
          <BodyLong>
            I aktivitetsplanen holder du oversikt over det du gjør for å komme i jobb eller en annen
            aktivitet. Både du og Nav-veilederen din kan se og endre i aktivitetsplanen.
          </BodyLong>
        </div>
        <FormProgress totalSteps={FASE_NAVN.length} activeStep={stegTilFase(steg)} onStepChange={hoppTilFase}>
          {FASE_NAVN.map((navn, i) => {
            const fase = i + 1;
            return (
              <FormProgress.Step key={navn} interactive={fase <= stegTilFase(steg)} completed={fase < stegTilFase(steg)}>
                {navn}
              </FormProgress.Step>
            );
          })}
        </FormProgress>
      </div>

      <div className="w-screen relative left-1/2 -translate-x-1/2 bg-[var(--ax-bg-accent-soft)]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      <VStack gap="space-24" className="w-full min-w-0 bg-ax-bg-default rounded-2xl p-4 md:p-8">
        {steg === "intro" && (
          <>
            <video controls preload="metadata" className="w-full rounded-md" src={OPPLAERINGSVIDEO_SRC}>
              Nettleseren din støtter ikke videoavspilling.
            </video>
            <Heading level="2" size="medium">
              La oss gjøre planen relevant for deg
            </Heading>
            <BodyLong>
              Denne veiviseren hjelper deg med å komme i gang med aktivitetsplanen. Du kan endre svarene
              dine på et senere tidspunkt.
            </BodyLong>
            <div className="flex gap-3">
              <Button onClick={() => gaVidere()}>Kom i gang</Button>
              <HoppKnapp />
            </div>
          </>
        )}

        {steg === "situasjon" && (
          <>
            <Heading level="1" size="medium">
              Hva beskriver din situasjon best?
            </Heading>
            <RadioGroup legend="Velg det som passer best" hideLegend value={svar.situasjonId ?? null} onChange={(v) => oppdaterSvar({ situasjonId: v as string })}>
              <VStack gap="space-12">
                {SITUASJON_ALTERNATIVER.map((a) => (
                  <Radio key={a.id} value={a.id}>
                    {a.tekst}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere()} disabled={!svar.situasjonId}>
                Neste
              </Button>
              <HoppKnapp />
            </div>
          </>
        )}

        {steg === "finnjobb-retning" && (
          <>
            <Heading level="1" size="medium">
              Vet du hvilken type jobb du ser etter?
            </Heading>
            <RadioGroup legend="Velg det som passer best" hideLegend value={svar.retningId ?? null} onChange={(v) => oppdaterSvar({ retningId: v as string })}>
              <VStack gap="space-12">
                {RETNING_ALTERNATIVER.map((a) => (
                  <Radio key={a.id} value={a.id}>
                    {a.tekst}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere()} disabled={!svar.retningId}>
                Neste
              </Button>
              <HoppKnapp />
            </div>
          </>
        )}

        {steg === "finnjobb-yrke" && (
          <>
            <Heading level="1" size="medium">
              Søk etter yrke, stilling eller bransje
            </Heading>
            <TextField
              label="Yrke, stilling eller bransje"
              value={svar.yrke ?? ""}
              onChange={(e) => oppdaterSvar({ yrke: e.target.value })}
            />
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere()}>Neste</Button>
              <HoppKnapp />
            </div>
          </>
        )}

        {steg === "finnjobb-erfaring" && (
          <>
            <Heading level="1" size="medium">
              Hva slags erfaring har du med jobbene du ser etter?
            </Heading>
            <RadioGroup legend="Velg det som passer best" hideLegend value={svar.erfaringId ?? null} onChange={(v) => oppdaterSvar({ erfaringId: v as string })}>
              <VStack gap="space-12">
                {ERFARING_ALTERNATIVER.map((a) => (
                  <Radio key={a.id} value={a.id}>
                    {a.tekst}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere()} disabled={!svar.erfaringId}>
                Neste
              </Button>
              <HoppKnapp />
            </div>
          </>
        )}

        {steg === "finnjobb-avklaring" && (
          <>
            <Heading level="1" size="medium">
              Litt mer om deg
            </Heading>
            <BodyLong>
              Dette hjelper veilederen din med å komme raskere i gang med å finne jobber som kan passe for
              deg.
            </BodyLong>
            <CheckboxGroup
              legend="Hva slags oppgaver liker du å jobbe med?"
              value={svar.interesseIder ?? []}
              onChange={(v) =>
                oppdaterSvar({ interesseIder: medEksklusiv(svar.interesseIder, v as string[], "vet-ikke") })
              }
            >
              <VStack gap="space-12">
                {INTERESSE_ALTERNATIVER.map((a) => (
                  <Checkbox key={a.id} value={a.id}>
                    {a.tekst}
                  </Checkbox>
                ))}
              </VStack>
            </CheckboxGroup>
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere()} disabled={!svar.interesseIder?.length}>
                Neste
              </Button>
              <HoppKnapp />
            </div>
          </>
        )}

        {steg === "ikkeklar-fokus" && (
          <>
            <Heading level="1" size="medium">
              Hva trenger du først og fremst å finne ut av?
            </Heading>
            <RadioGroup legend="Velg det som passer best" hideLegend value={svar.ikkeKlarFokusId ?? null} onChange={(v) => oppdaterSvar({ ikkeKlarFokusId: v as string })}>
              <VStack gap="space-12">
                {IKKE_KLAR_FOKUS_ALTERNATIVER.map((a) => (
                  <Radio key={a.id} value={a.id}>
                    {a.tekst}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere()} disabled={!svar.ikkeKlarFokusId}>
                Neste
              </Button>
              <HoppKnapp />
            </div>
          </>
        )}

        {steg === "usikker-fokus" && (
          <>
            <Heading level="1" size="medium">
              Hva er du mest usikker på?
            </Heading>
            <RadioGroup legend="Velg det som passer best" hideLegend value={svar.usikkerFokusId ?? null} onChange={(v) => oppdaterSvar({ usikkerFokusId: v as string })}>
              <VStack gap="space-12">
                {USIKKER_FOKUS_ALTERNATIVER.map((a) => (
                  <Radio key={a.id} value={a.id}>
                    {a.tekst}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere()} disabled={!svar.usikkerFokusId}>
                Neste
              </Button>
              <HoppKnapp />
            </div>
          </>
        )}

        {steg === "bekreft" && (
          <>
            <Heading level="1" size="medium">
              Dette kan være en god retning for deg
            </Heading>
            <TextField
              label="Mål"
              value={malTekst}
              onChange={(e) => setEgetMal(e.target.value)}
            />
            {svar.yrke && <BodyLong>Yrke eller bransje: {svar.yrke}</BodyLong>}
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere({ malTekst })} disabled={!malTekst.trim()}>
                Dette passer
              </Button>
              <HoppKnapp />
            </div>
          </>
        )}

        {steg === "aktivitet" && spor && (
          <>
            <Heading level="1" size="medium">
              Hva vil du starte med?
            </Heading>
            <BodyLong>Forslag til første steg mot målet ditt: {malTekst}</BodyLong>
            <RadioGroup
              legend="Velg en aktivitet"
              hideLegend
              value={svar.velgMedVeileder ? "veileder" : svar.aktivitetId ?? null}
              onChange={(v) => {
                if (v === "veileder") {
                  oppdaterSvar({ velgMedVeileder: true, aktivitetId: undefined });
                } else {
                  oppdaterSvar({ velgMedVeileder: false, aktivitetId: v as string });
                }
              }}
            >
              <VStack gap="space-12">
                {aktiviteter.map((a) => (
                  <Radio key={a.id} value={a.id}>
                    {a.tekst}
                  </Radio>
                ))}
                <Radio value="eget">Legg inn en annen aktivitet</Radio>
                <Radio value="veileder">Jeg vil velge sammen med veilederen min</Radio>
              </VStack>
            </RadioGroup>
            {svar.aktivitetId === "eget" && !svar.velgMedVeileder && (
              <TextField
                label="Aktivitet"
                value={svar.egenAktivitetTekst ?? ""}
                onChange={(e) => oppdaterSvar({ egenAktivitetTekst: e.target.value })}
              />
            )}
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button
                onClick={() => gaVidere()}
                disabled={
                  !svar.velgMedVeileder &&
                  (!svar.aktivitetId || (svar.aktivitetId === "eget" && !svar.egenAktivitetTekst?.trim()))
                }
              >
                Neste
              </Button>
              <HoppKnapp />
            </div>
          </>
        )}

        {steg === "oppsummering" && (
          <>
            <Heading level="1" size="medium">
              Du er klar til å komme i gang
            </Heading>
            <VStack gap="space-8">
              <BodyLong>
                <strong>Målet ditt:</strong> {malTekst}
              </BodyLong>
              {svar.velgMedVeileder ? (
                <BodyLong>
                  <strong>Neste steg:</strong> Velge første aktivitet sammen med veilederen din
                </BodyLong>
              ) : (
                <BodyLong>
                  <strong>Første aktivitet:</strong> {aktivitetTittel}
                </BodyLong>
              )}
            </VStack>
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={fullfor}>Gå til aktivitetsplanen</Button>
            </div>
          </>
        )}
      </VStack>
        </div>
      </div>
    </>
  );
}
