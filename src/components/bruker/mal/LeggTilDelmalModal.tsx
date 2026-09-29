"use client";

import { useState } from "react";
import { Button, Modal, UNSAFE_Combobox } from "@navikt/ds-react";
import { AktivitetsKort } from "../../aktivitetsplan/types";
import { MINE_AKTIVITETER_KOLONNER } from "../sortering";

interface LeggTilDelmalModalProps {
  aktiviteter: AktivitetsKort[];
  erAktivitetDelmal: (aktivitetId: string) => boolean;
  onLeggTilFraAktivitet: (aktivitetId: string) => void;
  onLeggTilFritekst: (tekst: string) => void;
  onClose: () => void;
}

export function LeggTilDelmalModal({
  aktiviteter,
  erAktivitetDelmal,
  onLeggTilFraAktivitet,
  onLeggTilFritekst,
  onClose,
}: LeggTilDelmalModalProps) {
  const [valgt, setValgt] = useState("");
  const [feilmelding, setFeilmelding] = useState<string | undefined>(undefined);

  // Kun aktive aktiviteter kan foresl\u00e5s som delm\u00e5l, ikke arkiverte (fullf\u00f8rt/avbrutt).
  const kandidater = aktiviteter.filter(
    (k) => MINE_AKTIVITETER_KOLONNER.includes(k.kolonne) && !erAktivitetDelmal(k.id)
  );
  const options = kandidater.map((k) => k.title);

  const leggTil = () => {
    const trimmet = valgt.trim();
    if (!trimmet) {
      setFeilmelding("Du må velge eller skrive inn en tittel.");
      return;
    }
    const treff = kandidater.find((k) => k.title.toLowerCase() === trimmet.toLowerCase());
    if (treff) {
      onLeggTilFraAktivitet(treff.id);
    } else {
      onLeggTilFritekst(trimmet);
    }
    onClose();
  };

  return (
    <Modal open onClose={onClose} header={{ heading: "Legg til delmål" }} width="small">
      <Modal.Body>
        <UNSAFE_Combobox
          label="Tittel på delmål"
          description="Velg en av dine aktiviteter, eller skriv inn et nytt delmål."
          options={options}
          shouldAutocomplete
          allowNewValues
          error={feilmelding}
          onToggleSelected={(option, isSelected) => {
            setValgt(isSelected ? option : "");
            setFeilmelding(undefined);
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={leggTil}>Legg til</Button>
        <Button variant="secondary" onClick={onClose}>Avbryt</Button>
      </Modal.Footer>
    </Modal>
  );
}

