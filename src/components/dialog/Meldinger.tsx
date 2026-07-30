"use client";

import { BodyShort, Chat } from "@navikt/ds-react";
import { PersonIcon } from "@navikt/aksel-icons";
import { Dialog, Melding } from "./mockDialoger";

function formaterDatoOgTid(iso: string): string {
  return new Date(iso).toLocaleString("nb-NO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MeldingBubbel({ melding }: { melding: Melding }) {
  const erFraBruker = melding.avsender === "BRUKER";
  // Veileder vises til venstre (position left), bruker til høyre (position right)
  const position = erFraBruker ? "right" : "left";
  const tidspunkt = erFraBruker
    ? formaterDatoOgTid(melding.sendt)
    : `${formaterDatoOgTid(melding.sendt)} – ${melding.avsenderId}`;

  return (
    <div className={`mt-4 flex ${erFraBruker ? "justify-end" : "justify-start"}`}>
      <Chat
        timestamp={tidspunkt}
        size="small"
        avatar={erFraBruker ? <PersonIcon aria-hidden className="!h-6 !w-6" /> : "Nav"}
        position={position}
        className={erFraBruker ? "chat-avatar-info" : "chat-avatar-neutral"}
      >
        <Chat.Bubble
          style={
            erFraBruker
              ? { border: "1px solid #0096b1", background: "#D8F9FF" }
              : { border: "1px solid var(--ax-border-neutral)", background: "#ffffff" }
          }
        >
          {melding.viktig && (
            <BodyShort size="small" weight="semibold" className="mb-1 text-ax-text-warning">
              ⚠ Viktig melding
            </BodyShort>
          )}
          <BodyShort size="small" className="whitespace-pre-line">
            {melding.tekst}
          </BodyShort>
        </Chat.Bubble>
      </Chat>
    </div>
  );
}

interface Props {
  dialog: Dialog;
}

export function Meldinger({ dialog }: Props) {
  const sortert = [...dialog.henvendelser].sort(
    (a, b) => new Date(a.sendt).getTime() - new Date(b.sendt).getTime()
  );

  return (
    <section
      aria-label="Meldinger"
      className="flex flex-col overflow-y-auto bg-ax-bg-sunken px-4 py-2 grow"
    >
      {sortert.map((melding) => (
        <MeldingBubbel key={melding.id} melding={melding} />
      ))}
    </section>
  );
}
