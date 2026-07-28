"use client";

import { useState } from "react";
import { ClockDashedIcon } from "@navikt/aksel-icons";
import {
  Accordion,
  BodyShort,
  Button,
  Link,
  Modal,
  Select,
  Tag,
  Textarea,
} from "@navikt/ds-react";

interface ForlengOppfolgingModalProps {
  open: boolean;
  onClose: () => void;
  onBekreft: () => void;
}

export function ForlengOppfolgingModal({ open, onClose, onBekreft }: ForlengOppfolgingModalProps) {
  const [days, setDays] = useState(30);
  const [begrunnelse, setBegrunnelse] = useState("");
  const [begrunnelseFritext, setBegrunnelseFritext] = useState("");

  const forlengDato = new Date();
  forlengDato.setDate(forlengDato.getDate() + days);
  const datoStr = forlengDato.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Modal open={open} onClose={onClose} header={{ heading: "Forleng oppfølging" }} width="medium">
      <Modal.Body className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Tag variant="info" size="small">Ikke lengre arbeidssøker</Tag>
          <Tag variant="info" size="small">Ikke lovlig opphold</Tag>
          <Tag variant="info" size="small">Død</Tag>
        </div>

        <Link href="#">Gå til aktivitetsplan</Link>

        <div className="flex items-end gap-8">
          <Select label="Forlengelsesperiode" className="w-40" value={String(days)} onChange={(e) => setDays(Number(e.target.value))}>
            <option value="14">14 dager</option>
            <option value="30">30 dager</option>
            <option value="60">60 dager</option>
            <option value="90">90 dager</option>
          </Select>
          <BodyShort className="mb-2">Oppfølging forlenges til {datoStr}</BodyShort>
        </div>

        <Select label="Begrunnelse" value={begrunnelse} onChange={(e) => setBegrunnelse(e.target.value)}>
          <option value="">[forhåndsdefinert årsak]</option>
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
