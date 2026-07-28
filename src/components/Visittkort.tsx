"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon, CogIcon } from "@navikt/aksel-icons";
import { Button, CopyButton, Dropdown, Heading, Tag } from "@navikt/ds-react";

interface VisittkortProps {
  navn?: string;
  onOpenForleng?: () => void;
  onOpenAvslutt?: () => void;
}

export function Visittkort({ navn, onOpenForleng, onOpenAvslutt }: VisittkortProps) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 px-2 py-2 bg-ax-bg-default border-b border-ax-border-neutral-subtle min-h-[67px] max-w-[1920px]">
      {/* Tilbakelenke */}
      <button
        aria-label="Tilbake til oversikten"
        className="p-1 rounded hover:bg-ax-bg-neutral-soft transition-colors shrink-0"
        onClick={() => router.back()}
      >
        <ChevronLeftIcon aria-hidden fontSize="2.8rem" fontWeight="bold" />
      </button>

      {/* Navn og alder */}
      <Heading size="small" level="2" className="whitespace-nowrap">
        {navn ?? "Testbruker, Uspesifisert"} (44 år)
      </Heading>

      {/* Fødselsnummer — kopierbar */}
      {/* Fnr-lignende testverdi: dag-del "00" er aldri gyldig i et ekte
          fødselsnummer, så tallet kan ikke sammenfalle med et reelt. */}
      <CopyButton
        copyText="00000000000"
        text="F.nr.: 00000000000"
        activeText="Kopiert!"
        size="medium"
        iconPosition="right"
        aria-label="Kopier fødselsnummer"
      />

      {/* Etiketter */}
      <div className="flex items-center gap-2 flex-wrap flex-1">
        <Tag variant="info" size="small">
          Ikke lengre arbeidssøker
        </Tag>
      </div>

      {/* Veilederverktøy */}
      <Dropdown>
        <Button
          as={Dropdown.Toggle}
          variant="secondary-neutral"
          size="medium"
          icon={<CogIcon aria-hidden fontSize="1.5rem" />}
          iconPosition="left"
          className="shrink-0"
        >
          Veilederverktøy
        </Button>
        <Dropdown.Menu placement="bottom-end">
          <Dropdown.Menu.List>
            <Dropdown.Menu.List.Item onClick={() => {}}>Arbeidssøkerregisteret</Dropdown.Menu.List.Item>
            <Dropdown.Menu.List.Item onClick={() => {}}>Tildel veileder</Dropdown.Menu.List.Item>
            <Dropdown.Menu.List.Item onClick={() => {}}>Send varsel</Dropdown.Menu.List.Item>
            <Dropdown.Menu.List.Item onClick={() => {}}>Endre til manuell oppfølging</Dropdown.Menu.List.Item>
            <Dropdown.Menu.List.Item onClick={() => {}}>Start KVP-periode</Dropdown.Menu.List.Item>
            <Dropdown.Menu.List.Item onClick={() => onOpenAvslutt?.()}>Avslutt oppfølging</Dropdown.Menu.List.Item>
            <Dropdown.Menu.List.Item onClick={() => onOpenForleng?.()}>Forleng oppfølging</Dropdown.Menu.List.Item>
            <Dropdown.Menu.List.Item onClick={() => {}}>Bytt oppfølgingskontor</Dropdown.Menu.List.Item>
            <Dropdown.Menu.List.Item onClick={() => {}}>Vis historikk</Dropdown.Menu.List.Item>
          </Dropdown.Menu.List>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
