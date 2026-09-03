"use client";

import { Modal } from "@navikt/ds-react";

interface AvtaleModalProps {
  open: boolean;
  onClose: () => void;
}

// Innhold (vilkår, konsekvenser ved brudd) legges til senere.
export function AvtaleModal({ open, onClose }: AvtaleModalProps) {
  return (
    <Modal open={open} onClose={onClose} header={{ heading: "Avtale om å søke jobber" }} width="medium">
      <Modal.Body>{null}</Modal.Body>
    </Modal>
  );
}
