"use client";

import { BodyLong, Button, DatePicker, ErrorSummary, Heading, Modal, Radio, RadioGroup, TextField, Textarea, useDatepicker } from "@navikt/ds-react";
import { FormEvent, useRef, useState } from "react";
import { AktivitetsKort } from "../types";
import { fraIsoDato, tilIsoDato } from "../mote/moteUtils";
import {
  IJOBB_INGRESS,
  IjobbFormFeil,
  IjobbFormVerdier,
  STILLINGSANDELER,
  validerIjobb,
} from "./ijobbUtils";

const CONFIRM = "Alle endringer blir borte hvis du ikke lagrer. Er du sikker på at du vil lukke siden?";

export interface IjobbLagreVerdier {
  tittel: string;
  startDato: string;
  sluttDato?: string;
  stillingsandel: string;
  arbeidsgiver?: string;
  ansettelsesforhold?: string;
  beskrivelse?: string;
}

interface Props {
  // Uten `kort` opprettes en ny aktivitet, ellers redigeres den eksisterende.
  kort?: AktivitetsKort;
  onLagre: (verdier: IjobbLagreVerdier) => void;
  onClose: () => void;
}

const FEILFELT_ID: Record<keyof IjobbFormFeil, string> = {
  tittel: "ijobb-tittel",
  fraDato: "ijobb-fra-dato",
  tilDato: "ijobb-til-dato",
  stillingsandel: "ijobb-stillingsandel",
  arbeidsgiver: "ijobb-arbeidsgiver",
  ansettelsesforhold: "ijobb-ansettelsesforhold",
  beskrivelse: "ijobb-beskrivelse",
};

