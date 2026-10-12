"use client";

import { ChatElipsisIcon, PencilIcon } from "@navikt/aksel-icons";
import {
  Accordion,
  Alert,
  BodyShort,
  Button,
  Checkbox,
  Detail,
  Heading,
  HelpText,
  Modal,
  Radio,
  RadioGroup,
  ReadMore,
  Switch,
  Tag,
  Textarea,
  Label,
} from "@navikt/ds-react";
import { Dispatch, SetStateAction, useState } from "react";
import { AktivitetsKort, ForhaandsorienteringType, KOLONNE_LABELS, KolonneId, Perspektiv } from "../types";
import { CustomBodyLong } from "../shared/CustomBodyLong";
import { DetaljFelt } from "../shared/DetaljFelt";
import { EkspanderbartTekstomrade } from "../shared/EkspanderbartTekstomrade";
import {
  HILSEN_TEKST,
  MOTE_INGRESS,
  STATUS_REKKEFOLGE,
  erFerdig,
  erMerEnnSyvDagerTil,
  formaterDatoLang,
  formaterTidspunkt,
  formatterVarighet,
  lagHistorikkInnslag,
  VEILEDER_NAVN,
  VEILEDER_TITTEL,
  moteStart,
} from "./moteUtils";

// Tekstene er hentet fra utilsForhaandsorientering.ts i aktivitetsplan-repoet.
const AVTALT_TEKST =
  "Det er viktig at du gjennomfører denne aktiviteten med Nav. Gjør du ikke det, kan det medføre at stønaden du mottar fra Nav bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ber vi deg ta kontakt med veilederen din så snart som mulig.";
const AVTALT_TEKST_119 = `Ta kontakt med oss så raskt som mulig hvis du ikke kan gjennomføre denne aktiviteten.

Det er viktig fordi hvis du uten rimelig grunn lar være å komme på møter eller ikke gjennomfører fastsatte aktiviteter, så kan vi redusere utbetalingen din med en stønadsdag. Det går frem av folketrygdloven § 11-9 og forskrift om arbeidsavklaringspenger § 4`;

interface Props {
  kort: AktivitetsKort;
  perspektiv: Perspektiv;
  brukerNavn: string;
  setKort: Dispatch<SetStateAction<AktivitetsKort[]>>;
  onEndre: () => void;
  onClose: () => void;
}

