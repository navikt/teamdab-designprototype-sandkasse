"use client";

import { useState } from "react";
import { Button, Modal } from "@navikt/ds-react";
import { PlusIcon } from "@navikt/aksel-icons";
import { demoDialoger, DemoMelding } from "./dialogData";
import { DialogPreviewListe } from "./DialogPreviewKort";
import { MeldingerSeksjon } from "./MeldingerSeksjon";
import { SvarfeltSeksjon } from "./SvarfeltSeksjon";

export function DialogSection() {
  const [valgtId, setValgtId] = useState<string>("1");
  const [omDialogOpen, setOmDialogOpen] = useState(false);
  const [meldinger, setMeldinger] = useState<Record<string, DemoMelding[]>>(
    Object.fromEntries(demoDialoger.map((d) => [d.id, d.meldinger]))
  );

  const valgtDialog = demoDialoger.find((d) => d.id === valgtId) ?? demoDialoger[0];

  const handleSend = (tekst: string) => {
    const nyMelding: DemoMelding = {
      id: `${valgtId}-${Date.now()}`,
      avsender: "VEILEDER",
      tekst,
      sendt: new Date().toISOString(),
    };
    setMeldinger((prev) => ({
      ...prev,
      [valgtId]: [...(prev[valgtId] ?? []), nyMelding],
    }));
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Venstre panel: dialogliste */}
      <div className="flex flex-col border-r border-ax-border-neutral-subtle md:min-w-[320px] md:max-w-[320px] w-full">
        <div className="relative flex flex-1 flex-col overflow-y-auto bg-ax-bg-sunken p-2">
          <div className="flex gap-2 p-1 pb-2">
            <Button size="small" icon={<PlusIcon aria-hidden />} className="flex-grow">
              Ny dialog
            </Button>
            <Button variant="tertiary" size="small" className="flex-grow" onClick={() => setOmDialogOpen(true)}>
              Om dialogen
            </Button>
            <Modal
              open={omDialogOpen}
              onClose={() => setOmDialogOpen(false)}
              closeOnBackdropClick
              header={{ heading: "Om dialogen", closeButton: true }}
            >
              <Modal.Body>
                <p>Her kan du sende meldinger til og fra veileder.</p>
              </Modal.Body>
            </Modal>
          </div>
          <div className="flex flex-col gap-2">
            <DialogPreviewListe
              dialoger={demoDialoger}
              valgtId={valgtId}
              onVelgDialog={setValgtId}
            />
          </div>
        </div>
      </div>

      {/* Høyre område: header + meldinger + svarfelt */}
      <div className="flex flex-1 flex-col overflow-hidden border-l border-ax-border-neutral-subtle">
        {/* DialogHeader */}
        <div className="border-b border-ax-border-neutral-subtle bg-white px-4 py-2">
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </div>

        {/* Meldinger + svarfelt, side ved side på lg+ */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          <MeldingerSeksjon dialog={valgtDialog} meldinger={meldinger[valgtId] ?? []} />
          <SvarfeltSeksjon dialog={valgtDialog} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
