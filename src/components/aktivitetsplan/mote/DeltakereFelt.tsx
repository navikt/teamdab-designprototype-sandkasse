"use client";

import { PlusIcon, TrashIcon } from "@navikt/aksel-icons";
import { BodyShort, Button, Box, Fieldset, HGrid, Select, TextField } from "@navikt/ds-react";
import { useEffect, useState } from "react";
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
    onChange([...rader, { id, navn: "", rolle: "" }]);
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
            label={<BodyShort as="span">Bruker (får alltid innkallingen)</BodyShort>}
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
            <TextField
              id={deltakerNavnId(rad.id)}
              label={<BodyShort as="span">{rad.id === VEILEDER_RAD_ID ? "Veileder" : "Navn"}</BodyShort>}
              value={rad.navn}
              onChange={(e) => oppdater(i, { navn: e.target.value })}
              error={feil[rad.id]?.navn}
            />
            {rad.id === VEILEDER_RAD_ID ? (
              <div className="hidden sm:block" aria-hidden />
            ) : (
              <Select
                id={deltakerRolleId(rad.id)}
                label={<BodyShort as="span">Rolle</BodyShort>}
                value={rad.rolle}
                onChange={(e) => oppdater(i, { rolle: e.target.value })}
                error={feil[rad.id]?.rolle}
              >
                <option value="">Velg rolle</option>
                {DELTAKER_ROLLER.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
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
