"use client";

import { PlusIcon, TrashIcon } from "@navikt/aksel-icons";
import { BodyShort, Button, Fieldset, HGrid, ReadMore, TextField, UNSAFE_Combobox as Combobox, VStack } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { DELTAKER_ROLLER, DeltakerRad, DeltakerRadFeil, VEILEDER_RAD_ID, visningsNavn } from "./moteUtils";

interface Props {
  rader: DeltakerRad[];
  onChange: (rader: DeltakerRad[]) => void;
  brukerNavn: string;
  // Feil per rad-id, vist når skjemaet er forsøkt sendt.
  feil: Record<string, DeltakerRadFeil>;
}

const KOLONNER = { xs: 1, sm: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.2fr)" };

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

  return (
    <Fieldset legend="Deltakere">
      <VStack gap="space-16">
        <HGrid columns={KOLONNER} gap="space-16">
          <TextField size="small" label={<BodyShort as="span">Bruker</BodyShort>} value={visningsNavn(brukerNavn)} readOnly />
        </HGrid>

        {rader.map((rad, i) => {
          const erVeileder = rad.id === VEILEDER_RAD_ID;
          return (
            <HGrid
              key={rad.id}
              role="group"
              aria-label={erVeileder ? "Veileder" : `Deltaker ${i + 1}`}
              columns={KOLONNER}
              gap="space-16"
              align="start"
            >
              <TextField
                id={deltakerNavnId(rad.id)}
                size="small"
                label={<BodyShort as="span">{erVeileder ? "Veileder" : "Deltakers navn"}</BodyShort>}
                description={erVeileder ? undefined : <BodyShort as="span" size="small">Fornavn Etternavn</BodyShort>}
                value={rad.navn}
                onChange={(e) => oppdater(i, { navn: e.target.value })}
                error={feil[rad.id]?.navn}
              />
              {!erVeileder && (
                <>
                  <Combobox
                    id={deltakerRolleId(rad.id)}
                    size="small"
                    label={<BodyShort as="span">Deltakers rolle</BodyShort>}
                    description={<BodyShort as="span" size="small">Velg en eller flere</BodyShort>}
                    isMultiSelect
                    options={DELTAKER_ROLLER}
                    selectedOptions={rad.roller}
                    onToggleSelected={(valgt, erValgt) =>
                      oppdater(i, {
                        roller: DELTAKER_ROLLER.filter((r) => (r === valgt ? erValgt : rad.roller.includes(r))),
                      })
                    }
                    error={feil[rad.id]?.rolle}
                  />
                  <div className="sm:mt-[54px]">
                    <Button
                      type="button"
                      variant="tertiary"
                      size="small"
                      data-color="danger"
                      icon={<TrashIcon aria-hidden />}
                      aria-label={`Fjern deltaker ${i + 1}`}
                      onClick={() => slett(i)}
                    />
                  </div>
                </>
              )}
            </HGrid>
          );
        })}

        <div>
          <Button
            id="deltaker-legg-til"
            type="button"
            size="small"
            variant="secondary"
            icon={<PlusIcon aria-hidden />}
            onClick={leggTil}
          >
            Legg til flere deltakere
          </Button>
        </div>
        <ReadMore header="Om tolk som deltaker" size="small">
          Du kan trygt legge til tolk. Navnet på tolk vises ikke for andre enn Nav.
        </ReadMore>
        <div className="sr-only" aria-live="polite" role="status">
          {melding}
        </div>
      </VStack>
    </Fieldset>
  );
}
