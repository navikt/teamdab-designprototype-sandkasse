"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeftIcon, PersonCircleFillIcon, CogIcon } from "@navikt/aksel-icons";
import { ActionMenu, Button, Tag } from "@navikt/ds-react";
import { ForlengOppfolgingModal } from "./ForlengOppfolgingModal";

export function Visittkort({ navn }: { navn?: string }) {
  const router = useRouter();
  const [forlengOpen, setForlengOpen] = useState(false);
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 bg-white border-b border-gray-200">
      <button
        aria-label="Tilbake"
        className="p-1 rounded hover:bg-gray-100 transition-colors"
        onClick={() => router.back()}
      >
        <ChevronLeftIcon aria-hidden fontSize="1.5rem" />
      </button>

      <PersonCircleFillIcon
        aria-hidden
        fontSize="2.5rem"
        style={{ color: "#368da8" }}
      />

      <span
        className="font-semibold text-2xl leading-8 whitespace-nowrap"
        style={{
          fontFamily: "'Source Sans Pro', 'Source Sans 3', sans-serif",
          color: "#23262a",
          letterSpacing: "-0.048px",
        }}
      >
        {navn ?? "Navn Navnersen"} (44 år)
      </span>

      <span
        className="text-lg leading-6 whitespace-nowrap"
        style={{
          fontFamily: "'Source Sans Pro', 'Source Sans 3', sans-serif",
          color: "#23262a",
        }}
      >
        12345671234
      </span>

      <div className="flex items-center gap-2 flex-wrap flex-1">
        <Tag variant="moderate" data-color="info" size="medium">
          Ikke lengre arbeidssøker
        </Tag>
      </div>

      <ActionMenu size="medium">
        <ActionMenu.Trigger>
          <Button
            variant="secondary"
            size="medium"
            data-color="neutral"
            icon={<CogIcon aria-hidden />}
            iconPosition="left"
            className="ml-auto shrink-0"
          >
            Veilederverktøy
          </Button>
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Group label="">
            <ActionMenu.Item onSelect={() => {}}>Arbeidssøkerregisteret</ActionMenu.Item>
            <ActionMenu.Item onSelect={() => {}}>Tildel veileder</ActionMenu.Item>
            <ActionMenu.Item onSelect={() => {}}>Send varsel</ActionMenu.Item>
            <ActionMenu.Item onSelect={() => {}}>Endre til manuell oppfølging</ActionMenu.Item>
            <ActionMenu.Item onSelect={() => {}}>Start KVP-periode</ActionMenu.Item>
            <ActionMenu.Item onSelect={() => {}}>Avslutt oppfølging</ActionMenu.Item>
            <ActionMenu.Item onSelect={() => setForlengOpen(true)}>Forleng oppfølging</ActionMenu.Item>
            <ActionMenu.Item onSelect={() => {}}>Bytt oppfølgingskontor</ActionMenu.Item>
            <ActionMenu.Item onSelect={() => {}}>Vis historikk</ActionMenu.Item>
          </ActionMenu.Group>
        </ActionMenu.Content>
      </ActionMenu>

      <ForlengOppfolgingModal
        open={forlengOpen}
        onClose={() => setForlengOpen(false)}
        onBekreft={() => setForlengOpen(false)}
      />
    </div>
  );
}
