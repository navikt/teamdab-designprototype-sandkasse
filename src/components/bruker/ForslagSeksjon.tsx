"use client";

import { useState } from "react";
import { Alert, Button, Heading, Modal, BodyShort, Detail } from "@navikt/ds-react";
import { AktivitetsKort } from "../aktivitetsplan/types";

interface ForslagSeksjonProps {
  forslag: AktivitetsKort[];
  onGodta: (id: string) => void;
  onAvsla: (id: string) => void;
}

export function ForslagSeksjon({ forslag, onGodta, onAvsla }: ForslagSeksjonProps) {
  const [open, setOpen] = useState(false);

  if (forslag.length === 0) return null;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="w-full text-left py-4">
        <Alert variant="warning" size="small">
          Du har {forslag.length} forslag til {forslag.length === 1 ? "aktivitet" : "aktiviteter"}. <span className="underline">Klikk for å åpne.</span>
        </Alert>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} header={{ heading: "Forslag til aktiviteter" }} width="medium">
        <Modal.Body className="flex flex-col gap-4">
          {forslag.map((k) => (
            <div key={k.id} className="border border-ax-border-neutral-subtle rounded-md p-3 flex flex-col gap-2">
              <Detail className="uppercase text-ax-text-neutral">{k.type}</Detail>
              <Heading level="3" size="xsmall">{k.title}</Heading>
              {k.dateRange && <BodyShort>{k.dateRange}</BodyShort>}
              <div className="flex gap-2 pt-1">
                <Button variant="primary" size="small" onClick={() => onGodta(k.id)}>Godta</Button>
                <Button variant="secondary" size="small" onClick={() => onAvsla(k.id)}>Avslå</Button>
              </div>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
}
