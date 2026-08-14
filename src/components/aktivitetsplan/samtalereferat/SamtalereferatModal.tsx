"use client";

import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { Accordion, Alert, BodyShort, Button, Heading, Link, LocalAlert, Modal } from "@navikt/ds-react";
import { useState } from "react";
import { AktivitetsKort, Perspektiv } from "../types";
import { DetaljFelt } from "../shared/DetaljFelt";
import { EkspanderbartTekstomrade } from "../shared/EkspanderbartTekstomrade";

type Visning = "hoved" | "tidligereVersjon";

interface Props {
  kort: AktivitetsKort;
  perspektiv: Perspektiv;
  onClose: () => void;
}

export function SamtalereferatModal({ kort, perspektiv, onClose }: Props) {
  const data = kort.samtalereferatData!;
  const erVeileder = perspektiv === "veileder";
  const [visning, setVisning] = useState<Visning>("hoved");

  const erTidligereVersjon = visning === "tidligereVersjon";

  return (
    <Modal open onClose={onClose} closeOnBackdropClick aria-labelledby="samtalereferat-heading" className="lg:w-120">
      <Modal.Header closeButton>
        <div>
          {erTidligereVersjon && (
            <button
              onClick={() => setVisning("hoved")}
              className="flex items-center gap-1 text-ax-text-accent-subtle underline hover:no-underline text-sm bg-transparent border-0 cursor-pointer p-0"
            >
              <ArrowLeftIcon aria-hidden />
              Tilbake
            </button>
          )}
          <div className={`space-y-1 ${erTidligereVersjon ? "mt-6" : ""}`}>
          {erTidligereVersjon && (
            <BodyShort className="text-ax-text-subtle">27. juli 2026 kl. 13.46</BodyShort>
          )}
          <Heading id="samtalereferat-heading" size="large">
            {erTidligereVersjon ? "Samtalereferat" : kort.title}
          </Heading>
          {!erTidligereVersjon && (
          <Heading level="2" size="xsmall" className="text-ax-text-neutral font-normal">
            Gjennomført / Samtalereferat
          </Heading>
          )}
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        {erTidligereVersjon ? (
          <TidligereVersjonVisning referatTekst={data.referatTekst} erVeileder={erVeileder} onTilbake={() => setVisning("hoved")} />
        ) : (
        <HovedVisning
          data={data}
          erVeileder={erVeileder}
          onVisVersjon={() => setVisning("tidligereVersjon")}
        />
        )}
      </Modal.Body>
    </Modal>
  );
}

interface HovedVisningProps {
  data: NonNullable<AktivitetsKort["samtalereferatData"]>;
  erVeileder: boolean;
  onVisVersjon: () => void;
}

function HovedVisning({ data, erVeileder, onVisVersjon }: HovedVisningProps) {
  return (
    <div className="flex flex-col max-w-2xl mx-auto">
      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex flex-row flex-wrap w-full gap-y-4">
            <DetaljFelt tittel="Dato">
              <BodyShort>{data.dato}</BodyShort>
            </DetaljFelt>
            <DetaljFelt tittel="Møteform">
              <BodyShort>{data.moteform}</BodyShort>
            </DetaljFelt>
          </div>
        </section>

        <div className="flex gap-4">
          <Button variant="secondary">Send en melding</Button>
          {erVeileder && <Button variant="secondary">Endre referat</Button>}
        </div>

        {(erVeileder || data.erReferatPublisert) && (
          <section className="my-4 border-t border-ax-border-neutral pt-8">
            <Heading level="2" size="large" className="mb-4">
              Samtalereferat
            </Heading>
            <EkspanderbartTekstomrade tekst={data.referatTekst} antallTegn={275} />
            {!erVeileder && data.erReferatPublisert && (
              <div className="mt-8">
                <BodyShort weight="semibold">Det finnes tidligere versjoner av dette referatet</BodyShort>
                <Link as="button" onClick={onVisVersjon} className="cursor-pointer">
                  Versjon 1: 27. juli 2026 kl. 13.46
                </Link>
              </div>
            )}
            {erVeileder && (
              <div className="flex flex-col mt-8 space-y-4">
                {data.erReferatPublisert && (
                  <Alert variant="success" inline>
                    Delt med bruker
                  </Alert>
                )}
                <div className="flex gap-4">
                  <Button variant="secondary">Endre referat</Button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <Accordion className="mt-8">
        {erVeileder && (
          <Accordion.Item>
            <Accordion.Header>
              <Heading level="2" size="small" className="flex text-ax-text-neutral">
                Hva er status på aktiviteten?
              </Heading>
            </Accordion.Header>
            <Accordion.Content>{null}</Accordion.Content>
          </Accordion.Item>
        )}
        <Accordion.Item>
          <Accordion.Header>
            <Heading level="2" size="small" className="flex text-ax-text-neutral">
              Historikk
            </Heading>
          </Accordion.Header>
          <Accordion.Content>
            <section>
              <div className="pb-4">
                <b>Veileder</b> endret referatet (Gjeldende versjon)
                <BodyShort>28. juli 2026 kl. 13.55</BodyShort>
              </div>
              <div className="pb-4">
                <b>Veileder</b> {erVeileder ? "delte referatet med bruker" : "delte referatet med deg"}
                <BodyShort>28. juli 2026 kl. 13.50</BodyShort>
              </div>
              <div className="pb-4">
                <b>Veileder</b> opprettet aktiviteten
                <BodyShort>27. juli 2026 kl. 13.46</BodyShort>
                <Link as="button" onClick={onVisVersjon} className="cursor-pointer">
                  Se tidligere versjon av referatet
                </Link>
              </div>
            </section>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

function TidligereVersjonVisning({ referatTekst, erVeileder: _erVeileder, onTilbake }: { referatTekst: string; erVeileder: boolean; onTilbake: () => void }) {
  const versjon1Tekst = referatTekst
    .replace("Motivert", "Motivert motivert")
    .replace("søknad", "søkand");

  return (
    <div className="flex flex-col max-w-2xl mx-auto space-y-4">
      <EkspanderbartTekstomrade tekst={versjon1Tekst} antallTegn={275} />
      <LocalAlert status="warning" size="small">
        <LocalAlert.Header>
          <LocalAlert.Title>Du ser på en tidligere versjon av referatet</LocalAlert.Title>
        </LocalAlert.Header>
        <LocalAlert.Content>
          <div className="pb-2">
            <b>Veileder</b> endret referatet
            <BodyShort>28. juli 2026 kl. 13.35</BodyShort>
          </div>
          <Link as="button" onClick={onTilbake} className="cursor-pointer">
            Gå til gjeldende versjon
          </Link>
        </LocalAlert.Content>
      </LocalAlert>
    </div>
  );
}

