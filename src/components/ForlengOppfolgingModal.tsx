"use client";

import { ClockDashedIcon } from "@navikt/aksel-icons";
import {
  Accordion,
  BodyShort,
  Button,
  DatePicker,
  HStack,
  Link,
  Modal,
  Select,
  Tag,
  Textarea,
  useDatepicker,
} from "@navikt/ds-react";
import { useState } from "react";

import { Merkelapp } from "@/data/brukere";

interface ForlengOppfolgingModalProps {
  open: boolean;
  onClose: () => void;
  onBekreft: () => void;
  status?: string;
  merkelapper?: Merkelapp[];
}

const PRESETS = [14, 30, 60, 90];

function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function ForlengOppfolgingModal({ open, onClose, onBekreft, status, merkelapper }: ForlengOppfolgingModalProps) {
  const [begrunnelse, setBegrunnelse] = useState("");
  const [begrunnelseFritext, setBegrunnelseFritext] = useState("");

  const { datepickerProps, inputProps, setSelected, selectedDay } = useDatepicker({
    defaultSelected: addDays(30),
    fromDate: new Date(),
  });

  return (
    <Modal open={open} onClose={onClose} header={{ heading: "Forleng oppfølging" }} width="medium">
      <Modal.Body className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {status && <Tag variant="info" size="small">{status}</Tag>}
          {merkelapper?.map((m) => (
            <Tag key={m.tekst} variant={m.variant} size="small">{m.tekst}</Tag>
          ))}
        </div>

        <Link href="#">Gå til aktivitetsplan</Link>

        <div className="flex flex-col gap-2">
          <DatePicker {...datepickerProps}>
            <DatePicker.Input {...inputProps} label="Forleng til dato" description="Format: dd.mm.åååå" />
          </DatePicker>
          <HStack gap="space-2">
            {PRESETS.map((days) => {
              const presetDate = addDays(days);
              const isActive = selectedDay != null && isSameDay(selectedDay, presetDate);
              return (
                <Button key={days} variant={isActive ? "primary" : "secondary"} size="small" onClick={() => setSelected(presetDate)}>
                  {days} dager
                </Button>
              );
            })}
          </HStack>
        </div>

        <Select label="Begrunnelse" value={begrunnelse} onChange={(e) => setBegrunnelse(e.target.value)}>
          <option value="" disabled hidden>Velg begrunnelse</option>
          <option value="arsak1">Årsak 1</option>
          <option value="arsak2">Årsak 2</option>
          <option value="arsak3">Årsak 3</option>
          <option value="arsak4">Årsak 4</option>
          <option value="annet">Annet</option>
        </Select>

        {begrunnelse === "annet" && (
          <Textarea
            label="Beskriv begrunnelsen"
            value={begrunnelseFritext}
            onChange={(e) => setBegrunnelseFritext(e.target.value)}
            maxLength={500}
          />
        )}

        <Accordion>
          <Accordion.Item>
            <Accordion.Header>
              <span className="flex items-center gap-2">
                <ClockDashedIcon aria-hidden />
                Historikk
              </span>
            </Accordion.Header>
            <Accordion.Content>
              <BodyShort>Ingen historikk tilgjengelig.</BodyShort>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" size="small" onClick={onBekreft}>Bekreft</Button>
        <Button variant="secondary" size="small" onClick={onClose}>Avbryt</Button>
      </Modal.Footer>
    </Modal>
  );
}
