"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon, CogIcon } from "@navikt/aksel-icons";
import { Button, CopyButton, Dropdown, Heading, Tag } from "@navikt/ds-react";

import { Merkelapp } from "@/data/brukere";

interface VisittkortProps {
  navn?: string;
  fnr?: string;
  status?: string;
  statusVariant?: "error" | "neutral" | "warning" | "info";
  merkelapper?: Merkelapp[];
  onOpenForleng?: () => void;
  onOpenAvslutt?: () => void;
}

export function Visittkort({ navn, fnr, status, statusVariant, merkelapper, onOpenForleng, onOpenAvslutt }: VisittkortProps) {
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

      {/* Fnr — kopierbar */}
      {fnr && (
        <CopyButton
          copyText={fnr}
          text={`Fnr: ${fnr}`}
          activeText="Kopiert!"
          size="medium"
          iconPosition="right"
          aria-label="Kopier fødselsnummer"
        />
      )}
      {!fnr && (
        <CopyButton
          copyText="ID-00000000"
          text="ID: ID-00000000"
          activeText="Kopiert!"
          size="medium"
          iconPosition="right"
          aria-label="Kopier bruker-ID"
        />
      )}

      {/* Etiketter */}
      <div className="flex items-center gap-2 flex-wrap flex-1">
        {status && (
          <Tag variant="outline" data-color={statusVariant ?? "info"} size="small">
            {status}
          </Tag>
        )}
        {merkelapper?.map((m) => (
          <Tag key={m.tekst} variant={m.variant} size="small">
            {m.tekst}
          </Tag>
        ))}
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
