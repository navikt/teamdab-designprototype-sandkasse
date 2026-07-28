"use client";

import { useState } from "react";
import Link from "next/link";
import { Checkbox, Table, Tag } from "@navikt/ds-react";

// Testdata: fiktive navn bygget som ord-kombinasjoner (substantiv, adjektiv)
// i stedet for egennavn, for å unngå tilfeldig sammenfall med virkelige
// personer. Fnr-verdiene har dag-del "00", som aldri forekommer i et ekte
// fødselsnummer eller D-/synthetisk nummer, slik at de aldri kan feiltolkes
// som reelle.
const data = [
  {
    id: "1",
    navn: "Kunnskap, Fattig",
    fnr: "00010112345",
    veileder: "Vidde, Rolig",
    navIdent: "Z123456",
    utlopsdato: "12.07.2026",
    status: "Ikke lengre arbeidssøker",
  },
  {
    id: "2",
    navn: "Avstand, Oversiktlig",
    fnr: "00020123456",
    veileder: "Retning, Stødig",
    navIdent: "Z234567",
    utlopsdato: "03.08.2026",
    status: "Ikke lengre arbeidssøker",
  },
  {
    id: "3",
    navn: "Utsikt, Stille",
    fnr: "00030134567",
    veileder: "Vidde, Rolig",
    navIdent: "Z123456",
    utlopsdato: "19.06.2026",
    status: "Ikke lengre arbeidssøker",
  },
  {
    id: "4",
    navn: "Balanse, Skarp",
    fnr: "00040145678",
    veileder: "Utvikling, Klar",
    navIdent: "Z345678",
    utlopsdato: "28.07.2026",
    status: "Ikke lengre arbeidssøker",
  },
  {
    id: "5",
    navn: "Rutine, Åpen",
    fnr: "00050156789",
    veileder: "Retning, Stødig",
    navIdent: "Z234567",
    utlopsdato: "15.09.2026",
    status: "Ikke lengre arbeidssøker",
  },
];

export function BrukerTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleRow = (id: string) =>
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );

  const allSelected = selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && !allSelected;

  return (
    <div>
    <Table zebraStripes size="medium" className="bg-[var(--ax-bg-default,white)]">
      <Table.Header style={{ background: "var(--ax-bg-neutral-soft)" }}>
        <Table.Row style={{ background: "var(--ax-bg-neutral-soft)" }}>
          <Table.HeaderCell textSize="small">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={() =>
                setSelectedRows(allSelected ? [] : data.map((d) => d.id))
              }
              hideLabel
            >
              Velg alle
            </Checkbox>
          </Table.HeaderCell>
          <Table.ColumnHeader scope="col" textSize="small" style={{ fontWeight: "normal" }}>Etternavn, fornavn</Table.ColumnHeader>
          <Table.ColumnHeader scope="col" textSize="small" style={{ fontWeight: "normal" }}>Fødselsnr.</Table.ColumnHeader>
          <Table.ColumnHeader scope="col" textSize="small" style={{ fontWeight: "normal" }}>Veileder</Table.ColumnHeader>
          <Table.ColumnHeader scope="col" textSize="small" style={{ fontWeight: "normal" }}>Nav-ident</Table.ColumnHeader>
          <Table.ColumnHeader scope="col" textSize="small" style={{ fontWeight: "normal" }}>Neste utløpsdato aktivitet</Table.ColumnHeader>
          <Table.ColumnHeader scope="col" textSize="small" style={{ fontWeight: "normal" }}>Status</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((bruker) => (
          <Table.Row key={bruker.id} selected={selectedRows.includes(bruker.id)}>
            <Table.DataCell textSize="small">
              <Checkbox
                hideLabel
                checked={selectedRows.includes(bruker.id)}
                onChange={() => toggleRow(bruker.id)}
                aria-labelledby={`navn-${bruker.id}`}
              >
                {" "}
              </Checkbox>
            </Table.DataCell>
            <Table.DataCell textSize="small">
              <Link
                id={`navn-${bruker.id}`}
                href={`/personprofil?navn=${encodeURIComponent(bruker.navn)}`}
                className="text-blue-600 hover:underline"
              >
                {bruker.navn}
              </Link>
            </Table.DataCell>
            <Table.DataCell textSize="small">{bruker.fnr}</Table.DataCell>
            <Table.DataCell textSize="small">{bruker.veileder}</Table.DataCell>
            <Table.DataCell textSize="small">{bruker.navIdent}</Table.DataCell>
            <Table.DataCell textSize="small">{bruker.utlopsdato}</Table.DataCell>
            <Table.DataCell textSize="small">
              <Tag variant="outline" data-color="info" size="small">
                {bruker.status}
              </Tag>
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
    </div>
  );
}
