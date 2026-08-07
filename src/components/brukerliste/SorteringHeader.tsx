"use client";

import { ReactNode } from "react";
import { BodyShort, Button } from "@navikt/ds-react";
import { ArrowDownIcon, ArrowUpIcon } from "@navikt/aksel-icons";
import classNames from "classnames";
import { Sorteringsfelt, Sorteringsrekkefolge } from "./sortering";
import "./brukerliste.css";

interface SorteringHeaderProps {
    tekst: ReactNode;
    felt: Sorteringsfelt;
    aktivtFelt: Sorteringsfelt | null;
    rekkefolge: Sorteringsrekkefolge;
    onClick: (felt: Sorteringsfelt) => void;
    skalVises?: boolean;
    className?: string;
}

export function SorteringHeader({
    tekst,
    felt,
    aktivtFelt,
    rekkefolge,
    onClick,
    skalVises = true,
    className = "",
}: SorteringHeaderProps) {
    if (!skalVises) return null;

    const erValgt = aktivtFelt === felt;

    const pil = () => {
        if (erValgt && rekkefolge === "stigende")
            return <ArrowUpIcon title="Sortert stigende" className="sorteringheader__pil" aria-hidden />;
        if (erValgt && rekkefolge === "synkende")
            return <ArrowDownIcon title="Sortert synkende" className="sorteringheader__pil" aria-hidden />;
        return null;
    };

    return (
        <BodyShort size="small" className={classNames("sorteringheader", className)}>
            <span>
                <Button
                    size="small"
                    variant="tertiary"
                    onClick={() => onClick(felt)}
                    className={classNames({ "valgt-sortering": erValgt })}
                    aria-pressed={erValgt}
                    aria-label={
                        erValgt && rekkefolge !== "ikke_satt"
                            ? `${tekst}, ${rekkefolge} rekkefølge`
                            : `${tekst}, ingen sortering`
                    }
                >
                    {tekst}
                </Button>
            </span>
            {pil()}
        </BodyShort>
    );
}
