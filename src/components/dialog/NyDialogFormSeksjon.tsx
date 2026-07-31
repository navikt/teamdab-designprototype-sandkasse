"use client";

import { useState } from "react";
import { BodyShort, Button, Checkbox, GuidePanel, Textarea, TextField } from "@navikt/ds-react";

interface Props {
  onSend: (tema: string, melding: string, venterPaSvar: boolean) => void;
  onAvbryt: () => void;
}

export function NyDialogFormSeksjon({ onSend, onAvbryt }: Props) {
  const [tema, setTema] = useState("");
  const [melding, setMelding] = useState("");
  const [venterPaSvar, setVenterPaSvar] = useState(false);
  const [temaFeil, setTemaFeil] = useState<string | undefined>();
  const [meldingFeil, setMeldingFeil] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const temaFeilmelding = !tema.trim() ? "Du må skrive et tema for dialogen" : undefined;
    const meldingFeilmelding = !melding.trim() ? "Du må skrive en melding" : undefined;
    setTemaFeil(temaFeilmelding);
    setMeldingFeil(meldingFeilmelding);
    if (temaFeilmelding || meldingFeilmelding) return;
    onSend(tema.trim(), melding.trim(), venterPaSvar);
  };

  return (
    <div className="relative h-full w-full overflow-y-auto bg-ax-bg-sunken">
      <form className="space-y-8 p-8 max-w-[575px]" onSubmit={handleSubmit} noValidate autoComplete="off">
        <GuidePanel>
          <BodyShort>
            Her kan du skrive til bruker om arbeid og oppfølging.
          </BodyShort>
        </GuidePanel>

        <TextField
          label="Tema (obligatorisk)"
          description="Skriv kort hva dialogen skal handle om"
          value={tema}
          onChange={(e) => { setTema(e.target.value); setTemaFeil(undefined); }}
          error={temaFeil}
          maxLength={100}
        />

        <Textarea
          label="Melding (obligatorisk)"
          description="Skriv om arbeid og oppfølging"
          value={melding}
          onChange={(e) => { setMelding(e.target.value); setMeldingFeil(undefined); }}
          error={meldingFeil}
          maxLength={5000}
        />

        <Checkbox
          value="venterPaSvar"
          size="small"
          className="pr-8"
          checked={venterPaSvar}
          onChange={() => setVenterPaSvar((v) => !v)}
        >
          Venter på svar fra bruker
        </Checkbox>

        <div className="flex flex-row gap-x-4">
          <Button size="small" type="submit">
            Send
          </Button>
          <Button size="small" variant="tertiary" type="button" onClick={onAvbryt}>
            Avbryt
          </Button>
        </div>
      </form>
    </div>
  );
}