export function MoteDetaljerModal({ kort, perspektiv, brukerNavn, setKort, onEndre, onClose }: Props) {
  const erVeileder = perspektiv === "veileder";
  const ferdig = erFerdig(kort);
  const oppdater = (endre: (k: AktivitetsKort) => AktivitetsKort) =>
    setKort((prev) => prev.map((k) => (k.id === kort.id ? endre(k) : k)));

  const [naa] = useState(() => Date.now());
  const start = moteStart(kort);
  const kanHaReferat = ferdig || (start ? start.getTime() < naa : false);
  const harForhaandsorientering =
    kort.forhaandsorientering && kort.forhaandsorientering.type !== "IKKE_SEND";
  const visVarslingsboks = erVeileder && !harForhaandsorientering;
  const refereratIkkeDelt = !!kort.referat && !kort.erReferatPublisert;

  return (
    <Modal
      open
      onClose={onClose}
      closeOnBackdropClick
      header={{ heading: kort.title }}
      width="680px"
    >
      <Modal.Body>
        <Heading level="2" size="xsmall" className="-mt-4 mb-6 font-normal">
          {KOLONNE_LABELS[kort.kolonne]} / Møte med Nav
        </Heading>

        <div className="space-y-8">
          {visVarslingsboks && (
            <Alert variant="warning">
              Brukeren får ikke automatisk beskjed om at aktiviteten er opprettet.
              <br />
              Send en dialogmelding slik at bruker får informasjon om møtet.
            </Alert>
          )}

          {kort.avsluttetKommentar && (
            <Alert variant="info">
              <BodyShort>{kort.avsluttetKommentar}</BodyShort>
            </Alert>
          )}

          <div className="space-y-8 mb-8">
            <div className="space-y-8 space-x-2">
              <BodyShort>{MOTE_INGRESS}</BodyShort>
              {kort.avtalt && (
                <Tag data-color="info" variant="strong" size="small">
                  Avtalt med Nav
                </Tag>
              )}
              {refereratIkkeDelt && (
                <Tag data-color="warning" variant="outline" size="small">
                  {erVeileder ? "Samtalereferatet er ikke delt" : "Samtalereferatet er ikke ferdig"}
                </Tag>
              )}
            </div>

            <AvtaltContainer kort={kort} erVeileder={erVeileder} ferdig={ferdig} oppdater={oppdater} />

            <div className="flex flex-row flex-wrap w-full gap-y-4">
              <DetaljFelt tittel="Dato">
                <BodyShort>{formaterDatoLang(kort.startDato)}</BodyShort>
              </DetaljFelt>
              <DetaljFelt tittel="Klokkeslett">
                <BodyShort>{kort.klokkeslett}</BodyShort>
              </DetaljFelt>
              <DetaljFelt tittel="Møteform">
                <BodyShort>{kort.moteform}</BodyShort>
              </DetaljFelt>
              <DetaljFelt tittel="Varighet">
                <BodyShort>{kort.varighetMinutter ? formatterVarighet(kort.varighetMinutter) : kort.varighet}</BodyShort>
              </DetaljFelt>
              <DetaljFelt tittel="Deltakere" fullbredde>
                <ul className="list-none p-0 m-0">
                  <li>
                    <BodyShort as="span">{brukerNavn}</BodyShort>
                  </li>
                  <li>
                    <BodyShort as="span">
                      {VEILEDER_NAVN} ({VEILEDER_TITTEL})
                    </BodyShort>
                  </li>
                  {(kort.deltakere ?? []).map((d, i) => (
                    <li key={i}>
                      <BodyShort as="span">
                        {d.navn} ({d.rolle})
                      </BodyShort>
                    </li>
                  ))}
                </ul>
              </DetaljFelt>
              {kort.moteSted && (
                <DetaljFelt tittel="Møtested eller annen praktisk informasjon" fullbredde>
                  <CustomBodyLong formatLinks formatLinebreaks>
                    {kort.moteSted}
                  </CustomBodyLong>
                </DetaljFelt>
              )}
              {kort.hensikt && (
                <DetaljFelt tittel="Hensikt med møtet" fullbredde>
                  <CustomBodyLong formatLinks formatLinebreaks>
                    {kort.hensikt}
                  </CustomBodyLong>
                </DetaljFelt>
              )}
              {kort.forberedelser && (
                <DetaljFelt tittel="Forberedelser til møtet" fullbredde>
                  <CustomBodyLong formatLinks formatLinebreaks>
                    {kort.forberedelser}
                  </CustomBodyLong>
                </DetaljFelt>
              )}
            </div>
          </div>
        </div>

        <div className="my-4 gap-4 flex flex-wrap">
          {erVeileder && !ferdig && (
            <Button variant="secondary" icon={<PencilIcon aria-hidden />} onClick={onEndre}>
              Endre på aktiviteten
            </Button>
          )}
          <Button variant="secondary" icon={<ChatElipsisIcon aria-hidden />}>
            Send en melding
          </Button>
        </div>

        {kanHaReferat && <ReferatContainer kort={kort} erVeileder={erVeileder} ferdig={ferdig} oppdater={oppdater} />}

        <Accordion className="mt-8">
          {erVeileder && (
            <Accordion.Item>
              <Accordion.Header>
                <div>
                  <Heading level="2" size="small" className="text-ax-text-neutral">
                    Hva er status på aktiviteten?
                  </Heading>
                  <BodyShort>{KOLONNE_LABELS[kort.kolonne]}</BodyShort>
                </div>
              </Accordion.Header>
              <Accordion.Content>
                <StatusForm kort={kort} oppdater={oppdater} />
              </Accordion.Content>
            </Accordion.Item>
          )}
          <Accordion.Item>
            <Accordion.Header>
              <Heading level="2" size="small" className="text-ax-text-neutral">
                Historikk
              </Heading>
            </Accordion.Header>
            <Accordion.Content>
              <section>
                {[...(kort.historikk ?? [])].reverse().map((h, i) => (
                  <div key={`${h.tidspunkt}-${i}`} className="pb-4">
                    <b>Veileder</b> {h.beskrivelse}
                    <BodyShort>{formaterTidspunkt(h.tidspunkt)}</BodyShort>
                  </div>
                ))}
              </section>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </Modal.Body>
    </Modal>
  );
}

