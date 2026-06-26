"use client";

import { useState } from "react";
import { BodyLong, Button, Modal, Textarea } from "@navikt/ds-react";

interface AvsluttOppfolgingModalProps {
  open: boolean;
  onClose: () => void;
  onBekreft: () => void;
}

export function AvsluttOppfolgingModal({ open, onClose, onBekreft }: AvsluttOppfolgingModalProps) {
  const [begrunnelse, setBegrunnelse] = useState("");

  return (
    <Modal open={open} onClose={onClose} header={{ heading: "Avslutt oppfølgingsperioden" }} width="medium">
      <Modal.Body className="flex flex-col gap-4">
        <BodyLong>
          Brukeren har vært inaktiv i mindre enn 28 dager. Vil du likevel avslutte brukerens oppfølgingsperiode?
        </BodyLong>
        <Textarea
          label="Begrunnelse"
          value={begrunnelse}
          onChange={(e) => setBegrunnelse(e.target.value)}
          maxLength={500}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" size="medium" onClick={onBekreft}>Bekreft</Button>
        <Button variant="secondary" size="medium" onClick={onClose}>Avbryt</Button>
      </Modal.Footer>
    </Modal>
  );
}
