"use client";

import { BodyShort, Detail, LinkCard, Tag } from "@navikt/ds-react";
import { ChevronRightIcon } from "@navikt/aksel-icons";
import { DemoDialog } from "./dialogData";

interface Props {
  dialog: DemoDialog;
  valgt: boolean;
  onClick: (id: string) => void;
}

function formaterDato(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function DialogPreviewKort({ dialog, valgt, onClick }: Props) {
  const { id, overskrift, lest, sisteDato, antallMeldinger, ferdigBehandlet, venterPaSvar, viktig } = dialog;

  return (
    <LinkCard
      arrow={false}
      size="small"
      aria-current={valgt || undefined}
      className={[
        "relative overflow-hidden pl-5",
        valgt ? "bg-[#e6f0ff] [border-color:var(--ax-border-accent)]" : "",
      ].join(" ")}
    >
      {/* Blå ulest-indikator langs venstre kant */}
      {!lest && (
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-[var(--ax-bg-accent-strong)] pointer-events-none z-10" />
      )}

      <LinkCard.Title>
        <LinkCard.Anchor
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onClick(id);
          }}
        >
          {overskrift}
        </LinkCard.Anchor>
      </LinkCard.Title>

      <LinkCard.Description>
        <Detail>{formaterDato(sisteDato)}</Detail>
        <div className="flex flex-wrap gap-1 mt-1">
          {venterPaSvar && (
            <Tag variant="warning" size="small">
              Venter på svar fra bruker
            </Tag>
          )}
          {viktig && (
            <Tag variant="error" size="small">
              Viktig melding
            </Tag>
          )}
          {!ferdigBehandlet && (
            <Tag variant="info" size="small">
              Venter på svar fra Nav
            </Tag>
          )}
        </div>
      </LinkCard.Description>

      {/* Antall meldinger + pil — grid-area arrow */}
      <div className="[grid-area:arrow] flex items-center self-start gap-1 ml-2">
        <BodyShort aria-hidden>{antallMeldinger}</BodyShort>
        <ChevronRightIcon aria-hidden fontSize="1.75rem" />
      </div>
    </LinkCard>
  );
}

interface ListeProps {
  valgtId: string;
  onVelgDialog: (id: string) => void;
  dialoger: DemoDialog[];
}

export function DialogPreviewListe({ dialoger, valgtId, onVelgDialog }: ListeProps) {
  return (
    <ul aria-label="Dialogliste" className="flex flex-col gap-y-1">
      {dialoger.map((dialog) => (
        <li key={dialog.id}>
          <DialogPreviewKort
            dialog={dialog}
            valgt={dialog.id === valgtId}
            onClick={onVelgDialog}
          />
        </li>
      ))}
    </ul>
  );
}
