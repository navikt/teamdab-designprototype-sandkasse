"use client";

import { useState } from "react";
import { Button, Heading, Modal } from "@navikt/ds-react";
import { PlusIcon } from "@navikt/aksel-icons";
import { demoDialoger, DemoDialog, DemoMelding } from "./dialogData";
import { DialogPreviewListe } from "./DialogPreviewKort";
import { MeldingerSeksjon } from "./MeldingerSeksjon";
import { SvarfeltSeksjon } from "./SvarfeltSeksjon";
import { NyDialogFormSeksjon } from "./NyDialogFormSeksjon";

export function DialogSection() {
  const [dialoger, setDialoger] = useState<DemoDialog[]>(demoDialoger);
  const [valgtId, setValgtId] = useState<string>("1");
  const [omDialogOpen, setOmDialogOpen] = useState(false);
  const [visNyDialog, setVisNyDialog] = useState(false);
  const [meldinger, setMeldinger] = useState<Record<string, DemoMelding[]>>(
    Object.fromEntries(demoDialoger.map((d) => [d.id, d.meldinger]))
  );

  const valgtDialog = dialoger.find((d) => d.id === valgtId) ?? dialoger[0];

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

  const handleNyDialogSend = (tema: string, melding: string, venterPaSvar: boolean) => {
    const nyId = String(Date.now());
    const nyDialog: DemoDialog = {
      id: nyId,
      overskrift: tema,
      lest: true,
      sisteDato: new Date().toISOString().slice(0, 10),
      antallMeldinger: 1,
      ferdigBehandlet: false,
      venterPaSvar,
      viktig: false,
      meldinger: [],
    };
    const forsteMelding: DemoMelding = {
      id: `${nyId}-1`,
      avsender: "VEILEDER",
      tekst: melding,
      sendt: new Date().toISOString(),
    };
    setDialoger((prev) => [nyDialog, ...prev]);
    setMeldinger((prev) => ({ ...prev, [nyId]: [forsteMelding] }));
    setValgtId(nyId);
    setVisNyDialog(false);
  };

  const handleVelgDialog = (id: string) => {
    setValgtId(id);
    setVisNyDialog(false);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Venstre panel: dialogliste */}
      <div className="flex flex-col border-r border-ax-border-neutral-subtle md:min-w-[320px] md:max-w-[320px] w-full">
        <div className="relative flex flex-1 flex-col overflow-y-auto bg-ax-bg-sunken p-2">
          <div className="flex gap-2 p-1 pb-2">
            <Button size="small" icon={<PlusIcon aria-hidden />} className="flex-grow" onClick={() => setVisNyDialog(true)}>
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
              dialoger={dialoger}
              valgtId={valgtId}
              onVelgDialog={handleVelgDialog}
            />
          </div>
        </div>
      </div>

      {/* Høyre område */}
      <div className="flex flex-1 flex-col overflow-hidden border-l border-ax-border-neutral-subtle">
        {visNyDialog ? (
          <NyDialogFormSeksjon
            onSend={handleNyDialogSend}
            onAvbryt={() => setVisNyDialog(false)}
          />
        ) : (
          <>
            <div className="flex flex-col gap-x-4 border-b border-solid border-ax-border-neutral-subtle bg-white py-1">
              <section aria-label="Dialog header">
                <div className="flex flex-row gap-x-2 pl-4">
                  <Heading level="1" size="small">{valgtDialog.overskrift}</Heading>
                </div>
              </section>
            </div>
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
              <MeldingerSeksjon dialog={valgtDialog} meldinger={meldinger[valgtId] ?? []} />
              <SvarfeltSeksjon dialog={valgtDialog} onSend={handleSend} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