interface DelProps {
  kort: AktivitetsKort;
  erVeileder: boolean;
  ferdig: boolean;
  oppdater: (endre: (k: AktivitetsKort) => AktivitetsKort) => void;
}

function AvtaltContainer({ kort, erVeileder, ferdig, oppdater }: DelProps) {
  if (kort.avtalt) {
    return kort.forhaandsorientering ? <ForhaandsorienteringVisning kort={kort} /> : null;
  }
  if (!erVeileder || ferdig) return null;
  return <AvtaltForm kort={kort} oppdater={oppdater} />;
}

function ForhaandsorienteringVisning({ kort }: { kort: AktivitetsKort }) {
  const fo = kort.forhaandsorientering!;
  const start = moteStart(kort);
  const mindreEnnSyvDager = start ? !erMerEnnSyvDagerTil(start) : false;
  let tekst: string;
  if (mindreEnnSyvDager) {
    tekst =
      'Aktiviteten er merket "Avtalt med Nav". Forhåndsorientering er ikke lagt til fordi sluttdatoen er færre enn 7 dager frem i tid. Du skal ha informert bruker om mulige konsekvenser for ytelse og dokumentert dette i et samtalereferat.';
  } else if (fo.type === "SEND_STANDARD") {
    tekst = "Forhåndsorientering (standard melding) er lagt til aktiviteten. Bruker får sms eller e-post.";
  } else if (fo.type === "SEND_PARAGRAF_11_9") {
    tekst = "Forhåndsorientering for §11-9 (AAP) er lagt til aktiviteten. Bruker får sms eller e-post.";
  } else {
    tekst = 'Aktiviteten er merket "Avtalt med Nav" og forhåndsorientering om konsekvens for ytelse er ikke lagt til aktiviteten.';
  }
  return (
    <div className="space-y-4">
      <Alert variant="success">{tekst}</Alert>
      {fo.tekst && (
        <ReadMore header="Informasjon om ansvaret ditt" defaultOpen>
          <CustomBodyLong formatLinebreaks>{fo.tekst}</CustomBodyLong>
        </ReadMore>
      )}
    </div>
  );
}

function AvtaltForm({ kort, oppdater }: Pick<DelProps, "kort" | "oppdater">) {
  const start = moteStart(kort);
  const mindreEnnSyvDagerTil = start ? !erMerEnnSyvDagerTil(start) : false;
  const kanSendeForhaandsvarsel = !mindreEnnSyvDagerTil;

  const [visSkjema, setVisSkjema] = useState(false);
  const [type, setType] = useState<ForhaandsorienteringType>(kanSendeForhaandsvarsel ? "SEND_STANDARD" : "IKKE_SEND");
  const [tekst119, setTekst119] = useState(AVTALT_TEKST_119);
  const [feil119, setFeil119] = useState<string>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "SEND_PARAGRAF_11_9" && !tekst119.trim()) {
      setFeil119("Tekst til brukeren er påkrevd");
      return;
    }
    const tekst = type === "SEND_STANDARD" ? AVTALT_TEKST : type === "SEND_PARAGRAF_11_9" ? tekst119 : "";
    const beskrivelse = "merket aktiviteten \"Avtalt med Nav\"";
    oppdater((k) => ({
      ...k,
      avtalt: true,
      tags: k.tags.includes("avtalt-med-nav") ? k.tags : [...k.tags, "avtalt-med-nav"],
      forhaandsorientering: { type, tekst },
      historikk: [...(k.historikk ?? []), lagHistorikkInnslag(beskrivelse)],
    }));
  };

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
      className="bg-ax-bg-brand-blue-soft py-2 px-4 my-4 border border-ax-border-brand-blue rounded-md"
    >
      <div className="flex items-center">
        <Checkbox checked={visSkjema} onChange={() => setVisSkjema(!visSkjema)}>
          Avtalt med Nav
        </Checkbox>
        <HelpText
          aria-label="Informasjon om avtalt med Nav"
          title="Informasjon om avtalt med Nav"
          className="ml-2 justify-self-start"
        >
          <div className="max-w-[300px]">
            Aktiviteter som oppfyller brukerens aktivitets- og medvirkningsplikt skal settes som &quot;Avtalt med Nav&quot;
          </div>
        </HelpText>
        <Detail className="text-right flex-grow">FOR NAV-ANSATT</Detail>
      </div>
      {visSkjema && (
        <div className="space-y-4 mb-4">
          {mindreEnnSyvDagerTil && (
            <Alert variant="warning">
              Du kan ikke legge til forhåndsorientering fordi sluttdatoen er færre enn 7 dager frem i tid. Hvis du har
              hatt muntlig dialog med brukeren om mulige konsekvenser for ytelse og dokumentert dette i et
              samtalereferat, så kan du sette aktiviteten til “Avtalt med Nav&quot;.
            </Alert>
          )}
          {kanSendeForhaandsvarsel && (
            <>
              <RadioGroup
                legend="Velg type forhåndsorientering"
                value={type}
                onChange={(v: ForhaandsorienteringType) => setType(v)}
                className="mt-4"
              >
                <Radio value="SEND_STANDARD">Forhåndsorientering (standard melding)</Radio>
                <Radio value="SEND_PARAGRAF_11_9">Forhåndsorientering for §11-9 (AAP)</Radio>
                <Radio value="IKKE_SEND">Ingen forhåndsorientering</Radio>
              </RadioGroup>
              {type === "SEND_STANDARD" && (
                <div>
                  <Label>Teksten som blir lagt til aktiviteten</Label>
                  <BodyShort>{AVTALT_TEKST}</BodyShort>
                  <VarslingInfo />
                </div>
              )}
              {type === "SEND_PARAGRAF_11_9" && (
                <div>
                  <Textarea
                    label="Teksten som blir lagt til aktiviteten"
                    maxLength={500}
                    value={tekst119}
                    onChange={(e) => setTekst119(e.target.value)}
                    error={feil119}
                  />
                  <VarslingInfo />
                </div>
              )}
            </>
          )}
          <Button type="submit">Legg til</Button>
        </div>
      )}
    </form>
  );
}

