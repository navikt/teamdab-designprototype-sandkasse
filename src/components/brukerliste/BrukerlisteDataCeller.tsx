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
    minOversikt: boolean;
}

export function BrukerlisteDataCeller({ bruker, minOversikt }: Props) {
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
                {minOversikt ? (
                    <div style={{ flex: 2, padding: "0 0.25rem" }}>{bruker.tildelingsdato ?? "—"}</div>
                ) : (
                    <div style={{ flex: 2, padding: "0 0.25rem" }}>{bruker.veileder}</div>
                )}
                <div style={{ flex: 2, padding: "0 0.25rem" }}>{datoOmDager(bruker.dagerTilAvslutning)}</div>
            </div>
            <div className="brukerliste__gutter-right">
                <div className="brukerliste__etiketter">
                    {bruker.merkelapper.map((m) => (
                        <Tag key={m.tekst} variant="outline" data-color={m.variant === "error" ? "danger" : m.variant} size="small">
                            {m.tekst}
                        </Tag>
                    ))}
                </div>
            </div>
        </>
    );
}
