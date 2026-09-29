"use client";

import { useState } from "react";
import { ChatElipsisIcon, PencilIcon } from "@navikt/aksel-icons";
import { Button, Checkbox, Heading, Link, Modal, Select } from "@navikt/ds-react";
import { AktivitetsKort, AktivitetStatus, DELMAL_KOLONNER } from "../types";
import { getDatoLinjer } from "../datoVisning";
import { DetaljFelt } from "../shared/DetaljFelt";
import { CustomBodyLong } from "../shared/CustomBodyLong";
import { RedigerAktivitetModal } from "./RedigerAktivitetModal";

interface Props {
  kort: AktivitetsKort;
  onClose: () => void;
  erDelmal?: boolean;
  onEndreDelmal?: (erDelmal: boolean) => void;
  status?: AktivitetStatus;
  onEndreStatus?: (status: AktivitetStatus) => void;
  onOppdater?: (oppdatertKort: AktivitetsKort) => void;
  // Kontrollert utenfra (URL) når tilgjengelig, ellers styrt internt.
  redigerModus?: boolean;
  onEndreRedigerModus?: (redigerModus: boolean) => void;
}

const SOKNADSSTATUS_LABEL: Record<string, string> = {
  "venter-pa-kontakt": "Venter på å bli kontaktet",
  "skal-pa-intervju": "Skal på intervju",
  "fatt-jobbtilbud": "Fått jobbtilbud",
  "ikke-fatt-jobben": "Ikke fått jobben",
};

// Forkortet visningstekst for lenker, samme mønster som DetaljvisningLenke i aktivitetsplan-repoet.
function kortLenketekst(lenke: string): string {
  try {
    const url = new URL(lenke.startsWith("http") ? lenke : `http://${lenke}`);
    const segmenter = url.pathname.split("/").filter(Boolean);
    return segmenter.length > 0 ? `${url.hostname}/${segmenter[0]}` : url.hostname;
  } catch {
    return lenke;
  }
}

function fullLenke(lenke: string): string {
  return lenke.startsWith("http") ? lenke : `http://${lenke}`;
}

export function AktivitetDetaljerModal({
  kort,
  onClose,
  erDelmal,
  onEndreDelmal,
  status,
  onEndreStatus,
  onOppdater,
  redigerModus: redigerModusProp,
  onEndreRedigerModus,
}: Props) {
  const [redigerApenInternt, setRedigerApenInternt] = useState(false);
  const redigerApen = redigerModusProp ?? redigerApenInternt;
  const settRedigerApen = onEndreRedigerModus ?? setRedigerApenInternt;

  if (redigerApen && onOppdater) {
    return (
      <RedigerAktivitetModal
        kort={kort}
        onLagre={(oppdatertKort) => {
          onOppdater(oppdatertKort);
          settRedigerApen(false);
        }}
        onClose={() => settRedigerApen(false)}
      />
    );
  }

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
          {onEndreStatus && status && (
            <Select
              label="Status"
              value={status}
              onChange={(e) => onEndreStatus(e.target.value as AktivitetStatus)}
            >
              <option value="aktiv">Aktiv</option>
              <option value="fullfort">Fullført</option>
              <option value="avbrutt">Avbrutt</option>
            </Select>
          )}
          <div className="flex flex-row flex-wrap gap-y-4">
            {getDatoLinjer(kort).map((linje) => (
              <DetaljFelt key={linje.label} tittel={linje.label}>{linje.verdi}</DetaljFelt>
            ))}
            {kort.frist && kort.type !== "Stilling" && kort.type !== "Stilling fra Nav" && (
              <DetaljFelt tittel="Frist">{kort.frist}</DetaljFelt>
            )}
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
            {kort.beskrivelse && (
              <DetaljFelt tittel="Beskrivelse" fullbredde>
                <CustomBodyLong formatLinks formatLinebreaks>{kort.beskrivelse}</CustomBodyLong>
              </DetaljFelt>
            )}
            {kort.lenke && (
              <DetaljFelt tittel="Lenke" fullbredde>
                <Link target="_blank" href={fullLenke(kort.lenke)} className="block">
                  {kortLenketekst(kort.lenke)} (åpnes i ny fane)
                </Link>
              </DetaljFelt>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            {onOppdater && (
              <Button variant="secondary" icon={<PencilIcon aria-hidden />} onClick={() => settRedigerApen(true)}>
                Endre på aktiviteten
              </Button>
            )}
            <Button variant="secondary" icon={<ChatElipsisIcon aria-hidden />}>
              Send en melding
            </Button>
          </div>

          {onEndreDelmal && DELMAL_KOLONNER.includes(kort.kolonne) && (
            <Checkbox checked={erDelmal ?? false} onChange={(e) => onEndreDelmal(e.target.checked)}>
              Gjør dette til et delmål
            </Checkbox>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
