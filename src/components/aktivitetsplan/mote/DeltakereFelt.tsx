"use client";

import { ChevronDownIcon, PlusIcon, TrashIcon } from "@navikt/aksel-icons";
import { ActionMenu, BodyShort, Button, Box, Detail, Fieldset, ErrorMessage, HGrid, TextField } from "@navikt/ds-react";
import { useEffect, useId, useState } from "react";
import { DeltakerRolle } from "../types";
import { DELTAKER_ROLLER, DeltakerRad, DeltakerRadFeil, VEILEDER_RAD_ID, visningsNavn } from "./moteUtils";

interface Props {
  rader: DeltakerRad[];
  onChange: (rader: DeltakerRad[]) => void;
  brukerNavn: string;
  // Feil per rad-id, vist når skjemaet er forsøkt sendt.
  feil: Record<string, DeltakerRadFeil>;
}

export const deltakerNavnId = (id: string) => `deltaker-navn-${id}`;
export const deltakerRolleId = (id: string) => `deltaker-rolle-${id}`;

interface RolleVelgerProps {
  id: string;
  valgte: DeltakerRolle[];
  onChange: (roller: DeltakerRolle[]) => void;
  feil?: string;
}

// ActionMenu er ikke et skjemafelt, så label, feilmelding og feilmarkering kobles til knappen manuelt.
function RolleVelger({ id, valgte, onChange, feil }: RolleVelgerProps) {
  const labelId = useId();
  const feilId = useId();
  const oppsummering = DELTAKER_ROLLER.filter((r) => valgte.includes(r)).join(", ");

  const toggle = (rolle: DeltakerRolle, erValgt: boolean) =>
    onChange(DELTAKER_ROLLER.filter((r) => (r === rolle ? erValgt : valgte.includes(r))));

  return (
    <div className="flex flex-col gap-2">
      <BodyShort as="span" id={labelId}>
        Deltakers rolle
      </BodyShort>
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button
            id={id}
            type="button"
            variant="secondary-neutral"
            data-color={feil ? "danger" : undefined}
            icon={<ChevronDownIcon aria-hidden />}
            iconPosition="right"
            aria-labelledby={`${labelId} ${id}`}
            aria-describedby={feil ? feilId : undefined}
            className="w-full justify-between! text-left [&_.aksel-label]:font-normal! [&_.aksel-label]:flex-1 [&_.aksel-label]:text-left"
          >
            {oppsummering || "Velg"}
          </Button>
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Group aria-label="Deltakers rolle">
            {DELTAKER_ROLLER.map((r) => (
              <ActionMenu.CheckboxItem key={r} checked={valgte.includes(r)} onCheckedChange={(erValgt) => toggle(r, erValgt)}>
                {r}
              </ActionMenu.CheckboxItem>
            ))}
          </ActionMenu.Group>
        </ActionMenu.Content>
      </ActionMenu>
      <div id={feilId} aria-live="polite">
        {feil && <ErrorMessage showIcon>{feil}</ErrorMessage>}
      </div>
    </div>
  );
}