export function IjobbFormModal({ kort, onLagre, onClose }: Props) {
  const erRedigering = !!kort;
  // Som i prod er feltene låst når aktiviteten er avtalt med Nav, bortsett fra til dato.
  const avtalt = kort?.avtalt ?? false;

  const startVerdier = {
    tittel: kort?.title ?? "",
    stillingsandel: kort?.stillingsandel ?? "",
    arbeidsgiver: kort?.arbeidsgiver ?? "",
    ansettelsesforhold: kort?.ansettelsesforhold ?? "",
    beskrivelse: kort?.beskrivelse ?? "",
  };

  const [tittel, setTittel] = useState(startVerdier.tittel);
  const [stillingsandel, setStillingsandel] = useState(startVerdier.stillingsandel);
  const [arbeidsgiver, setArbeidsgiver] = useState(startVerdier.arbeidsgiver);
  const [ansettelsesforhold, setAnsettelsesforhold] = useState(startVerdier.ansettelsesforhold);
  const [beskrivelse, setBeskrivelse] = useState(startVerdier.beskrivelse);
  const [visFeil, setVisFeil] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const fra = useDatepicker({ defaultSelected: kort?.startDato ? fraIsoDato(kort.startDato) : undefined });
  const til = useDatepicker({
    defaultSelected: kort?.sluttDato ? fraIsoDato(kort.sluttDato) : undefined,
    fromDate: fra.selectedDay,
  });

  const verdier: IjobbFormVerdier = {
    tittel,
    fraDato: fra.selectedDay,
    fraDatoInput: fra.inputProps.value?.toString() ?? "",
    tilDato: til.selectedDay,
    tilDatoInput: til.inputProps.value?.toString() ?? "",
    stillingsandel,
    arbeidsgiver,
    ansettelsesforhold,
    beskrivelse,
  };
  const feil = validerIjobb(verdier);
  const synligeFeil: IjobbFormFeil = visFeil ? feil : {};

  const erEndret =
    tittel !== startVerdier.tittel ||
    stillingsandel !== startVerdier.stillingsandel ||
    arbeidsgiver !== startVerdier.arbeidsgiver ||
    ansettelsesforhold !== startVerdier.ansettelsesforhold ||
    beskrivelse !== startVerdier.beskrivelse ||
    (fra.selectedDay ? tilIsoDato(fra.selectedDay) : undefined) !== kort?.startDato ||
    (til.selectedDay ? tilIsoDato(til.selectedDay) : undefined) !== kort?.sluttDato;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (Object.keys(feil).length > 0) {
      setVisFeil(true);
      // Fokus flyttes etter at oppsummeringen er rendret.
      setTimeout(() => errorSummaryRef.current?.focus(), 0);
      return;
    }
    onLagre({
      tittel,
      startDato: tilIsoDato(fra.selectedDay!),
      sluttDato: til.selectedDay ? tilIsoDato(til.selectedDay) : undefined,
      stillingsandel,
      arbeidsgiver: arbeidsgiver || undefined,
      ansettelsesforhold: ansettelsesforhold || undefined,
      beskrivelse: beskrivelse || undefined,
    });
  };

  const feilListe = (Object.keys(FEILFELT_ID) as (keyof IjobbFormFeil)[]).filter((k) => synligeFeil[k]);

  return (
    <Modal
      open
      onClose={onClose}
      onBeforeClose={() => !erEndret || window.confirm(CONFIRM)}
      aria-labelledby="modal-heading"
      className="min-[992px]:w-[40rem]"
    >
      <Modal.Header closeButton>
        <Heading id="modal-heading" size="large">
          {erRedigering ? "Endre aktivitet" : "Jobb jeg har nå"}
        </Heading>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col max-w-2xl mx-auto">
          <article>
            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <div className="space-y-8">
                <div className="mb-8 mt-4">
                  <section className="mt-4">
                    <BodyLong>{IJOBB_INGRESS}</BodyLong>
                  </section>
                </div>

                <TextField
                  id={FEILFELT_ID.tittel}
                  disabled={avtalt}
                  label="Stillingstittel (obligatorisk)"
                  value={tittel}
                  onChange={(e) => setTittel(e.target.value)}
                  error={synligeFeil.tittel}
                />

                <div className="grid grid-cols-2">
                  <div className="flex">
                    <DatePicker {...fra.datepickerProps}>
                      <DatePicker.Input
                        {...fra.inputProps}
                        id={FEILFELT_ID.fraDato}
                        disabled={avtalt}
                        className="flex-1"
                        label="Fra dato (obligatorisk)"
                        error={synligeFeil.fraDato}
                      />
                    </DatePicker>
                  </div>
                  <div className="flex">
                    <DatePicker {...til.datepickerProps}>
                      <DatePicker.Input
                        {...til.inputProps}
                        id={FEILFELT_ID.tilDato}
                        className="flex-1"
                        label="Til dato (valgfri)"
                        error={synligeFeil.tilDato}
                      />
                    </DatePicker>
                  </div>
                </div>

                <RadioGroup
                  id={FEILFELT_ID.stillingsandel}
                  disabled={avtalt}
                  legend="Stillingsandel (obligatorisk)"
                  value={stillingsandel}
                  onChange={setStillingsandel}
                  error={synligeFeil.stillingsandel}
                >
                  {STILLINGSANDELER.map((s) => (
                    <Radio key={s} value={s}>
                      {s}
                    </Radio>
                  ))}
                </RadioGroup>

                <TextField
                  id={FEILFELT_ID.arbeidsgiver}
                  disabled={avtalt}
                  label="Arbeidsgiver (valgfri)"
                  value={arbeidsgiver}
                  onChange={(e) => setArbeidsgiver(e.target.value)}
                  error={synligeFeil.arbeidsgiver}
                />

                <TextField
                  id={FEILFELT_ID.ansettelsesforhold}
                  disabled={avtalt}
                  label="Ansettelsesforhold (valgfri)"
                  description="For eksempel fast, midlertidig, vikariat"
                  value={ansettelsesforhold}
                  onChange={(e) => setAnsettelsesforhold(e.target.value)}
                  error={synligeFeil.ansettelsesforhold}
                />

                <Textarea
                  id={FEILFELT_ID.beskrivelse}
                  disabled={avtalt}
                  label="Kort beskrivelse av stillingen (valgfri)"
                  description="For eksempel dag, kveld, helg, stillingsprosent eller oppgaver"
                  maxLength={5000}
                  value={beskrivelse}
                  onChange={(e) => setBeskrivelse(e.target.value)}
                  error={synligeFeil.beskrivelse}
                />

                {feilListe.length > 0 && (
                  <ErrorSummary ref={errorSummaryRef} heading="For å gå videre må du rette opp følgende:">
                    {feilListe.map((k) => (
                      <ErrorSummary.Item key={k} href={`#${FEILFELT_ID[k]}`}>
                        {synligeFeil[k]}
                      </ErrorSummary.Item>
                    ))}
                  </ErrorSummary>
                )}

                <Button type="submit" className="mt-4">
                  Lagre
                </Button>
              </div>
            </form>
          </article>
        </div>
      </Modal.Body>
    </Modal>
  );
}
