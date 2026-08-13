"use client";

import { ClockDashedIcon } from "@navikt/aksel-icons";
import {
  Accordion,
  BodyShort,
  Button,
  DatePicker,
  Detail,
  Link,
  Modal,
  Radio,
  RadioGroup,
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

export function ForlengOppfolgingModal({ open, onClose, onBekreft, status, merkelapper }: ForlengOppfolgingModalProps) {
  const [begrunnelse, setBegrunnelse] = useState("");
  const [forlengType, setForlengType] = useState<"ubestemt" | "dato">("ubestemt");
  const [submitted, setSubmitted] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 14);

  const { datepickerProps, inputProps, selectedDay } = useDatepicker({
    defaultSelected: defaultDate,
    fromDate: new Date(),
  });

  function resetForm() {
    setBegrunnelse("");
    setForlengType("ubestemt");
    setSubmitted(false);
    setFormKey((k) => k + 1);
  }

  function handleBekreft() {
    setSubmitted(true);
    if (forlengType === "dato" && !selectedDay) return;
    if (!begrunnelse.trim()) return;
    onBekreft();
    resetForm();
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} header={{ heading: "Forleng arbeidsrettet oppfølging" }} width="medium">
      <Modal.Body className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {status && <Tag variant="warning" size="small">{status}</Tag>}
          {merkelapper?.map((m) => (
            <Tag key={m.tekst} variant={m.variant} size="small">{m.tekst}</Tag>
          ))}
        </div>

        <RadioGroup
          legend="Forlengelsestype"
          value={forlengType}
          onChange={(v) => {
            if (v === "ubestemt" || v === "dato") setForlengType(v);
          }}
        >
          <Radio value="ubestemt">Forleng oppfølging på ubestemt tid</Radio>
          <Radio value="dato">Forleng oppfølging til en dato</Radio>
        </RadioGroup>

        {forlengType === "dato" && (
          <DatePicker key={formKey} {...datepickerProps}>
            <DatePicker.Input {...inputProps} label="Forleng til dato" required error={submitted && !selectedDay ? "Velg en dato" : undefined} />
          </DatePicker>
        )}

        <Textarea
          label="Begrunnelse"
          value={begrunnelse}
          onChange={(e) => setBegrunnelse(e.target.value)}
          maxLength={200}
          error={submitted && !begrunnelse.trim() ? "Begrunnelse er påkrevd" : undefined}
        />

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
        <Button variant="primary" size="small" onClick={handleBekreft}>Bekreft</Button>
        <Button variant="secondary" size="small" onClick={handleClose}>Avbryt</Button>
        <Detail className="text-ax-text-neutral self-end ml-auto text-right flex-1">
          Forlengelse registrerer <strong>ikke</strong> personen som arbeidssøker.{" "}
          <Link href="#" onClick={(e) => e.preventDefault()}>Gå til arbeidssøkerregisteret</Link>
        </Detail>
      </Modal.Footer>
    </Modal>
  );
}
