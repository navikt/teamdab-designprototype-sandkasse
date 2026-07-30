"use client";

import { Button, Modal, TextField, Textarea, VStack } from "@navikt/ds-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onOpprett: (overskrift: string, tekst: string) => void;
}

export function NyDialogModal({ open, onClose, onOpprett }: Props) {
  const [overskrift, setOverskrift] = useState("");
  const [tekst, setTekst] = useState("");

  const handleOpprett = () => {
    if (!overskrift.trim() || !tekst.trim()) return;
    onOpprett(overskrift.trim(), tekst.trim());
    setOverskrift("");
    setTekst("");
  };

  return (
    <Modal open={open} onClose={onClose} header={{ heading: "Ny dialog" }}>
      <Modal.Body>
        <VStack gap="4">
          <TextField
            label="Tema"
            value={overskrift}
            onChange={(e) => setOverskrift(e.target.value)}
            placeholder="Hva handler dialogen om?"
          />
          <Textarea
            label="Melding"
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            placeholder="Skriv din første melding..."
            minRows={3}
          />
        </VStack>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleOpprett} disabled={!overskrift.trim() || !tekst.trim()}>
          Send
        </Button>
        <Button variant="tertiary" onClick={onClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
