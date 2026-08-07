"use client";

import { ReactNode } from "react";
import { Button } from "@navikt/ds-react";
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from "@navikt/aksel-icons";
import { Sorteringsfelt, Sorteringsrekkefolge } from "./sortering";
import "./brukerliste.css";

interface SorteringHeaderIkonProps {
    ikon: ReactNode;
    felt: Sorteringsfelt;
    aktivtFelt: Sorteringsfelt | null;
    rekkefolge: Sorteringsrekkefolge;
    onClick: (felt: Sorteringsfelt) => void;
    title: string;
    skalVises?: boolean;
}

export function SorteringHeaderIkon({
    ikon,
    felt,
    aktivtFelt,
    rekkefolge,
    onClick,
    title,
    skalVises = true,
}: SorteringHeaderIkonProps) {
    if (!skalVises) return null;

    const erValgt = aktivtFelt === felt;

    const pil = () => {
        if (erValgt && rekkefolge === "stigende")
            return <ArrowUpIcon title="Sortert stigende" className="sorteringspil" aria-hidden />;
        if (erValgt && rekkefolge === "synkende")
            return <ArrowDownIcon title="Sortert synkende" className="sorteringspil" aria-hidden />;
        return <ArrowsUpDownIcon title="Sorter" className="sorteringspil" aria-hidden />;
    };

    return (
        <Button
            size="small"
            variant="tertiary"
            icon={<>{ikon}{pil()}</>}
            onClick={() => onClick(felt)}
            title={title}
            aria-label={
                erValgt && rekkefolge !== "ikke_satt"
                    ? `${title}, ${rekkefolge} rekkefølge`
                    : `${title}, ingen sortering`
            }
            aria-live="polite"
        />
    );
}