export function DeltakereFelt({ rader, onChange, brukerNavn, feil }: Props) {
  const [fokusId, setFokusId] = useState<string>();
  const [melding, setMelding] = useState("");

  // Fokus flyttes etter at den nye raden er rendret.
  useEffect(() => {
    if (!fokusId) return;
    document.getElementById(fokusId)?.focus();
  }, [fokusId]);

  const leggTil = () => {
    // randomUUID finnes ikke i usikre kontekster (http over lokalnett, f.eks. mobiltesting).
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    onChange([...rader, { id, navn: "", roller: [] }]);
    setFokusId(deltakerNavnId(id));
    setMelding(`Deltaker ${rader.length + 1} lagt til`);
  };

  const slett = (indeks: number) => {
    const nyeRader = rader.filter((_, i) => i !== indeks);
    onChange(nyeRader);
    // Fokus går til forrige rad, eller til knappen hvis ingen rader er igjen.
    const forrige = nyeRader[indeks - 1] ?? nyeRader[0];
    setFokusId(forrige ? deltakerNavnId(forrige.id) : "deltaker-legg-til");
    setMelding(`Deltaker ${indeks + 1} fjernet`);
  };

  const oppdater = (indeks: number, endring: Partial<DeltakerRad>) =>
    onChange(rader.map((r, i) => (i === indeks ? { ...r, ...endring } : r)));

  // Usynlig kopi av Fjern-knappen holder kolonnene like brede som i radene som kan fjernes.
  const fjernPlassholder = (
    <div aria-hidden className="hidden sm:block invisible">
      <Box marginBlock="space-32 space-0">
        <Button type="button" variant="tertiary" tabIndex={-1} icon={<TrashIcon aria-hidden />}>
          Fjern
        </Button>
      </Box>
    </div>
  );

  return (
    <Fieldset legend="Deltakere">
      <div role="group" aria-label="Bruker">
        <HGrid columns={{ xs: 1, sm: "minmax(0, 2fr) minmax(0, 1fr) auto" }} gap="space-16" align="start">
          <TextField
            label={<BodyShort as="span">Bruker</BodyShort>}
            value={visningsNavn(brukerNavn)}
            readOnly
          />
          <div className="hidden sm:block" aria-hidden />
          {fjernPlassholder}
        </HGrid>
      </div>

      {rader.map((rad, i) => (
        <div
          key={rad.id}
          role="group"
          aria-label={rad.id === VEILEDER_RAD_ID ? "Veileder" : `Deltaker ${i + 1}`}
          style={{ marginTop: "var(--ax-space-16)" }}
        >
          <HGrid columns={{ xs: 1, sm: "minmax(0, 2fr) minmax(0, 1fr) auto" }} gap="space-16" align="start">
            <div>
              <TextField
                id={deltakerNavnId(rad.id)}
                label={<BodyShort as="span">{rad.id === VEILEDER_RAD_ID ? "Veileder" : "Deltakers navn"}</BodyShort>}
                value={rad.navn}
                onChange={(e) => oppdater(i, { navn: e.target.value })}
                error={feil[rad.id]?.navn}
                aria-describedby={rad.id === VEILEDER_RAD_ID ? undefined : `${deltakerNavnId(rad.id)}-info`}
              />
              {rad.id !== VEILEDER_RAD_ID && (
                <Detail id={`${deltakerNavnId(rad.id)}-info`} className="mt-1">
                  Navn på tolk skjules for alle andre enn veileder
                </Detail>
              )}
            </div>
            {rad.id === VEILEDER_RAD_ID ? (
              <div className="hidden sm:block" aria-hidden />
            ) : (
              <RolleVelger
                id={deltakerRolleId(rad.id)}
                valgte={rad.roller}
                onChange={(roller) => oppdater(i, { roller })}
                feil={feil[rad.id]?.rolle}
              />
            )}
            {rad.id === VEILEDER_RAD_ID ? (
              fjernPlassholder
            ) : (
              <Box marginBlock={{ xs: "space-0", sm: "space-32 space-0" }}>
                <Button
                  type="button"
                  variant="tertiary"
                  data-color="danger"
                  icon={<TrashIcon aria-hidden />}
                  onClick={() => slett(i)}
                >
                  Fjern<span className="sr-only"> deltaker {i + 1}</span>
                </Button>
              </Box>
            )}
          </HGrid>
        </div>
      ))}

      <div style={{ marginTop: "var(--ax-space-16)" }}>
        <Button
          id="deltaker-legg-til"
          type="button"
          variant="secondary"
          icon={<PlusIcon aria-hidden />}
          onClick={leggTil}
        >
          Legg til flere deltakere
        </Button>
      </div>
      <div className="sr-only" aria-live="polite" role="status">
        {melding}
      </div>
    </Fieldset>
  );
}
