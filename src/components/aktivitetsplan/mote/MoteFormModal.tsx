"use client";

import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { BodyShort, Button, DatePicker, ErrorSummary, Link, Modal, Select, TextField, Textarea, useDatepicker } from "@navikt/ds-react";
import { FormEvent, useRef, useState } from "react";
import { AktivitetsKort, Deltaker, MoteForm } from "../types";
import { DeltakereFelt, deltakerNavnId, deltakerRolleId } from "./DeltakereFelt";
import {
  HILSEN_TEKST,
  MOTEFORMER,
  MOTE_INGRESS,
  MoteFormFeil,
  DeltakerRad,
  DeltakerRadFeil,
  MoteFormVerdier,
  VARIGHETER,
  VEILEDER_NAVN,
  VEILEDER_RAD_ID,
  fraIsoDato,
  raderTilDeltakere,
  tilIsoDato,
  validerDeltakerRad,
  validerMote,
  visningsNavn,
} from "./moteUtils";

const CONFIRM = "Alle endringer blir borte hvis du ikke lagrer. Er du sikker på at du vil lukke siden?";

interface Props {
  // Uten `kort` opprettes et nytt møte, ellers redigeres det eksisterende.
  kort?: AktivitetsKort;
  brukerNavn: string;
  brukerFnr?: string;
  onLagre: (verdier: { tittel: string; startDato: string; klokkeslett: string; varighetMinutter: number; moteform: MoteForm; moteSted: string; deltakere: Deltaker[]; hensikt: string; forberedelser: string }) => void;
  onClose: () => void;
}

const FEILFELT_ID: Record<keyof MoteFormFeil, string> = {
  tittel: "mote-tittel",
  dato: "mote-dato",
  klokkeslett: "mote-klokkeslett",
  varighet: "mote-varighet",
  kanal: "mote-kanal",
  adresse: "mote-adresse",
  beskrivelse: "mote-beskrivelse",
  forberedelser: "mote-forberedelser",
};

