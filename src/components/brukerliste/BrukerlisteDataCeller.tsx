import NextLink from "next/link";
import { Tag } from "@navikt/ds-react";
import { Bruker } from "@/data/brukere";
import "./brukerliste.css";

// Dato for årsak inntreffer alltid 28 dager før automatisk avslutning.
const DAGER_ARSAK_FOR_AVSLUTNING = 28;

function datoFraIdag(dager: number): string {
    const d = new Date();
    d.setDate(d.getDate() + dager);
    return d.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

interface Props {
    bruker: Bruker;
    avslutning?: boolean;
    fase2?: boolean;
}

export function BrukerlisteDataCeller({ bruker, avslutning = false, fase2 = false }: Props) {
    return (
        <>
            <div className="brukerliste__innhold">
                <div style={{ flex: 1.5, padding: "0 0.5rem" }}>
                    <NextLink
                        href={`/personprofil?id=${encodeURIComponent(bruker.id)}${avslutning ? "&avslutning=1" : ""}${fase2 ? "&fase2=1" : ""}`}
                        className="bruker-lenke"
                    >
                        {bruker.navn}
                    </NextLink>
                </div>
                <div style={{ flex: 1, padding: "0 0.5rem" }}>{bruker.fnr}</div>
                {!avslutning && (
                    <div style={{ flex: 1.5, padding: "0 0.5rem" }}>
                        {bruker.oppfolgingStartet}
                    </div>
                )}
                <div style={{ flex: 3, padding: "0 0.5rem" }}>
                    <NextLink
                        href={`/personprofil?id=${encodeURIComponent(bruker.id)}${avslutning ? "&avslutning=1" : ""}${fase2 ? "&fase2=1" : ""}`}
                        className="bruker-lenke"
                    >
                        {bruker.status}
                    </NextLink>
                </div>
                {avslutning && (
                    <div style={{ flex: 2, padding: "0 0.5rem" }}>
                        {bruker.dagerTilAvslutning != null ? datoFraIdag(bruker.dagerTilAvslutning - DAGER_ARSAK_FOR_AVSLUTNING) : "—"}
                    </div>
                )}
                <div style={{ flex: 2, padding: "0 0.5rem" }}>
                    {bruker.dagerTilAvslutning != null ? datoFraIdag(bruker.dagerTilAvslutning) : "—"}
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
