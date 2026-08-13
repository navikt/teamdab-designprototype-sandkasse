import NextLink from "next/link";
import { Tag } from "@navikt/ds-react";
import { Bruker } from "@/data/brukere";
import "./brukerliste.css";

function datoOmDager(dager: number): string {
    const d = new Date();
    d.setDate(d.getDate() + dager);
    return d.toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

interface Props {
    bruker: Bruker;
}

export function BrukerlisteDataCeller({ bruker }: Props) {
    return (
        <>
            <div className="brukerliste__innhold">
                <div style={{ flex: 2, padding: "0 0.25rem" }}>
                    <NextLink
                        href={`/personprofil?id=${encodeURIComponent(bruker.id)}`}
                        className="bruker-lenke"
                    >
                        {bruker.navn}
                    </NextLink>
                </div>
                <div style={{ flex: 1, padding: "0 0.25rem" }}>{bruker.fnr}</div>
                <div style={{ flex: 2, padding: "0 0.25rem" }}>{bruker.oppfolgingStartet}</div>
                <div style={{ flex: 2, padding: "0 0.25rem" }}>
                    <NextLink
                        href={`/personprofil?id=${encodeURIComponent(bruker.id)}`}
                        className="bruker-lenke"
                    >
                        {bruker.status}
                    </NextLink>
                </div>
                <div style={{ flex: 2, padding: "0 0.25rem" }}>{datoOmDager(bruker.dagerTilAvslutning)}</div>
            </div>
            <div className="brukerliste__gutter-right">
                <div className="brukerliste__etiketter">
                    <Tag variant="outline" data-color={bruker.statusVariant ?? "neutral"} size="small">
                        {bruker.status}
                    </Tag>
                </div>
            </div>
        </>
    );
}
