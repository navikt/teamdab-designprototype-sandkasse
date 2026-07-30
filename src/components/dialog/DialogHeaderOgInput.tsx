"use client";

import { Heading, Textarea, Button, Checkbox, HStack } from "@navikt/ds-react";
import { useState } from "react";
import { Dialog } from "./mockDialoger";

interface HeaderProps {
  dialog: Dialog;
  onToggleVenterPaSvar: () => void;
  onToggleFerdigBehandlet: () => void;
}

export function DialogHeader({ dialog, onToggleVenterPaSvar, onToggleFerdigBehandlet }: HeaderProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-ax-border-neutral-subtle bg-white px-4 py-3">
      <Heading level="2" size="small">
        {dialog.overskrift}
      </Heading>
      <HStack gap="4">
        <Checkbox
          size="small"
          checked={dialog.venterPaSvar}
          onChange={onToggleVenterPaSvar}
        >
          Venter på svar fra bruker
        </Checkbox>
        <Checkbox
          size="small"
          checked={dialog.ferdigBehandlet}
          onChange={onToggleFerdigBehandlet}
        >
          Ferdig behandlet
        </Checkbox>
      </HStack>
    </div>
  );
}

interface InputProps {
  onSend: (tekst: string) => void;
  disabled?: boolean;
}

export function MeldingInput({ onSend, disabled }: InputProps) {
  const [tekst, setTekst] = useState("");

  const handleSend = () => {
    if (!tekst.trim()) return;
    onSend(tekst.trim());
    setTekst("");
  };

  return (
    <div className="border-t border-ax-border-neutral-subtle bg-white p-3">
      <Textarea
        label="Skriv en melding"
        hideLabel
        placeholder="Skriv en melding til bruker..."
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
        minRows={2}
        maxRows={6}
        disabled={disabled}
      />
      <div className="mt-2 flex justify-end">
        <Button
          size="small"
          onClick={handleSend}
          disabled={disabled || !tekst.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
