"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon, PersonCircleFillIcon, CogIcon } from "@navikt/aksel-icons";
import { ActionMenu, BodyLong, Button, Heading, Tag } from "@navikt/ds-react";

interface VisittkortProps {
  navn?: string;
  onOpenForleng?: () => void;
  onOpenAvslutt?: () => void;
}

export function Visittkort({ navn, onOpenForleng, onOpenAvslutt }: VisittkortProps) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 bg-ax-bg-default border-b border-ax-border-neutral-subtle">
      <button
        aria-label="Tilbake"
        className="p-1 rounded hover:bg-ax-bg-neutral-soft transition-colors"
        onClick={() => router.back()}
      >
        <ChevronLeftIcon aria-hidden fontSize="1.5rem" />
      </button>

      <PersonCircleFillIcon
        aria-hidden
        fontSize="2.5rem"
        className="text-ax-text-info"
      />

      <Heading size="large" level="1" className="whitespace-nowrap">
        {navn ?? "Testbruker, Uspesifisert"} (44 år)
      </Heading>

      {/* Fnr-lignende testverdi: dag-del "00" er aldri gyldig i et ekte
          fødselsnummer, så tallet kan ikke sammenfalle med et reelt. */}
      <BodyLong className="whitespace-nowrap">
        00000000000
      </BodyLong>

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
            <ActionMenu.Item onSelect={() => onOpenAvslutt?.()}>Avslutt oppfølging</ActionMenu.Item>
            <ActionMenu.Item onSelect={() => onOpenForleng?.()}>Forleng oppfølging</ActionMenu.Item>
            <ActionMenu.Item onSelect={() => {}}>Bytt oppfølgingskontor</ActionMenu.Item>
            <ActionMenu.Item onSelect={() => {}}>Vis historikk</ActionMenu.Item>
          </ActionMenu.Group>
        </ActionMenu.Content>
      </ActionMenu>
    </div>
  );
}
