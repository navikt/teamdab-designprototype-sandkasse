"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Checkbox, Tag } from "@navikt/ds-react";
import { ArrowDownIcon, ArrowUpIcon } from "@navikt/aksel-icons";
import { Bruker } from "@/data/brukere";

// Beregner dato X dager frem i tid fra i dag
function datoOmDager(dager: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dager);
  return d.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

type SortField = "navn" | "fnr" | "oppfolgingStartet" | "automatiskAvslutning" | "veileder" | "status";
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
      className="inline-flex items-center gap-1 border-0 bg-transparent cursor-pointer text-left font-normal text-blue-600 hover:text-blue-800 hover:underline"
      style={{ fontSize: "0.75rem" }}
      aria-pressed={erValgt}
    >
      {tekst}
      {erValgt && rekkefolge === "stigende" && <ArrowUpIcon aria-hidden fontSize="1rem" />}
      {erValgt && rekkefolge === "synkende" && <ArrowDownIcon aria-hidden fontSize="1rem" />}
    </button>
  );
}

export function BrukerTable({ data, selectedRows, onSelectedRowsChange }: {
  data: Bruker[];
  selectedRows: string[];
  onSelectedRowsChange: (rows: string[]) => void;
}) {
  const [sortFelt, setSortFelt] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const toggleRow = (id: string) =>
    onSelectedRowsChange(
      selectedRows.includes(id) ? selectedRows.filter((r) => r !== id) : [...selectedRows, id],
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
    const dir = sortOrder === "stigende" ? 1 : -1;
    if (sortFelt === "automatiskAvslutning") {
      return (a.dagerTilAvslutning - b.dagerTilAvslutning) * dir;
    }
    if (sortFelt === "oppfolgingStartet") {
      // Format DD.MM.YYYY — parse to YYYYMMDD for correct chronological sort
      const toNum = (s: string) => s.split(".").reverse().join("");
      return toNum(a.oppfolgingStartet).localeCompare(toNum(b.oppfolgingStartet)) * dir;
    }
    const va = a[sortFelt];
    const vb = b[sortFelt];
    return va.localeCompare(vb) * dir;
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
            onChange={() => onSelectedRowsChange(allSelected ? [] : data.map((d) => d.id))}
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
            <SorteringHeader tekst="Automatisk avslutning" felt="automatiskAvslutning" {...sorteringProps} />
          </div>
          <div className="flex-[2]">
            <SorteringHeader tekst="Veileder" felt="veileder" {...sorteringProps} />
          </div>
        </div>

        {/* Gutter right — status-kolonne */}
        <div className="flex flex-1 items-center">
          <span style={{ fontWeight: "normal", color: "var(--ax-text-neutral)", padding: "0 4px", fontSize: "0.75rem" }}>
            
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
                    <NextLink
                      id={`navn-${bruker.id}`}
                      href={`/personprofil?navn=${encodeURIComponent(bruker.navn)}&fnr=${encodeURIComponent(bruker.fnr)}`}
                      className="bruker-lenke"
                    >
                      {bruker.navn}
                    </NextLink>
                  </div>
                  <div className="flex-[1] px-1">{bruker.fnr}</div>
                  <div className="flex-[2] px-1">{bruker.oppfolgingStartet}</div>
                  <div className="flex-[2] px-1">{datoOmDager(bruker.dagerTilAvslutning)}</div>
                  <div className="flex-[2] px-1">{bruker.veileder}</div>
                </div>

                {/* Gutter right — etiketter, tilsvarer brukerliste__gutter-right */}
                <div className="flex flex-1 items-center gap-1">
                  <Tag variant="outline" data-color={bruker.statusVariant ?? "info"} size="small" style={{ fontSize: "0.75rem" }}>
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