function VarslingInfo() {
  return (
    <div className="mt-8">
      <ReadMore header="Brukeren mottar sms eller e-post (se KRR) med en lenke til aktiviteten">
        På aktiviteten vil bruker se forhåndsorienteringen og en knapp for å bekrefte at en har lest. <br />
        <br />
        Hvis ikke brukeren leser beskjeden innen 7 dager, så blir de revarslet.
      </ReadMore>
    </div>
  );
}

function ReferatContainer({ kort, erVeileder, ferdig, oppdater }: DelProps) {
  const [redigerer, setRedigerer] = useState(false);
  const aktiv = !ferdig;
  const manglerReferat = erVeileder && !kort.referat && aktiv;

  if (manglerReferat || (redigerer && erVeileder)) {
    return <ReferatForm kort={kort} oppdater={oppdater} onFerdig={() => setRedigerer(false)} />;
  }

  if (!kort.referat || (!erVeileder && !kort.erReferatPublisert)) return null;

  const publiser = () =>
    oppdater((k) => ({
      ...k,
      erReferatPublisert: true,
      historikk: [...(k.historikk ?? []), lagHistorikkInnslag("delte referatet")],
    }));

  return (
    <section className="my-4 border-t border-ax-border-neutral pt-8">
      <Heading level="2" size="large" className="mb-4">
        Samtalereferat
      </Heading>
      <EkspanderbartTekstomrade tekst={kort.referat} antallTegn={275} />
      {erVeileder && !aktiv && !kort.erReferatPublisert && <Button onClick={publiser}>Del med bruker</Button>}
      {erVeileder && aktiv && (
        <div className="flex flex-col mt-8 space-y-4">
          {kort.erReferatPublisert && (
            <Alert variant="success" inline>
              Delt med bruker
            </Alert>
          )}
          <div className="flex gap-4">
            {!kort.erReferatPublisert && <Button onClick={publiser}>Del med bruker</Button>}
            <Button variant="secondary" onClick={() => setRedigerer(true)}>
              Endre referat
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function ReferatForm({
  kort,
  oppdater,
  onFerdig,
}: Pick<DelProps, "kort" | "oppdater"> & { onFerdig: () => void }) {
  const startTekst = kort.referat ?? HILSEN_TEKST;
  const [tekst, setTekst] = useState(startTekst);
  const [klarsprak, setKlarsprak] = useState(true);
  const publisert = !!kort.erReferatPublisert;
  const erEndret = tekst !== startTekst;

  const lagre = (publiser: boolean) => {
    const historikkTekster = [
      kort.referat ? "endret referat" : "opprettet referat",
      ...(publiser && !publisert ? ["delte referatet"] : []),
    ];
    oppdater((k) => ({
      ...k,
      referat: tekst,
      erReferatPublisert: publiser || k.erReferatPublisert,
      historikk: [...(k.historikk ?? []), ...historikkTekster.map(lagHistorikkInnslag)],
    }));
    onFerdig();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        lagre(publisert);
      }}
      className="space-y-4 bg-ax-bg-brand-blue-soft p-4 border border-ax-border-brand-blue rounded-md"
    >
      <Textarea
        label="Samtalereferat"
        maxLength={5000}
        placeholder="Skriv samtalereferatet her"
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
      />
      <Switch checked={klarsprak} onChange={() => setKlarsprak(!klarsprak)}>
        Klarspråkhjelpen
      </Switch>
      <div className="flex gap-4">
        {!publisert && (
          <Button type="button" onClick={() => lagre(true)}>
            Del med bruker
          </Button>
        )}
        <Button type="submit" variant={publisert ? "primary" : "secondary"} disabled={!erEndret}>
          {publisert ? "Del endring" : "Lagre utkast"}
        </Button>
        {kort.referat && (
          <Button type="button" variant="tertiary" onClick={onFerdig}>
            Avbryt
          </Button>
        )}
      </div>
    </form>
  );
}

function StatusForm({ kort, oppdater }: Pick<DelProps, "kort" | "oppdater">) {
  const ferdig = erFerdig(kort);
  const [valgt, setValgt] = useState<KolonneId>(kort.kolonne);
  const [begrunnelse, setBegrunnelse] = useState("");
  const [feil, setFeil] = useState<{ status?: string; begrunnelse?: string }>({});

  const ferdigStatus = valgt === "fullfort" || valgt === "avbrutt";
  const krevBegrunnelse = valgt === "avbrutt";
  const begrunnelseLabel =
    valgt === "fullfort"
      ? "Skriv en kort kommentar om hvordan det har gått med aktiviteten, eller noe Nav bør kjenne til."
      : "Skriv en kort begrunnelse om hvorfor du avbryter aktiviteten.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valgt === kort.kolonne) return;

    const nyeFeil: typeof feil = {};
    // Samme regel som manglerPubliseringAvSamtaleReferat i prod: avbrutt er unntatt.
    if (valgt === "fullfort" && !kort.erReferatPublisert) {
      nyeFeil.status = "Samtalereferatet må deles før du kan sette aktiviteten til denne statusen";
    }
    if (krevBegrunnelse && !begrunnelse.trim()) nyeFeil.begrunnelse = "Du må fylle ut en begrunnelse";
    setFeil(nyeFeil);
    if (Object.keys(nyeFeil).length > 0) return;

    oppdater((k) => ({
      ...k,
      kolonne: valgt,
      avsluttetKommentar: ferdigStatus && begrunnelse.trim() ? begrunnelse.trim() : k.avsluttetKommentar,
      historikk: [
        ...(k.historikk ?? []),
        lagHistorikkInnslag(`flyttet aktiviteten fra ${KOLONNE_LABELS[k.kolonne]} til ${KOLONNE_LABELS[valgt]}`),
      ],
    }));
  };

  if (ferdig) {
    return <BodyShort>Aktiviteten er låst fordi den er {KOLONNE_LABELS[kort.kolonne].toLowerCase()}.</BodyShort>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <RadioGroup
        legend="Hva er status på aktiviteten?"
        hideLegend
        value={valgt}
        onChange={(v: KolonneId) => {
          setValgt(v);
          setFeil({});
        }}
        error={feil.status}
      >
        {STATUS_REKKEFOLGE.map((s) => (
          <Radio key={s} value={s}>
            {KOLONNE_LABELS[s]}
          </Radio>
        ))}
      </RadioGroup>
      {ferdigStatus && (
        <>
          <Alert variant="warning">
            Hvis du endrer til &quot;Fullført&quot; eller &quot;Avbrutt&quot;, blir aktiviteten låst og du kan ikke lenger
            endre innholdet.
          </Alert>
          <Textarea
            label={begrunnelseLabel}
            maxLength={255}
            value={begrunnelse}
            onChange={(e) => setBegrunnelse(e.target.value)}
            error={feil.begrunnelse}
          />
        </>
      )}
      <Button type="submit">Lagre</Button>
    </form>
  );
}
