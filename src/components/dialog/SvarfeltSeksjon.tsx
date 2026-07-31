"use client";

import { useState } from "react";
import { BodyShort, Button, Checkbox, CheckboxGroup, Textarea } from "@navikt/ds-react";
import { DemoDialog } from "./dialogData";

interface Props {
  dialog: DemoDialog;
  onSend: (tekst: string) => void;
}

export function SvarfeltSeksjon({ dialog, onSend }: Props) {
  const [tekst, setTekst] = useState("");
  const [venterPaSvar, setVenterPaSvar] = useState(dialog.venterPaSvar);
  const [ferdigBehandlet, setFerdigBehandlet] = useState(dialog.ferdigBehandlet);
  const [kladdLagret, setKladdLagret] = useState(false);

  const checkboxVerdier: string[] = [
    ...(!ferdigBehandlet ? ["ferdigBehandlet"] : []),
    ...(venterPaSvar ? ["venterPaSvar"] : []),
  ];

  const handleTekstEndring = (verdi: string) => {
    setTekst(verdi);
    setKladdLagret(verdi.length > 0);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tekst.trim()) return;
    onSend(tekst.trim());
    setTekst("");
    setKladdLagret(false);
  };

  return (
    <section aria-label="Ny melding" className="flex flex-1 bg-white p-4">
      <div className="w-full flex flex-col">
        <div className="mb-2">
          <CheckboxGroup legend="Filter" hideLegend value={checkboxVerdier}>
            <div className="flex gap-4">
              <Checkbox
                value="ferdigBehandlet"
                size="small"
                className="pr-4"
                onChange={() => setFerdigBehandlet((v) => !v)}
              >
                Venter på svar fra Nav
              </Checkbox>
              <Checkbox
                value="venterPaSvar"
                size="small"
                className="pr-8"
                onChange={() => setVenterPaSvar((v) => !v)}
              >
                Venter på svar fra bruker
              </Checkbox>
            </div>
          </CheckboxGroup>
        </div>

        <form className="flex flex-1 flex-col overflow-hidden" onSubmit={handleSend} noValidate autoComplete="off">
          <div className="overflow-hidden flex flex-col">
            <Textarea
              label="Skriv om arbeid og oppfølging"
              hideLabel
              placeholder="Skriv om arbeid og oppfølging"
              value={tekst}
              onChange={(e) => handleTekstEndring(e.target.value)}
              minRows={3}
              maxRows={100}
              maxLength={5000}
            />
            <div className="self-stretch mt-2 flex justify-between items-end">
              <Button size="small" type="submit">
                Send
              </Button>
              {kladdLagret && (
                <BodyShort textColor="subtle" size="small">
                  Kladd lagret
                </BodyShort>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
