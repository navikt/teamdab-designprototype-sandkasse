"use client";

import { useState } from "react";
import { BodyLong, Button, Heading, Radio, RadioGroup, TextField, VStack } from "@navikt/ds-react";
import {
  AKTIVITETER_PER_SPOR,
  BEHOLD_OMFANG_ALTERNATIVER,
  BEHOLD_USIKKERHET_ALTERNATIVER,
  ERFARING_ALTERNATIVER,
  IKKE_KLAR_FOKUS_ALTERNATIVER,
  OMFANG_ALTERNATIVER,
  OMFANG_USIKKERHET_ALTERNATIVER,
  RETNING_ALTERNATIVER,
  SITUASJON_ALTERNATIVER,
  TILBAKE_RETNING_ALTERNATIVER,
  USIKKER_EKSISTERENDE_VALG_ALTERNATIVER,
  USIKKER_FOKUS_ALTERNATIVER,
} from "./data";
import { beregnMal, beregnSpor } from "./logic";
import { OnboardingResultat, Svar } from "./types";

interface OnboardingFlowProps {
  onFullfor: (resultat: OnboardingResultat) => void;
}

type Steg =
  | "intro"
  | "situasjon"
  | "finnjobb-retning"
  | "finnjobb-yrke"
  | "finnjobb-erfaring"
  | "finnjobb-omfang"
  | "finnjobb-omfang-usikkerhet"
  | "behold-omfang"
  | "behold-usikkerhet"
  | "tilbake-retning"
  | "ikkeklar-fokus"
  | "usikker-fokus"
  | "usikker-eksisterende-valg"
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
          return "behold-omfang";
        case "tilbake-jobb":
          return "tilbake-retning";
        case "ikke-klar":
          return "ikkeklar-fokus";
        default:
          return "usikker-fokus";
      }
    case "finnjobb-retning":
      if (svar.retningId === "vet") return "finnjobb-yrke";
      if (svar.retningId === "trenger-hjelp") return "usikker-fokus";
      return "finnjobb-erfaring";
    case "finnjobb-yrke":
      return "finnjobb-erfaring";
    case "finnjobb-erfaring":
      return "finnjobb-omfang";
    case "finnjobb-omfang":
      return svar.omfangId === "usikker" ? "finnjobb-omfang-usikkerhet" : "bekreft";
    case "finnjobb-omfang-usikkerhet":
      return "bekreft";
    case "behold-omfang":
      return svar.beholdOmfangId === "usikker" ? "behold-usikkerhet" : "bekreft";
    case "behold-usikkerhet":
      return "bekreft";
    case "tilbake-retning":
      return "bekreft";
    case "ikkeklar-fokus":
      return "bekreft";
    case "usikker-fokus":
      return svar.usikkerFokusId === "eksisterende-jobb" ? "usikker-eksisterende-valg" : "bekreft";
    case "usikker-eksisterende-valg":
      return svar.usikkerEksisterendeValgId === "behold" ? "behold-omfang" : "tilbake-retning";
    case "bekreft":
      return "aktivitet";
    case "aktivitet":
      return "oppsummering";
    default:
      return "oppsummering";
  }
}

