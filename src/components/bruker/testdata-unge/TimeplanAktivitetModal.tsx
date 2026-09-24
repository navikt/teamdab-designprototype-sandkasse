"use client";

import { Heading, Modal } from "@navikt/ds-react";
import { DetaljFelt } from "../../aktivitetsplan/shared/DetaljFelt";
import { TimeplanAktivitet } from "./timeplanTestdata";

const UKEDAG_NAVN: Record<number, string> = {
  1: "Mandag",
  2: "Tirsdag",
  3: "Onsdag",
  4: "Torsdag",
  5: "Fredag",
};

function dagTekst(aktivitet: TimeplanAktivitet): string {
  if (aktivitet.ukedagFra === aktivitet.ukedagTil) return UKEDAG_NAVN[aktivitet.ukedagFra];
  return `${UKEDAG_NAVN[aktivitet.ukedagFra]}\u2013${UKEDAG_NAVN[aktivitet.ukedagTil]}`;
}

function klokkeslettTekst(time: number): string {
  return `${time.toString().padStart(2, "0")}:00`;
}

interface Props {
  aktivitet: TimeplanAktivitet;
  onClose: () => void;
}

export function TimeplanAktivitetModal({ aktivitet, onClose }: Props) {
  return (
    <Modal open onClose={onClose} closeOnBackdropClick aria-labelledby="timeplan-aktivitet-heading" className="lg:w-120">
      <Modal.Header closeButton>
        <Heading id="timeplan-aktivitet-heading" size="large">{aktivitet.tittel}</Heading>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-row flex-wrap gap-y-4">
          <DetaljFelt tittel="Dag">{dagTekst(aktivitet)}</DetaljFelt>
          <DetaljFelt tittel="Klokkeslett">{`kl. ${klokkeslettTekst(aktivitet.timeFra)}\u2013${klokkeslettTekst(aktivitet.timeTil)}`}</DetaljFelt>
          {aktivitet.sted && <DetaljFelt tittel="Sted">{aktivitet.sted}</DetaljFelt>}
          {aktivitet.beskrivelse && <DetaljFelt tittel="Om aktiviteten" fullbredde>{aktivitet.beskrivelse}</DetaljFelt>}
        </div>
      </Modal.Body>
    </Modal>
  );
}
