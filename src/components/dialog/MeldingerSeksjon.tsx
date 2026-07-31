"use client";

import { useEffect, useRef } from "react";
import { BodyShort, Chat } from "@navikt/ds-react";
import { PersonIcon } from "@navikt/aksel-icons";
import { DemoDialog, DemoMelding } from "./dialogData";

function formaterTidspunkt(iso: string): string {
  return new Date(iso).toLocaleString("nb-NO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MeldingBoble({ melding }: { melding: DemoMelding }) {
  const erVeileder = melding.avsender === "VEILEDER";

  return (
    <div className={`mt-4 flex flex-1 ${erVeileder ? "justify-end" : ""}`}>
      <Chat
        timestamp={formaterTidspunkt(melding.sendt)}
        size="small"
        avatar={erVeileder ? "Nav" : <PersonIcon aria-hidden className="!h-6 !w-6" />}
        position={erVeileder ? "right" : "left"}
        className={`p-0 ${erVeileder ? "chat-nav" : "chat-bruker"}`}
      >
        <Chat.Bubble
          style={
            erVeileder
              ? { border: "1px solid #0096b1", background: "#D8F9FF" }
              : { border: "1px solid var(--ax-border-neutral)", background: "#ffffff" }
          }
        >
          {melding.tekst}
        </Chat.Bubble>
      </Chat>
    </div>
  );
}

interface Props {
  dialog: DemoDialog;
}

export function MeldingerSeksjon({ dialog }: Props) {
  const scrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, [dialog.id]);

  return (
    <section
      aria-label="Meldinger"
      className="grow overflow-y-scroll relative bg-ax-bg-sunken px-4"
      ref={scrollRef}
      tabIndex={0}
    >
      <div className="flex flex-col justify-end min-h-full">
        <div className="mb-4 flex flex-col">
          {dialog.meldinger.map((melding) => (
            <MeldingBoble key={melding.id} melding={melding} />
          ))}
        </div>
        <LestAvBruker dialog={dialog} />
      </div>
    </section>
  );
}

function LestAvBruker({ dialog }: { dialog: DemoDialog }) {
  const sistNavMelding = [...dialog.meldinger].reverse().find((m) => m.avsender === "VEILEDER");
  if (!sistNavMelding) return null;

  return (
    <div className="flex items-center justify-center pb-4 pt-2">
      <BodyShort size="small" className="text-ax-text-neutral-subtle">
        Lest av bruker {formaterTidspunkt(sistNavMelding.sendt)}
      </BodyShort>
    </div>
  );
}