export function OnboardingFlow({ onFullfor }: OnboardingFlowProps) {
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

  return (
    <div className="max-w-[600px] mx-auto py-12 px-4">
      <VStack gap="space-24">
        {steg === "intro" && (
          <>
            <Heading level="1" size="medium">
              La oss gjøre planen relevant for deg
            </Heading>
            <BodyLong>
              Svar på noen få spørsmål om situasjonen din. Da kan vi hjelpe deg med å sette en retning og
              komme i gang med et første steg.
            </BodyLong>
            <div>
              <Button onClick={() => gaVidere()}>Kom i gang</Button>
            </div>
          </>
        )}

        {steg === "situasjon" && (
          <>
            <Heading level="1" size="medium">
              Hva passer best for deg akkurat nå?
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
            </div>
          </>
        )}

        {steg === "finnjobb-retning" && (
          <>
            <Heading level="1" size="medium">
              Hva slags jobb ser du etter?
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
            </div>
          </>
        )}

        {steg === "finnjobb-omfang" && (
          <>
            <Heading level="1" size="medium">
              Hvor mye ønsker du å jobbe?
            </Heading>
            <RadioGroup legend="Velg omfang" hideLegend value={svar.omfangId ?? null} onChange={(v) => oppdaterSvar({ omfangId: v as string })}>
              <VStack gap="space-12">
                {OMFANG_ALTERNATIVER.map((a) => (
                  <Radio key={a.id} value={a.id}>
                    {a.tekst}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere()} disabled={!svar.omfangId}>
                Neste
              </Button>
            </div>
          </>
        )}

        {steg === "finnjobb-omfang-usikkerhet" && (
          <>
            <Heading level="1" size="medium">
              Hva handler usikkerheten mest om?
            </Heading>
            <RadioGroup legend="Velg det som passer best" hideLegend value={svar.omfangUsikkerhetId ?? null} onChange={(v) => oppdaterSvar({ omfangUsikkerhetId: v as string })}>
              <VStack gap="space-12">
                {OMFANG_USIKKERHET_ALTERNATIVER.map((a) => (
                  <Radio key={a.id} value={a.id}>
                    {a.tekst}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere()} disabled={!svar.omfangUsikkerhetId}>
                Neste
              </Button>
            </div>
          </>
        )}

        {steg === "behold-omfang" && (
          <>
            <Heading level="1" size="medium">
              Hvor mye ønsker du å jobbe?
            </Heading>
            <RadioGroup legend="Velg omfang" hideLegend value={svar.beholdOmfangId ?? null} onChange={(v) => oppdaterSvar({ beholdOmfangId: v as string })}>
              <VStack gap="space-12">
                {BEHOLD_OMFANG_ALTERNATIVER.map((a) => (
                  <Radio key={a.id} value={a.id}>
                    {a.tekst}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere()} disabled={!svar.beholdOmfangId}>
                Neste
              </Button>
            </div>
          </>
        )}

        {steg === "behold-usikkerhet" && (
          <>
            <Heading level="1" size="medium">
              Hva handler usikkerheten mest om?
            </Heading>
            <RadioGroup legend="Velg det som passer best" hideLegend value={svar.beholdUsikkerhetId ?? null} onChange={(v) => oppdaterSvar({ beholdUsikkerhetId: v as string })}>
              <VStack gap="space-12">
                {BEHOLD_USIKKERHET_ALTERNATIVER.map((a) => (
                  <Radio key={a.id} value={a.id}>
                    {a.tekst}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere()} disabled={!svar.beholdUsikkerhetId}>
                Neste
              </Button>
            </div>
          </>
        )}

        {steg === "tilbake-retning" && (
          <>
            <Heading level="1" size="medium">
              Hva passer best for deg?
            </Heading>
            <RadioGroup legend="Velg det som passer best" hideLegend value={svar.tilbakeRetningId ?? null} onChange={(v) => oppdaterSvar({ tilbakeRetningId: v as string })}>
              <VStack gap="space-12">
                {TILBAKE_RETNING_ALTERNATIVER.map((a) => (
                  <Radio key={a.id} value={a.id}>
                    {a.tekst}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere()} disabled={!svar.tilbakeRetningId}>
                Neste
              </Button>
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
            </div>
          </>
        )}

        {steg === "usikker-eksisterende-valg" && (
          <>
            <Heading level="1" size="medium">
              Hva passer best for deg?
            </Heading>
            <RadioGroup legend="Velg det som passer best" hideLegend value={svar.usikkerEksisterendeValgId ?? null} onChange={(v) => oppdaterSvar({ usikkerEksisterendeValgId: v as string })}>
              <VStack gap="space-12">
                {USIKKER_EKSISTERENDE_VALG_ALTERNATIVER.map((a) => (
                  <Radio key={a.id} value={a.id}>
                    {a.tekst}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
            <div className="flex gap-3">
              <TilbakeKnapp />
              <Button onClick={() => gaVidere()} disabled={!svar.usikkerEksisterendeValgId}>
                Neste
              </Button>
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
  );
}
