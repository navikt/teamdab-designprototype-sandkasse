"use client";

import { useState } from "react";
import { Button, Modal, Textarea } from "@navikt/ds-react";

interface RedigerMalModalProps {
  hovedmal: string;
  onLagre: (nyttMal: string) => void;
  onClose: () => void;
}

export function RedigerMalModal({ hovedmal, onLagre, onClose }: RedigerMalModalProps) {
  const [verdi, setVerdi] = useState(hovedmal);

  const lagre = () => {
    if (!verdi.trim()) return;
    onLagre(verdi.trim());
    onClose();
  };

  return (
    <Modal open onClose={onClose} header={{ heading: "Rediger mitt mål" }} width="small">
      <Modal.Body>
        <Textarea
          label="Hva er målet ditt?"
          description="Skriv noen ord om hva du ønsker å oppnå."
          value={verdi}
          onChange={(e) => setVerdi(e.target.value)}
          minRows={3}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={lagre}>Lagre</Button>
        <Button variant="secondary" onClick={onClose}>Avbryt</Button>
      </Modal.Footer>
    </Modal>
  );
}
