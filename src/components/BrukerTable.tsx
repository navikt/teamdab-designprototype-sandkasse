"use client";

import { useState } from "react";
import { Checkbox, Table, Tag } from "@navikt/ds-react";

const data = [
  {
    id: "1",
    navn: "Jakobsen, Markus",
    fnr: "03999265463",
    veileder: "Andersen, Kari",
    navIdent: "Z123456",
    utlopsdato: "12.07.2026",
    status: "Ikke lengre arbeidssøker",
  },
  {
    id: "2",
    navn: "Halvorsen, Mari",
    fnr: "16993634134",
    veileder: "Bjørnstad, Per",
    navIdent: "Z234567",
    utlopsdato: "03.08.2026",
    status: "Ikke lengre arbeidssøker",
  },
  {
    id: "3",
    navn: "Christiansen, Mathias",
    fnr: "18994441438",
    veileder: "Andersen, Kari",
    navIdent: "Z123456",
    utlopsdato: "19.06.2026",
    status: "Ikke lengre arbeidssøker",
  },
  {
    id: "4",
    navn: "Fredriksen, Leah",
    fnr: "24999080180",
    veileder: "Olsen, Tone",
    navIdent: "Z345678",
    utlopsdato: "28.07.2026",
    status: "Ikke lengre arbeidssøker",
  },
  {
    id: "5",
    navn: "Evensen, Jonas",
    fnr: "18996248460",
    veileder: "Bjørnstad, Per",
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
      <Table.Header style={{ background: "#ecedef" }}>
        <Table.Row style={{ background: "#ecedef" }}>
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
            <Table.HeaderCell scope="row" textSize="small">
              <span id={`navn-${bruker.id}`}>{bruker.navn}</span>
            </Table.HeaderCell>
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
