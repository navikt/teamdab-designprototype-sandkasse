"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Button, Checkbox, Tag } from "@navikt/ds-react";
import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from "@navikt/aksel-icons";
import { Bruker, Fargekategori } from "@/data/brukere";

function FargekategoriIkon({ kategori }: { kategori?: Fargekategori }) {
  switch (kategori) {
    case "A": return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M20.1879 15.5732C20.5784 15.9637 20.5804 16.5998 20.165 16.9637C18.0417 18.8236 15.4786 20.0162 12.9275 20.3128C10.0764 20.6443 7.47377 19.8297 5.69217 18.0481C3.91058 16.2665 3.09593 13.6639 3.42745 10.8128C3.7241 8.26167 4.91668 5.6986 6.77659 3.57527C7.14049 3.15983 7.77652 3.16187 8.16705 3.55239L14.1775 9.5628L20.1879 15.5732Z" fill="#3386E0" stroke="#23262A" strokeWidth="1.5" /></svg>;
    case "B": return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M21 20L11.7568 3L3 20H21Z" fill="#66C786" stroke="#23262A" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
    case "C": return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><circle cx="12" cy="12" r="8.75" fill="#F5F100" stroke="#23262A" strokeWidth="1.5" /></svg>;
    case "D": return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M20 4H4V20H20V4Z" fill="#A18DBB" stroke="#23262A" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
    case "F": return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M20.5 12L12 2L3.5 12L12 22L20.5 12Z" fill="#FFAA33" stroke="#23262A" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
    case "E": return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M12 3L21.035 9.56434L17.584 20.1857H6.41604L2.96496 9.56434L12 3Z" fill="#7CDAF8" stroke="#23262A" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
    default: return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><rect x="2.5" y="2.5" width="19" height="19" stroke="var(--ax-text-neutral)" strokeWidth="1.5" strokeLinejoin="round" /><path fillRule="evenodd" clipRule="evenodd" d="M17.7283 6.28621C16.6904 5.24058 15.0005 5.23755 13.9588 6.27944L6.79864 13.4413C6.70854 13.5314 6.64288 13.643 6.60788 13.7655L5.52816 17.5454C5.45344 17.807 5.52622 18.0885 5.71835 18.2811C5.91047 18.4737 6.19182 18.5471 6.45358 18.473L10.2255 17.4054C10.3488 17.3705 10.461 17.3046 10.5516 17.214L17.7215 10.0425C18.7578 9.00597 18.7608 7.32644 17.7283 6.28621ZM15.0196 7.33998C15.474 6.88552 16.211 6.88685 16.6637 7.34293C17.1142 7.7968 17.1129 8.5297 16.6607 8.98195L16.6111 9.03159L14.9697 7.38986L15.0196 7.33998ZM13.9092 8.45064L7.99681 14.3644L7.34017 16.6632L9.62898 16.0153L15.5506 10.0924L13.9092 8.45064Z" fill="var(--ax-text-neutral)" /></svg>;
  }
}

function HuskelappIkon({ harHuskelapp }: { harHuskelapp?: boolean }) {
  if (harHuskelapp) {
    return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><rect x="2.5" y="2.5" width="19" height="19" fill="#F9FCCC" /><rect x="2.5" y="2.5" width="19" height="19" stroke="var(--ax-text-neutral)" strokeWidth="1.5" strokeLinejoin="round" /><path fillRule="evenodd" clipRule="evenodd" d="M17.7283 6.28621C16.6904 5.24058 15.0005 5.23755 13.9588 6.27944L6.79864 13.4413C6.70854 13.5314 6.64288 13.643 6.60788 13.7655L5.52816 17.5454C5.45344 17.807 5.52622 18.0885 5.71835 18.2811C5.91047 18.4737 6.19182 18.5471 6.45358 18.473L10.2255 17.4054C10.3488 17.3705 10.461 17.3046 10.5516 17.214L17.7215 10.0425C18.7578 9.00597 18.7608 7.32644 17.7283 6.28621ZM15.0196 7.33998C15.474 6.88552 16.211 6.88685 16.6637 7.34293C17.1142 7.7968 17.1129 8.5297 16.6607 8.98195L16.6111 9.03159L14.9697 7.38986L15.0196 7.33998ZM13.9092 8.45064L7.99681 14.3644L7.34017 16.6632L9.62898 16.0153L15.5506 10.0924L13.9092 8.45064Z" fill="var(--ax-text-neutral)" /></svg>;
  }
  return <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M12 15.375L17.5 21V3H6.5V21L12 15.375Z" stroke="var(--ax-text-neutral)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 2" /></svg>;
}