export function MoteFormModal({ kort, brukerNavn, brukerFnr, onLagre, onClose }: Props) {
  const erRedigering = !!kort;
  const iDag = new Date();
  iDag.setHours(0, 0, 0, 0);

  const startVerdier = {
    tittel: kort?.title ?? "",
    klokkeslett: kort?.klokkeslett ?? "",
    varighet: kort?.varighetMinutter ? String(kort.varighetMinutter) : "",
    kanal: kort?.moteform ?? "",
    adresse: kort?.moteSted ?? "",
    beskrivelse: kort?.hensikt ?? HILSEN_TEKST,
    forberedelser: kort?.forberedelser ?? "",
  };
  const startDato = kort?.startDato;
  const veilederStart: Deltaker = { navn: visningsNavn(VEILEDER_NAVN), rolle: "Veileder" };
  const eksisterende = kort?.deltakere ?? [];
  const veilederIndeks = eksisterende.findIndex((d) => d.rolle === "Veileder");
  // Veileder ligger alltid først, også for eldre kort uten veileder.
  const startDeltakereListe: Deltaker[] =
    veilederIndeks === -1
      ? [veilederStart, ...eksisterende]
      : [eksisterende[veilederIndeks], ...eksisterende.filter((_, i) => i !== veilederIndeks)];

  const [tittel, setTittel] = useState(startVerdier.tittel);
  const [klokkeslett, setKlokkeslett] = useState(startVerdier.klokkeslett);
  const [varighet, setVarighet] = useState(startVerdier.varighet);
  const [kanal, setKanal] = useState<string>(startVerdier.kanal);
  const [adresse, setAdresse] = useState(startVerdier.adresse);
  const [beskrivelse, setBeskrivelse] = useState(startVerdier.beskrivelse);
  const [forberedelser, setForberedelser] = useState(startVerdier.forberedelser);
  const [deltakerRader, setDeltakerRader] = useState<DeltakerRad[]>(() =>
    startDeltakereListe.map((d, i) => ({ id: i === 0 ? VEILEDER_RAD_ID : `eksisterende-${i}`, navn: d.navn, rolle: d.rolle })),
  );
  const [visFeil, setVisFeil] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const { datepickerProps, inputProps, selectedDay } = useDatepicker({
    defaultSelected: startDato ? fraIsoDato(startDato) : undefined,
    fromDate: iDag,
  });

  const verdier: MoteFormVerdier = {
    tittel,
    dato: selectedDay,
    datoInput: inputProps.value?.toString() ?? "",
    klokkeslett,
    varighet,
    kanal,
    adresse,
    beskrivelse,
    forberedelser,
  };
  const feil = validerMote(verdier);
  const radFeil: Record<string, DeltakerRadFeil> = {};
  deltakerRader.forEach((r) => {
    const f = validerDeltakerRad(r);
    if (f.navn || f.rolle) radFeil[r.id] = f;
  });
  const synligeFeil: MoteFormFeil = visFeil ? feil : {};
  const synligeRadFeil = visFeil ? radFeil : {};
  const startDeltakere = JSON.stringify(startDeltakereListe);

  const erEndret =
    tittel !== startVerdier.tittel ||
    klokkeslett !== startVerdier.klokkeslett ||
    varighet !== startVerdier.varighet ||
    kanal !== startVerdier.kanal ||
    adresse !== startVerdier.adresse ||
    beskrivelse !== startVerdier.beskrivelse ||
    forberedelser !== startVerdier.forberedelser ||
    JSON.stringify(raderTilDeltakere(deltakerRader)) !== startDeltakere ||
    (selectedDay ? tilIsoDato(selectedDay) : undefined) !== startDato;

  const lukk = () => {
    if (!erEndret || window.confirm(CONFIRM)) onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (Object.keys(feil).length > 0 || Object.keys(radFeil).length > 0) {
      setVisFeil(true);
      // Fokus flyttes etter at oppsummeringen er rendret.
      setTimeout(() => errorSummaryRef.current?.focus(), 0);
      return;
    }
    onLagre({
      tittel: tittel.trim(),
      startDato: tilIsoDato(selectedDay!),
      klokkeslett,
      varighetMinutter: Number(varighet),
      moteform: kanal as MoteForm,
      moteSted: adresse.trim(),
      deltakere: raderTilDeltakere(deltakerRader),
      hensikt: beskrivelse,
      forberedelser: forberedelser.trim(),
    });
  };

  const feilListe = (Object.keys(synligeFeil) as (keyof MoteFormFeil)[]).filter((k) => synligeFeil[k]);
  const radFeilListe = deltakerRader.flatMap((r) => [
    ...(synligeRadFeil[r.id]?.navn ? [{ href: deltakerNavnId(r.id), tekst: synligeRadFeil[r.id].navn! }] : []),
    ...(synligeRadFeil[r.id]?.rolle ? [{ href: deltakerRolleId(r.id), tekst: synligeRadFeil[r.id].rolle! }] : []),
  ]);

  return (
    <Modal open onClose={lukk} header={{ heading: erRedigering ? "Endre aktivitet" : "Møte med Nav" }} width="680px">
      <Modal.Body>
        <BodyShort style={{ marginBottom: 28 }}>{MOTE_INGRESS}</BodyShort>
        <form onSubmit={handleSubmit} noValidate className="space-y-8">

          <TextField
            id="mote-tittel"
            label="Tema for møtet (obligatorisk)"
            value={tittel}
            onChange={(e) => setTittel(e.target.value)}
            error={synligeFeil.tittel}
            maxLength={100}
          />

          <div className="flex sm:flex-row flex-col gap-4">
            <DatePicker {...datepickerProps}>
              <DatePicker.Input
                {...inputProps}
                id="mote-dato"
                label="Dato (obligatorisk)"
                error={synligeFeil.dato}
              />
            </DatePicker>
            <TextField
              id="mote-klokkeslett"
              label="Klokkeslett (obligatorisk)"
              type="time"
              value={klokkeslett}
              onChange={(e) => setKlokkeslett(e.target.value)}
              error={synligeFeil.klokkeslett}
            />
          </div>

          <div>
            <DeltakereFelt rader={deltakerRader} onChange={setDeltakerRader} brukerNavn={brukerNavn} brukerFnr={brukerFnr} feil={synligeRadFeil} />
          </div>

          <Select
            id="mote-varighet"
            label="Varighet (obligatorisk)"
            value={varighet}
            onChange={(e) => setVarighet(e.target.value)}
            error={synligeFeil.varighet}
          >
            <option value="">Velg varighet</option>
            {VARIGHETER.map((v) => (
              <option key={v.minutter} value={v.minutter}>
                {v.tekst}
              </option>
            ))}
          </Select>

          <Select
            id="mote-kanal"
            label="Møteform (obligatorisk)"
            value={kanal}
            onChange={(e) => setKanal(e.target.value)}
            error={synligeFeil.kanal}
          >
            <option value="">Velg møteform</option>
            {MOTEFORMER.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>

          {kanal === "Videomøte" && (
            <BodyShort>
              Les om{" "}
              <Link href="#" target="_blank" rel="noopener noreferrer">
                rutiner for videomøte her <ExternalLinkIcon aria-hidden />
              </Link>
            </BodyShort>
          )}

          <TextField
            id="mote-adresse"
            label="Møtested eller annen praktisk informasjon (obligatorisk)"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            error={synligeFeil.adresse}
            maxLength={255}
          />

          <Textarea
            id="mote-beskrivelse"
            label="Hensikt med møtet (obligatorisk)"
            value={beskrivelse}
            onChange={(e) => setBeskrivelse(e.target.value)}
            error={synligeFeil.beskrivelse}
            maxLength={5000}
          />

          <Textarea
            id="mote-forberedelser"
            label="Forberedelser til møtet (valgfri)"
            value={forberedelser}
            onChange={(e) => setForberedelser(e.target.value)}
            maxLength={500}
          />

          {(feilListe.length > 0 || radFeilListe.length > 0) && (
            <ErrorSummary ref={errorSummaryRef} heading="For å gå videre må du rette opp følgende:">
              {feilListe.map((k) => (
                <ErrorSummary.Item key={k} href={`#${FEILFELT_ID[k]}`}>
                  {synligeFeil[k]}
                </ErrorSummary.Item>
              ))}
              {radFeilListe.map((f) => (
                <ErrorSummary.Item key={f.href} href={`#${f.href}`}>
                  {f.tekst}
                </ErrorSummary.Item>
              ))}
            </ErrorSummary>
          )}

          <Button type="submit" className="mt-4">
            Lagre
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
