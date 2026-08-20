import NextLink from "next/link";
import { Tag } from "@navikt/ds-react";
import { Bruker } from "@/data/brukere";
import "./brukerliste.css";

function datoOmDager(dager: number): string {
    const d = new Date();
    d.setDate(d.getDate() + dager);
    return d.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function datoForDagerSiden(dager: number): string {
    const d = new Date();
    d.setDate(d.getDate() - dager);
    return d.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

interface Props {
    bruker: Bruker;
    avslutning?: boolean;
    fase2?: boolean;
    minOversikt?: boolean;
}

export function BrukerlisteDataCeller({ bruker, avslutning = false, fase2 = false, minOversikt = false }: Props) {
    return (
        <>
            <div className="brukerliste__innhold">
                <div style={{ flex: 1.5, padding: "0 0.5rem" }}>
                    <NextLink
                        href={`/personprofil?id=${encodeURIComponent(bruker.id)}`}
                        className="bruker-lenke"
                    >
                        {bruker.navn}
                    </NextLink>
                </div>
                <div style={{ flex: 1, padding: "0 0.5rem" }}>{bruker.fnr}</div>
                {!(minOversikt && avslutning) && (
                    <div style={{ flex: 1.5, padding: "0 0.5rem" }}>
                        {avslutning ? bruker.veileder : bruker.oppfolgingStartet}
                    </div>
                )}
                <div style={{ flex: 3, padding: "0 0.5rem" }}>
                    <NextLink
                        href={`/personprofil?id=${encodeURIComponent(bruker.id)}`}
                        className="bruker-lenke"
                    >
                        {bruker.status}
                    </NextLink>
                </div>
                <div style={{ flex: 2, padding: "0 0.5rem" }}>
                    {avslutning && !fase2 && bruker.dagerSidenÅrsakOppsto != null
                        ? datoForDagerSiden(bruker.dagerSidenÅrsakOppsto)
                        : datoOmDager(bruker.dagerTilAvslutning)}
                </div>
                <div style={{ flex: 2, padding: "0 0.5rem", display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                    {bruker.merkelapper.map((m, i) => (
                        <Tag key={i} variant={m.variant} size="small">{m.tekst}</Tag>
                    ))}
                </div>
            </div>
            <div className="brukerliste__gutter-right" />
        </>
    );
}
