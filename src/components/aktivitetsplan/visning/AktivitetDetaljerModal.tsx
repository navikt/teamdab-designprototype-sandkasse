"use client";

import { BodyLong, Heading, Link, Modal } from "@navikt/ds-react";
import { AktivitetsKort } from "../types";
import { DetaljFelt } from "../shared/DetaljFelt";

interface Props {
  kort: AktivitetsKort;
  onClose: () => void;
}

const SOKNADSSTATUS_LABEL: Record<string, string> = {
  "venter-pa-kontakt": "Venter på å bli kontaktet",
  "skal-pa-intervju": "Skal på intervju",
  "fatt-jobbtilbud": "Fått jobbtilbud",
  "ikke-fatt-jobben": "Ikke fått jobben",
};

export function AktivitetDetaljerModal({ kort, onClose }: Props) {
  return (
    <Modal open onClose={onClose} closeOnBackdropClick aria-labelledby="aktivitet-detaljer-heading" className="lg:w-120">
      <Modal.Header closeButton>
        <div className="space-y-1">
          <Heading id="aktivitet-detaljer-heading" size="large">{kort.title}</Heading>
          <Heading level="2" size="xsmall" className="text-ax-text-neutral font-normal">{kort.type}</Heading>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-6">
          <div className="flex flex-row flex-wrap gap-y-4">
            {kort.dateRange && <DetaljFelt tittel="Dato">{kort.dateRange}</DetaljFelt>}
            {kort.frist && <DetaljFelt tittel="Frist">{kort.frist}</DetaljFelt>}
            {kort.arbeidsgiver && <DetaljFelt tittel="Arbeidsgiver">{kort.arbeidsgiver}</DetaljFelt>}
            {kort.arbeidssted && <DetaljFelt tittel="Arbeidssted">{kort.arbeidssted}</DetaljFelt>}
            {kort.kontaktperson && <DetaljFelt tittel="Kontaktperson">{kort.kontaktperson}</DetaljFelt>}
            {kort.stillingsandel && <DetaljFelt tittel="Stillingsandel">{kort.stillingsandel}</DetaljFelt>}
            {kort.ansettelsesforhold && <DetaljFelt tittel="Ansettelsesforhold">{kort.ansettelsesforhold}</DetaljFelt>}
            {kort.mal && <DetaljFelt tittel="Mål med aktiviteten">{kort.mal}</DetaljFelt>}
            {kort.huskeliste && <DetaljFelt tittel="Min huskeliste">{kort.huskeliste}</DetaljFelt>}
            {kort.soknadsstatus && (
              <DetaljFelt tittel="Hvor er du i søknadsprosessen?">
                {SOKNADSSTATUS_LABEL[kort.soknadsstatus] ?? kort.soknadsstatus}
              </DetaljFelt>
            )}
            {kort.moteform && <DetaljFelt tittel="Møteform">{kort.moteform}</DetaljFelt>}
            {kort.varighet && <DetaljFelt tittel="Varighet">{kort.varighet}</DetaljFelt>}
            {kort.hensikt && <DetaljFelt tittel="Hensikt med møtet" fullbredde>{kort.hensikt}</DetaljFelt>}
            {kort.forberedelser && <DetaljFelt tittel="Forberedelser" fullbredde>{kort.forberedelser}</DetaljFelt>}
            {kort.arrangor && <DetaljFelt tittel="Arrangør">{kort.arrangor}</DetaljFelt>}
            {kort.deltakelseProsent && <DetaljFelt tittel="Deltakelse">{kort.deltakelseProsent}</DetaljFelt>}
            {kort.dagerPerUke && <DetaljFelt tittel="Dager per uke">{kort.dagerPerUke}</DetaljFelt>}
            {kort.behandlingstype && <DetaljFelt tittel="Behandlingstype">{kort.behandlingstype}</DetaljFelt>}
            {kort.behandlingssted && <DetaljFelt tittel="Behandlingssted">{kort.behandlingssted}</DetaljFelt>}
            {kort.oppfolgingFraNav && <DetaljFelt tittel="Oppfølging fra Nav" fullbredde>{kort.oppfolgingFraNav}</DetaljFelt>}
            {kort.detaljRader?.map((rad) => (
              <DetaljFelt key={rad.label} tittel={rad.label}>{rad.verdi}</DetaljFelt>
            ))}
          </div>

          {kort.beskrivelse && (
            <DetaljFelt tittel="Beskrivelse" fullbredde>
              <BodyLong>{kort.beskrivelse}</BodyLong>
            </DetaljFelt>
          )}

          {kort.lenke && (
            <Link href={kort.lenke} target="_blank" rel="noopener noreferrer">
              Les mer
            </Link>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
