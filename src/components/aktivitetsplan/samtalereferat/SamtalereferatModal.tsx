"use client";

import { Accordion, Alert, BodyShort, Button, Heading, Modal } from "@navikt/ds-react";
import { AktivitetsKort, Perspektiv } from "../types";
import { DetaljFelt } from "../shared/DetaljFelt";
import { EkspanderbartTekstomrade } from "../shared/EkspanderbartTekstomrade";

interface Props {
  kort: AktivitetsKort;
  perspektiv: Perspektiv;
  onClose: () => void;
}

export function SamtalereferatModal({ kort, perspektiv, onClose }: Props) {
  const data = kort.samtalereferatData!;
  const erVeileder = perspektiv === "veileder";

  return (
    <Modal open onClose={onClose} closeOnBackdropClick aria-labelledby="samtalereferat-heading" className="lg:w-120">
      <Modal.Header closeButton>
        <div className="space-y-1">
          <Heading id="samtalereferat-heading" size="large">
            {kort.title}
          </Heading>
          <Heading level="2" size="xsmall" className="text-ax-text-neutral font-normal">
            Gjennomført / Samtalereferat
          </Heading>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col max-w-2xl mx-auto">
          <div className="space-y-8">
            {/* Detaljer */}
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

            {/* Handlingsrad */}
            <div className="flex gap-4">
              <Button variant="secondary">Send en melding</Button>
              {erVeileder && <Button variant="secondary">Endre referat</Button>}
            </div>

            {/* Samtalereferat-seksjon — kun synlig for bruker hvis publisert */}
            {(erVeileder || data.erReferatPublisert) && (
            <section className="my-4 border-t border-ax-border-neutral pt-8">
              <Heading level="2" size="large" className="mb-4">
                Samtalereferat
              </Heading>
              <EkspanderbartTekstomrade tekst={data.referatTekst} antallTegn={275} />
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

          {/* Accordion — «Hva er status» kun for veileder */}
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
                    <b>Veileder</b> {erVeileder ? "endret referatet" : "delte referatet med deg"}
                    <BodyShort>28. juli 2026 kl. 13.35</BodyShort>
                  </div>
                  <div className="pb-4">
                    <b>Veileder</b> opprettet aktiviteten
                    <BodyShort>27. juli 2026 kl. 13.46</BodyShort>
                  </div>
                </section>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </div>
      </Modal.Body>
    </Modal>
  );
}

