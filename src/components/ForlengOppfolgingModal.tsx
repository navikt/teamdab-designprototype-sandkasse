"use client";

import { ClockDashedIcon } from "@navikt/aksel-icons";
import {
  Accordion,
  BodyShort,
  Button,
  DatePicker,
  Detail,
  ErrorSummary,
  HelpText,
  Link,
  Modal,
  Tag,
  useDatepicker,
} from "@navikt/ds-react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { Merkelapp } from "@/data/brukere";

interface ForlengOppfolgingModalProps {
  open: boolean;
  onClose: () => void;
  onBekreft: () => void;
  status?: string;
  merkelapper?: Merkelapp[];
}

export function ForlengOppfolgingModal({ open, onClose, onBekreft, status, merkelapper }: ForlengOppfolgingModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const today = new Date();
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 14);

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);

  const { datepickerProps, inputProps, selectedDay, reset: resetDatepicker } = useDatepicker({
    defaultSelected: defaultDate,
    fromDate: today,
    toDate: maxDate,
  });

  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const errors = [
    ...(submitted && !selectedDay ? [{ id: "forleng-dato", message: "Velg en dato" }] : []),
  ];

  function resetForm() {
    setSubmitted(false);
    resetDatepicker();
  }

  function handleBekreft() {
    flushSync(() => setSubmitted(true));

    if (!selectedDay) {
      errorSummaryRef.current?.focus();
      return;
    }
    onBekreft();
    resetForm();
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} header={{ heading: "Forleng arbeidsrettet oppfølging" }}>
      <Modal.Body className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2" aria-label="Status og merkelapper">
          {status && <Tag variant="warning" size="small">{status}</Tag>}
          {merkelapper?.map((m) => (
            <Tag key={m.tekst} variant={m.variant} size="small">{m.tekst}</Tag>
          ))}
        </div>

        {errors.length > 0 && (
          <ErrorSummary ref={errorSummaryRef} heading="Du må rette disse feilene">
            {errors.map((e) => (
              <ErrorSummary.Item key={e.id} href={`#${e.id}`}>
                {e.message}
              </ErrorSummary.Item>
            ))}
          </ErrorSummary>
        )}

        <DatePicker {...datepickerProps}>
          <DatePicker.Input
            {...inputProps}
            id="forleng-dato"
            label={
              <span className="flex items-center gap-1">
                Velg når personen igjen skal bli kandidat for avslutning
                <HelpText title="Forklaring">
                  På valgt dato legges personen igjen i filteret «Kandidater for avslutning (fase 1)». Du kan velge en dato inntil 6 måneder frem i tid. 
                </HelpText>
              </span>
            }
            required
            error={submitted && !selectedDay ? "Velg en dato" : undefined}
          />
        </DatePicker>

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
