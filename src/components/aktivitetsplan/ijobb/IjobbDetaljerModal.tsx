"use client";

import { ChatElipsisIcon, PencilIcon } from "@navikt/aksel-icons";
import { Accordion, Alert, BodyShort, Button, Heading, Modal, Tag } from "@navikt/ds-react";
import { Dispatch, SetStateAction } from "react";
import { AktivitetsKort, KOLONNE_LABELS, Perspektiv } from "../types";
import { CustomBodyLong } from "../shared/CustomBodyLong";
import { DetaljFelt } from "../shared/DetaljFelt";
import { AvtaltContainer, StatusForm } from "../mote/MoteDetaljerModal";
import { erFerdig, formaterDatoLang, formaterTidspunkt } from "../mote/moteUtils";
import { IJOBB_TYPE } from "./ijobbUtils";

interface Props {
  kort: AktivitetsKort;
  perspektiv: Perspektiv;
  setKort: Dispatch<SetStateAction<AktivitetsKort[]>>;
  onEndre: () => void;
  onClose: () => void;
}

export function IjobbDetaljerModal({ kort, perspektiv, setKort, onEndre, onClose }: Props) {
  const erVeileder = perspektiv === "veileder";
  const ferdig = erFerdig(kort);
  const oppdater = (endre: (k: AktivitetsKort) => AktivitetsKort) =>
    setKort((prev) => prev.map((k) => (k.id === kort.id ? endre(k) : k)));

  return (
    <Modal
      open
      onClose={onClose}
      closeOnBackdropClick
      aria-labelledby="modal-heading"
      className="min-[992px]:w-[40rem]"
    >
      <Modal.Header closeButton>
        <Heading id="modal-heading" size="large">
          {kort.title}
        </Heading>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col max-w-2xl mx-auto">
          <Heading level="2" size="xsmall">
            {KOLONNE_LABELS[kort.kolonne]} / {IJOBB_TYPE}
          </Heading>

          <div className="space-y-8">
            {kort.avsluttetKommentar && (
              <Alert variant="info">
                <BodyShort>{kort.avsluttetKommentar}</BodyShort>
              </Alert>
            )}

            <div className="space-y-8 mb-8">
              <div className="space-y-8 space-x-2">
                {kort.avtalt && (
                  <Tag data-color="info" variant="strong" size="small">
                    Avtalt med Nav
                  </Tag>
                )}
              </div>

              <AvtaltContainer kort={kort} erVeileder={erVeileder} ferdig={ferdig} oppdater={oppdater} />

              <div className="flex flex-row flex-wrap w-full gap-y-4">
                <DetaljFelt tittel="Fra dato">
                  <BodyShort>{formaterDatoLang(kort.startDato) ?? "Dato ikke satt"}</BodyShort>
                </DetaljFelt>
                <DetaljFelt tittel="Til dato">
                  <BodyShort>{formaterDatoLang(kort.sluttDato) ?? "Dato ikke satt"}</BodyShort>
                </DetaljFelt>
                {kort.stillingsandel && (
                  <DetaljFelt tittel="Stillingsandel">
                    <BodyShort>{kort.stillingsandel}</BodyShort>
                  </DetaljFelt>
                )}
                {kort.arbeidsgiver && (
                  <DetaljFelt tittel="Arbeidsgiver">
                    <BodyShort>{kort.arbeidsgiver}</BodyShort>
                  </DetaljFelt>
                )}
                {kort.ansettelsesforhold && (
                  <DetaljFelt tittel="Ansettelsesforhold">
                    <BodyShort>{kort.ansettelsesforhold}</BodyShort>
                  </DetaljFelt>
                )}
                {kort.beskrivelse && (
                  <DetaljFelt tittel="Beskrivelse" fullbredde>
                    <CustomBodyLong formatLinks formatLinebreaks>
                      {kort.beskrivelse}
                    </CustomBodyLong>
                  </DetaljFelt>
                )}
              </div>
            </div>
          </div>

          <div className="my-4 gap-4 flex flex-wrap">
            {!ferdig && (
              <Button variant="secondary" icon={<PencilIcon aria-hidden />} onClick={onEndre}>
                Endre på aktiviteten
              </Button>
            )}
            <Button variant="secondary" icon={<ChatElipsisIcon aria-hidden />}>
              Send en melding
            </Button>
          </div>

          <Accordion>
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
                      <b>{erVeileder ? "Veileder" : "Nav"}</b> {h.beskrivelse}
                      <BodyShort>{formaterTidspunkt(h.tidspunkt)}</BodyShort>
                    </div>
                  ))}
                </section>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </div>
      </Modal.Body>
    </Modal>
  );
}
