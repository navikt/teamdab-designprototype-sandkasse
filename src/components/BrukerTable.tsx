"use client";

import { useState } from "react";
import { Checkbox, Link, Tag } from "@navikt/ds-react";
import { ArrowDownIcon, ArrowUpIcon } from "@navikt/aksel-icons";
import { brukere } from "@/data/brukere";

// Stil for sorteringsknapper — tilsvarer .lenke--frittstaende i prod
const sorteringKnappStyle: React.CSSProperties = {
  border: 0,
  padding: "0 4px",
  background: "none",
  cursor: "pointer",
  fontWeight: "normal",
  fontSize: "inherit",
  fontFamily: "inherit",
  color: "var(--ax-text-action)",
  textAlign: "left",
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
};

const data = brukere;

type SortField = "navn" | "fnr" | "oppfolgingStartet" | "veileder" | "status";
type SortOrder = "stigende" | "synkende" | null;

function SorteringHeader({
  tekst,
  felt,
  aktivtFelt,
  rekkefolge,
  onClick,
  className,
}: {
  tekst: string;
  felt: SortField;
  aktivtFelt: SortField | null;
  rekkefolge: SortOrder;
  onClick: (felt: SortField) => void;
  className?: string;
}) {
  const erValgt = aktivtFelt === felt;
  return (
    <button
      onClick={() => onClick(felt)}
      style={sorteringKnappStyle}
      aria-pressed={erValgt}
    >
      {tekst}
      {erValgt && rekkefolge === "stigende" && <ArrowUpIcon aria-hidden fontSize="1rem" />}
      {erValgt && rekkefolge === "synkende" && <ArrowDownIcon aria-hidden fontSize="1rem" />}
    </button>
  );
}

export function BrukerTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortFelt, setSortFelt] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const toggleRow = (id: string) =>
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );

  const allSelected = selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && !allSelected;

  const handleSort = (felt: SortField) => {
    if (sortFelt === felt) {
      setSortOrder((prev) => (prev === "stigende" ? "synkende" : prev === "synkende" ? null : "stigende"));
      if (sortOrder === "synkende") setSortFelt(null);
    } else {
      setSortFelt(felt);
      setSortOrder("stigende");
    }
  };

  const sortertData = [...data].sort((a, b) => {
    if (!sortFelt || !sortOrder) return 0;
    const va = a[sortFelt];
    const vb = b[sortFelt];
    return sortOrder === "stigende" ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const sorteringProps = { aktivtFelt: sortFelt, rekkefolge: sortOrder, onClick: handleSort };

  return (
    <div>
      {/* Header — tilsvarer brukerliste__sorteringheader i prod */}
      <div
        className="flex items-center min-h-12 pb-2"
        style={{ borderBottom: "1px solid var(--ax-border-neutral-strong)" }}
      >
        {/* Checkbox-kolonne */}
        <div style={{ marginLeft: "calc(1rem + 1px)", marginRight: "0.5rem" }}>
          <Checkbox
            size="small"
            checked={allSelected}
            indeterminate={someSelected}
            onChange={() => setSelectedRows(allSelected ? [] : data.map((d) => d.id))}
            hideLabel
          >
            Velg alle
          </Checkbox>
        </div>

        {/* Kolonneoverskrifter — tilsvarer brukerliste__innhold (70% bredde) */}
        <div className="flex items-center" style={{ width: "70%" }}>
          <div className="flex-[2]">
            <SorteringHeader tekst="Etternavn, fornavn" felt="navn" {...sorteringProps} />
          </div>
          <div className="flex-[1]">
            <SorteringHeader tekst="Fødselsnr." felt="fnr" {...sorteringProps} />
          </div>
          <div className="flex-[2]">
            <SorteringHeader tekst="Oppfølging startet" felt="oppfolgingStartet" {...sorteringProps} />
          </div>
          <div className="flex-[2]">
            <SorteringHeader tekst="Veileder" felt="veileder" {...sorteringProps} />
          </div>
        </div>

        {/* Gutter right — status-kolonne */}
        <div className="flex flex-1 items-center">
          <span className="text-sm" style={{ fontWeight: "normal", color: "var(--ax-text-neutral)", padding: "0 4px" }}>
            Status
          </span>
        </div>
      </div>

      {/* Radliste — tilsvarer ul.brukerliste i prod */}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          backgroundColor: "var(--ax-bg-neutral-soft)",
          borderLeft: "1px solid var(--ax-border-neutral-strong)",
          borderRight: "1px solid var(--ax-border-neutral-strong)",
          borderRadius: "0 0 4px 4px",
        }}
      >
        {sortertData.map((bruker, index) => {
          const isSelected = selectedRows.includes(bruker.id);
          const isOdd = index % 2 === 0; // 1-indeksert: første er oddetall
          return (
            <li
              key={bruker.id}
              style={{
                backgroundColor: isSelected
                  ? "var(--ax-bg-accent-soft)"
                  : isOdd
                    ? "var(--ax-bg-default)"
                    : undefined,
                borderTop: index === 0 ? "none" : "1px solid var(--ax-border-default)",
                borderBottom:
                  index === sortertData.length - 1
                    ? "1px solid var(--ax-border-default)"
                    : undefined,
              }}
            >
              {/* Rad-element — tilsvarer div.brukerliste__element */}
              <div className="flex items-center py-2">
                {/* Checkbox */}
                <div style={{ marginLeft: "calc(1rem + 1px)", marginRight: "0.5rem" }}>
                  <Checkbox
                    size="small"
                    hideLabel
                    checked={isSelected}
                    onChange={() => toggleRow(bruker.id)}
                    aria-label={`Velg ${bruker.navn}`}
                  >
                    Velg {bruker.navn}
                  </Checkbox>
                </div>

                {/* Datakolonner — tilsvarer brukerliste__innhold (70%) */}
                <div className="flex items-center text-sm" style={{ width: "70%" }}>
                  <div className="flex-[2] px-1">
                    <Link
                      id={`navn-${bruker.id}`}
                      href={`/personprofil?navn=${encodeURIComponent(bruker.navn)}&fnr=${encodeURIComponent(bruker.fnr)}`}
                      style={{ textDecoration: "none" }}
                    >
                      {bruker.navn}
                    </Link>
                  </div>
                  <div className="flex-[1] px-1">{bruker.fnr}</div>
                  <div className="flex-[2] px-1">{bruker.oppfolgingStartet}</div>
                  <div className="flex-[2] px-1">{bruker.veileder}</div>
                </div>

                {/* Gutter right — etiketter, tilsvarer brukerliste__gutter-right */}
                <div className="flex flex-1 items-center gap-1">
                  <Tag variant="outline" data-color="info" size="small" style={{ fontSize: "0.75rem" }}>
                    {bruker.status}
                  </Tag>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
