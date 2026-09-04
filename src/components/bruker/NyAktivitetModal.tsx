"use client";

import { useState } from "react";
import { Button, Checkbox, Modal, TextField } from "@navikt/ds-react";
import { AktivitetsKort, KolonneId } from "../aktivitetsplan/types";

export type NyAktivitetType = "Stilling" | "Jobb jeg har nå" | "Jobbrettet egenaktivitet" | "Behandling";

const KOLONNE_FOR_TYPE: Record<NyAktivitetType, KolonneId> = {
  Stilling: "planlegger",
  "Jobb jeg har nå": "gjennomforer",
  "Jobbrettet egenaktivitet": "planlegger",
  Behandling: "gjennomforer",
};

interface NyAktivitetModalProps {
  type: NyAktivitetType;
  onOpprett: (kort: AktivitetsKort, gjorTilDelmal: boolean) => void;
  onClose: () => void;
}

export function NyAktivitetModal({ type, onOpprett, onClose }: NyAktivitetModalProps) {
  const [tittel, setTittel] = useState("");
  const [tidspunkt, setTidspunkt] = useState("");
  const [erDelmal, setErDelmal] = useState(false);
  const [feilmelding, setFeilmelding] = useState<string | undefined>(undefined);

  const opprett = () => {
    const trimmet = tittel.trim();
    if (!trimmet) {
      setFeilmelding("Du må fylle inn en tittel.");
      return;
    }
    onOpprett(
      {
        id: crypto.randomUUID(),
        kolonne: KOLONNE_FOR_TYPE[type],
        type,
        title: trimmet,
        dateRange: tidspunkt.trim() || undefined,
        tags: [],
      },
      erDelmal
    );
    onClose();
  };

  return (
    <Modal open onClose={onClose} header={{ heading: `Legg til: ${type}` }} width="small">
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <TextField
            label="Tittel"
            value={tittel}
            onChange={(e) => {
              setTittel(e.target.value);
              setFeilmelding(undefined);
            }}
            error={feilmelding}
          />
          <TextField
            label="Tidspunkt eller periode"
            description="Valgfritt, f.eks. «20. sep 2026» eller «1. sep – 30. nov 2026»."
            value={tidspunkt}
            onChange={(e) => setTidspunkt(e.target.value)}
          />
          <Checkbox checked={erDelmal} onChange={(e) => setErDelmal(e.target.checked)}>
            Gjør dette til et delmål
          </Checkbox>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={opprett}>Legg til</Button>
        <Button variant="secondary" onClick={onClose}>Avbryt</Button>
      </Modal.Footer>
    </Modal>
  );
}
