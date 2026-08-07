"use client";

import { useState } from "react";
import { Bruker, Fargekategori } from "@/data/brukere";
import { BrukerlisteHeader } from "./BrukerlisteHeader";
import { BrukerlisteRad } from "./BrukerlisteRad";
import { Sorteringsfelt, Sorteringsrekkefolge } from "./sortering";
import "./brukerliste.css";

interface Props {
    data: Bruker[];
    selectedRows: string[];
    onSelectedRowsChange: (rows: string[] | ((prev: string[]) => string[])) => void;
    minOversikt?: boolean;
}

const fargekategoriOrdre: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 };

function sorterBrukere(data: Bruker[], felt: Sorteringsfelt | null, rekkefolge: Sorteringsrekkefolge): Bruker[] {
    if (!felt || rekkefolge === "ikke_satt") return data;
    const dir = rekkefolge === "stigende" ? 1 : -1;

    return [...data].sort((a, b) => {
        if (felt === "automatiskAvslutning") {
            return (a.dagerTilAvslutning - b.dagerTilAvslutning) * dir;
        }
        if (felt === "oppfolgingStartet" || felt === "tildelingsdato") {
            const toNum = (s: string | undefined) => (s ? s.split(".").reverse().join("") : "");
            return toNum(a[felt]).localeCompare(toNum(b[felt])) * dir;
        }
        if (felt === "huskelapp") {
            return ((a.huskelapp ? 1 : 0) - (b.huskelapp ? 1 : 0)) * dir;
        }
        if (felt === "fargekategori") {
            const oa = fargekategoriOrdre[a.fargekategori as string] ?? 0;
            const ob = fargekategoriOrdre[b.fargekategori as string] ?? 0;
            return (oa - ob) * dir;
        }
        const va = (a[felt as keyof Bruker] as string) ?? "";
        const vb = (b[felt as keyof Bruker] as string) ?? "";
        return va.localeCompare(vb) * dir;
    });
}

export function Brukerliste({ data, selectedRows, onSelectedRowsChange, minOversikt = false }: Props) {
    const [sortFelt, setSortFelt] = useState<Sorteringsfelt | null>(null);
    const [sortRekkefolge, setSortRekkefolge] = useState<Sorteringsrekkefolge>("ikke_satt");

    const handleSort = (felt: Sorteringsfelt) => {
        if (sortFelt === felt) {
            if (sortRekkefolge === "stigende") {
                setSortRekkefolge("synkende");
            } else {
                setSortFelt(null);
                setSortRekkefolge("ikke_satt");
            }
        } else {
            setSortFelt(felt);
            setSortRekkefolge("stigende");
        }
    };

    const alleValgt = selectedRows.length === data.length && data.length > 0;
    const noenValgt = selectedRows.length > 0 && !alleValgt;

    const velgAlle = () =>
        onSelectedRowsChange(alleValgt ? [] : data.map((d) => d.id));

    const settMarkert = (id: string, markert: boolean) =>
        onSelectedRowsChange((prev) =>
            markert ? [...new Set([...prev, id])] : prev.filter((r) => r !== id)
        );

    const sortertData = sorterBrukere(data, sortFelt, sortRekkefolge);

    return (
        <div>
            <BrukerlisteHeader
                alleValgt={alleValgt}
                noenValgt={noenValgt}
                velgAlle={velgAlle}
                aktivtFelt={sortFelt}
                rekkefolge={sortRekkefolge}
                onSort={handleSort}
                minOversikt={minOversikt}
            />
            <div className="brukerliste-tabell">
                <ul className="brukerliste">
                    {sortertData.map((bruker) => (
                        <BrukerlisteRad
                            key={bruker.id}
                            bruker={bruker}
                            markert={selectedRows.includes(bruker.id)}
                            settMarkert={settMarkert}
                            minOversikt={minOversikt}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}