const huskelappIkonHeader = <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M12 15.375L17.5 21V3H6.5V21L12 15.375Z" stroke="var(--ax-text-neutral)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function SorteringHeaderIkon({
  ikon, felt, aktivtFelt, rekkefolge, onClick, title,
}: {
  ikon: React.ReactNode;
  felt: SortField;
  aktivtFelt: SortField | null;
  rekkefolge: SortOrder;
  onClick: (felt: SortField) => void;
  title: string;
}) {
  const erValgt = aktivtFelt === felt;
  const pil = erValgt && rekkefolge === "stigende"
    ? <ArrowUpIcon aria-hidden fontSize="1rem" />
    : erValgt && rekkefolge === "synkende"
      ? <ArrowDownIcon aria-hidden fontSize="1rem" />
      : <ArrowsUpDownIcon aria-hidden fontSize="1rem" />;
  return (
    <Button
      size="small"
      variant="tertiary"
      icon={<>{ikon}{pil}</>}
      onClick={() => onClick(felt)}
      title={title}
      aria-pressed={erValgt}
    />
  );
}

// Beregner dato X dager frem i tid fra i dag
function datoOmDager(dager: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dager);
  return d.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

type SortField = "navn" | "fnr" | "oppfolgingStartet" | "automatiskAvslutning" | "veileder" | "tildelingsdato" | "status" | "huskelapp" | "fargekategori";
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

export function BrukerTable({ data, selectedRows, onSelectedRowsChange, minOversikt = false }: {
  data: Bruker[];
  selectedRows: string[];
  onSelectedRowsChange: (rows: string[]) => void;
  minOversikt?: boolean;
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
      const next: SortOrder = sortOrder === "stigende" ? "synkende" : null;
      setSortOrder(next);
      if (next === null) setSortFelt(null);
    } else {
      setSortFelt(felt);
      setSortOrder("stigende");
    }
  };

  const fargekategoriOrdre: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 };

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
    if (sortFelt === "huskelapp") {
      return ((a.huskelapp ? 1 : 0) - (b.huskelapp ? 1 : 0)) * dir;
    }
    if (sortFelt === "fargekategori") {
      const oa = fargekategoriOrdre[a.fargekategori ?? ""] ?? 0;
      const ob = fargekategoriOrdre[b.fargekategori ?? ""] ?? 0;
      return (oa - ob) * dir;
    }
    const va = a[sortFelt] ?? "";
    const vb = b[sortFelt] ?? "";
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

        {/* Huskelapp og fargekategori — kun Min oversikt, tilsvarer brukerliste__minoversikt-ikonknapper */}
        {minOversikt && (
          <div className="flex items-center" style={{ minWidth: "6.25rem" }}>
            <SorteringHeaderIkon
              ikon={huskelappIkonHeader}
              felt="huskelapp"
              aktivtFelt={sortFelt}
              rekkefolge={sortOrder}
              onClick={handleSort}
              title="Sorter på huskelapp"
            />
            <SorteringHeaderIkon
              ikon={<FargekategoriIkon />}
              felt="fargekategori"
              aktivtFelt={sortFelt}
              rekkefolge={sortOrder}
              onClick={handleSort}
              title="Sorter på fargekategori"
            />
          </div>
        )}

        {/* Kolonneoverskrifter — tilsvarer brukerliste__innhold (70% bredde) */}
        <div className="flex items-center" style={{ width: "70%" }}>
          <div className="flex-[2] px-1">
            <SorteringHeader tekst="Etternavn, fornavn" felt="navn" {...sorteringProps} />
          </div>
          <div className="flex-[1] px-1">
            <SorteringHeader tekst="Fødselsnr." felt="fnr" {...sorteringProps} />
          </div>
          <div className="flex-[2] px-1">
            <SorteringHeader tekst="Oppfølging startet" felt="oppfolgingStartet" {...sorteringProps} />
          </div>
          <div className="flex-[2] px-1">
            <SorteringHeader tekst="Automatisk avslutning" felt="automatiskAvslutning" {...sorteringProps} />
          </div>
          {minOversikt ? (
            <div className="flex-[2] px-1">
              <SorteringHeader tekst="Tildelingsdato" felt="tildelingsdato" {...sorteringProps} />
            </div>
          ) : (
            <div className="flex-[2] px-1">
              <SorteringHeader tekst="Veileder" felt="veileder" {...sorteringProps} />
            </div>
          )}
        </div>

        {/* Gutter right — status-kolonne */}
        <div className="flex flex-1 items-center" aria-label="Status" />
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

                {/* Huskelapp og fargekategori — kun Min oversikt, tilsvarer brukerliste__minoversikt-ikonknapper */}
                {minOversikt && (
                  <div className="flex items-center" style={{ minWidth: "6.25rem" }}>
                    <Button size="small" variant="tertiary" icon={<HuskelappIkon harHuskelapp={bruker.huskelapp} />} title="Huskelapp" />
                    <Button size="small" variant="tertiary" icon={<FargekategoriIkon kategori={bruker.fargekategori} />} title="Fargekategori" />
                  </div>
                )}

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
                  {minOversikt ? (
                    <div className="flex-[2] px-1">{bruker.tildelingsdato ?? "—"}</div>
                  ) : (
                    <div className="flex-[2] px-1">{bruker.veileder}</div>
                  )}
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
