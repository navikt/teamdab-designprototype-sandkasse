"use client";

import { useState } from "react";
import { Button, Modal, TextField, Textarea } from "@navikt/ds-react";
import { AktivitetsKort } from "../types";

interface Props {
  kort: AktivitetsKort;
  onLagre: (oppdatertKort: AktivitetsKort) => void;
  onClose: () => void;
}

export function RedigerAktivitetModal({ kort, onLagre, onClose }: Props) {
  const [tittel, setTittel] = useState(kort.title);
  const [startDato, setStartDato] = useState(kort.startDato ?? "");
  const [sluttDato, setSluttDato] = useState(kort.sluttDato ?? "");
  const [klokkeslett, setKlokkeslett] = useState(kort.klokkeslett ?? "");
  const [frist, setFrist] = useState(kort.frist ?? "");
  const [mal, setMal] = useState(kort.mal ?? "");
  const [huskeliste, setHuskeliste] = useState(kort.huskeliste ?? "");
  const [beskrivelse, setBeskrivelse] = useState(kort.beskrivelse ?? "");
  const [lenke, setLenke] = useState(kort.lenke ?? "");

  const erMoteMedNav = kort.type === "Møte med Nav";
  const erStillingFraNav = kort.type === "Stilling fra Nav";
  const erStilling = kort.type === "Stilling";

  const lagre = () => {
    onLagre({
      ...kort,
      title: tittel.trim() || kort.title,
      startDato: startDato.trim() || undefined,
      sluttDato: sluttDato.trim() || undefined,
      klokkeslett: klokkeslett.trim() || undefined,
      frist: frist.trim() || undefined,
      mal: mal.trim() || undefined,
      huskeliste: huskeliste.trim() || undefined,
      beskrivelse: beskrivelse.trim() || undefined,
      lenke: lenke.trim() || undefined,
    });
  };

  return (
    <Modal open onClose={onClose} closeOnBackdropClick header={{ heading: "Endre på aktiviteten" }} width="medium">
      <Modal.Body className="flex flex-col gap-4">
        <TextField label="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} />

        {erMoteMedNav ? (
          <div className="flex gap-4">
            <TextField
              label="Dato"
              description="Format: ÅÅÅÅ-MM-DD"
              value={startDato}
              onChange={(e) => setStartDato(e.target.value)}
            />
            <TextField label="Klokkeslett" type="time" value={klokkeslett} onChange={(e) => setKlokkeslett(e.target.value)} />
          </div>
        ) : erStillingFraNav ? (
          <TextField label="Frist" value={frist} onChange={(e) => setFrist(e.target.value)} />
        ) : erStilling ? (
          <div className="flex gap-4">
            <TextField
              label="Fra"
              description="Format: ÅÅÅÅ-MM-DD"
              value={startDato}
              onChange={(e) => setStartDato(e.target.value)}
            />
            <TextField label="Frist" value={frist} onChange={(e) => setFrist(e.target.value)} />
          </div>
        ) : (
          <div className="flex gap-4">
            <TextField
              label="Fra"
              description="Format: ÅÅÅÅ-MM-DD"
              value={startDato}
              onChange={(e) => setStartDato(e.target.value)}
            />
            <TextField
              label="Til"
              description="Format: ÅÅÅÅ-MM-DD"
              value={sluttDato}
              onChange={(e) => setSluttDato(e.target.value)}
            />
          </div>
        )}

        <Textarea label="Mål med aktiviteten" value={mal} onChange={(e) => setMal(e.target.value)} />
        <Textarea label="Min huskeliste" value={huskeliste} onChange={(e) => setHuskeliste(e.target.value)} />
        <Textarea label="Beskrivelse" value={beskrivelse} onChange={(e) => setBeskrivelse(e.target.value)} />
        <TextField label="Lenke" value={lenke} onChange={(e) => setLenke(e.target.value)} />

        <div className="flex gap-2 pt-2">
          <Button variant="primary" onClick={lagre}>Lagre</Button>
          <Button variant="secondary" onClick={onClose}>Avbryt</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
