"use client";

import { BodyShort, Detail, LinkCard, Tag } from "@navikt/ds-react";
import { Dialog } from "./mockDialoger";

interface Props {
  dialoger: Dialog[];
  valgtDialogId: string | null;
  onVelgDialog: (id: string) => void;
  onNyDialog: () => void;
}

function formaterDato(iso: string): string {
  return new Date(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
}

function DialogPreviewKort({ dialog, valgt, onClick }: { dialog: Dialog; valgt: boolean; onClick: () => void }) {
  const sisteMelding = dialog.henvendelser.at(-1);
  const erViktig = dialog.egenskaper.includes("ESKALERINGSVARSEL");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
        valgt
          ? "border-ax-border-focus bg-white ring-2 ring-ax-border-focus"
          : "border-ax-border-neutral-subtle bg-white hover:bg-ax-bg-default-hover"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            {!dialog.lest && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-ax-bg-info" aria-label="Ulest" />
            )}
            <BodyShort weight="semibold" className="truncate text-sm">
              {dialog.overskrift}
            </BodyShort>
          </div>
          {sisteMelding && (
            <BodyShort size="small" className="line-clamp-2 text-ax-text-neutral-subtle">
              {sisteMelding.tekst}
            </BodyShort>
          )}
          <div className="flex gap-2">
            {erViktig && <Tag size="xsmall" variant="warning">Viktig</Tag>}
            {dialog.venterPaSvar && <Tag size="xsmall" variant="info">Venter på svar</Tag>}
            {dialog.ferdigBehandlet && <Tag size="xsmall" variant="success">Ferdig behandlet</Tag>}
            {dialog.historisk && <Tag size="xsmall" variant="neutral">Historisk</Tag>}
          </div>
        </div>
        <Detail className="shrink-0 text-ax-text-neutral-subtle">{formaterDato(dialog.sisteDato)}</Detail>
      </div>
    </div>
  );
}

export function DialogListe({ dialoger, valgtDialogId, onVelgDialog, onNyDialog }: Props) {
  const aktiveDialoger = dialoger.filter((d) => !d.historisk);
  const historiskeDialoger = dialoger.filter((d) => d.historisk);

  return (
    <div className="flex h-full flex-col border-r border-ax-border-neutral-subtle bg-ax-bg-sunken">
      <div className="p-3 border-b border-ax-border-neutral-subtle">
        <button
          onClick={onNyDialog}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-ax-border-neutral bg-white px-3 py-2 text-sm font-medium hover:bg-ax-bg-default-hover"
        >
          + Ny dialog
        </button>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto p-2">
        {aktiveDialoger.map((dialog) => (
          <DialogPreviewKort
            key={dialog.id}
            dialog={dialog}
            valgt={dialog.id === valgtDialogId}
            onClick={() => onVelgDialog(dialog.id)}
          />
        ))}
        {historiskeDialoger.length > 0 && (
          <>
            <BodyShort size="small" weight="semibold" className="mt-2 px-1 text-ax-text-neutral-subtle">
              Historiske dialoger
            </BodyShort>
            {historiskeDialoger.map((dialog) => (
              <DialogPreviewKort
                key={dialog.id}
                dialog={dialog}
                valgt={dialog.id === valgtDialogId}
                onClick={() => onVelgDialog(dialog.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
