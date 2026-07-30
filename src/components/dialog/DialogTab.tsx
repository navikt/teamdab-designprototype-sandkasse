"use client";

import { useState } from "react";
import { BodyShort, Heading } from "@navikt/ds-react";
import { Dialog, Melding, mockDialoger } from "./mockDialoger";
import { DialogListe } from "./DialogListe";
import { Meldinger } from "./Meldinger";
import { DialogHeader, MeldingInput } from "./DialogHeaderOgInput";
import { NyDialogModal } from "./NyDialogModal";

export function DialogTab() {
  const [dialoger, setDialoger] = useState<Dialog[]>(mockDialoger);
  const [valgtDialogId, setValgtDialogId] = useState<string | null>(mockDialoger[0]?.id ?? null);
  const [nyDialogOpen, setNyDialogOpen] = useState(false);

  const valgtDialog = dialoger.find((d) => d.id === valgtDialogId) ?? null;

  const oppdaterDialog = (id: string, patch: Partial<Dialog>) => {
    setDialoger((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const sendMelding = (tekst: string) => {
    if (!valgtDialog) return;
    const nyMelding: Melding = {
      id: `${valgtDialog.id}-${Date.now()}`,
      dialogId: valgtDialog.id,
      avsender: "VEILEDER",
      avsenderId: "Z123456",
      sendt: new Date().toISOString(),
      viktig: false,
      tekst,
    };
    oppdaterDialog(valgtDialog.id, {
      henvendelser: [...valgtDialog.henvendelser, nyMelding],
      sisteDato: nyMelding.sendt,
      lest: true,
    });
  };

  const opprettDialog = (overskrift: string, tekst: string) => {
    const id = `ny-${Date.now()}`;
    const nyMelding: Melding = {
      id: `${id}-1`,
      dialogId: id,
      avsender: "VEILEDER",
      avsenderId: "Z123456",
      sendt: new Date().toISOString(),
      viktig: false,
      tekst,
    };
    const nyDialog: Dialog = {
      id,
      overskrift,
      sisteDato: nyMelding.sendt,
      historisk: false,
      lest: true,
      venterPaSvar: false,
      ferdigBehandlet: false,
      aktivitetId: null,
      egenskaper: [],
      henvendelser: [nyMelding],
    };
    setDialoger((prev) => [nyDialog, ...prev]);
    setValgtDialogId(id);
    setNyDialogOpen(false);
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="w-80 shrink-0">
        <DialogListe
          dialoger={dialoger}
          valgtDialogId={valgtDialogId}
          onVelgDialog={setValgtDialogId}
          onNyDialog={() => setNyDialogOpen(true)}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {valgtDialog ? (
          <>
            <DialogHeader
              dialog={valgtDialog}
              onToggleVenterPaSvar={() =>
                oppdaterDialog(valgtDialog.id, { venterPaSvar: !valgtDialog.venterPaSvar })
              }
              onToggleFerdigBehandlet={() =>
                oppdaterDialog(valgtDialog.id, { ferdigBehandlet: !valgtDialog.ferdigBehandlet })
              }
            />
            <Meldinger dialog={valgtDialog} />
            <MeldingInput
              onSend={sendMelding}
              disabled={valgtDialog.historisk}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-ax-bg-sunken">
            <BodyShort className="text-ax-text-neutral-subtle">Velg en dialog i listen</BodyShort>
          </div>
        )}
      </div>

      <NyDialogModal
        open={nyDialogOpen}
        onClose={() => setNyDialogOpen(false)}
        onOpprett={opprettDialog}
      />
    </div>
  );
}
