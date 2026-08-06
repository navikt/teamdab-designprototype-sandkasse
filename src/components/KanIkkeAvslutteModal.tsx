"use client";

import { Alert, BodyLong, Button, List, Modal } from "@navikt/ds-react";

interface KanIkkeAvslutteModalProps {
  open: boolean;
  onClose: () => void;
}

export function KanIkkeAvslutteModal({ open, onClose }: KanIkkeAvslutteModalProps) {
  return (
    <Modal open={open} onClose={onClose} header={{ heading: "Avslutt oppfølgingsperioden" }} width="medium">
      <Modal.Body>
        <Alert variant="warning">
          <BodyLong spacing>Du kan ikke avslutte oppfølgingsperioden fordi:</BodyLong>
          <List>
            <List.Item>Brukeren har aktiv status i Arena.</List.Item>
            <List.Item>
              Brukeren deltar i Ungdomsprogrammet. Deltakelse i Ungdomsprogrammet må avsluttes først.
            </List.Item>
          </List>
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="small" onClick={onClose}>Lukk</Button>
      </Modal.Footer>
    </Modal>
  );
}
