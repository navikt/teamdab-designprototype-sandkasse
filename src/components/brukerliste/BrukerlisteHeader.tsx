"use client";

import { Checkbox } from "@navikt/ds-react";
import { SorteringHeader } from "./SorteringHeader";
import { SorteringHeaderIkon } from "./SorteringHeaderIkon";
import { fargekategoriIkonHeader } from "./FargekategoriIkon";
import { huskelappIkonHeader } from "./HuskelappIkon";
import { Sorteringsfelt, Sorteringsrekkefolge } from "./sortering";
import "./brukerliste.css";

interface Props {
    alleValgt: boolean;
    noenValgt: boolean;
    velgAlle: () => void;
    aktivtFelt: Sorteringsfelt | null;
    rekkefolge: Sorteringsrekkefolge;
    onSort: (felt: Sorteringsfelt) => void;
    minOversikt: boolean;
    avslutning?: boolean;
}

export function BrukerlisteHeader({
    alleValgt,
    noenValgt,
    velgAlle,
    aktivtFelt,
    rekkefolge,
    onSort,
    minOversikt,
    avslutning = false,
}: Props) {
    const sorteringProps = { aktivtFelt, rekkefolge, onClick: onSort };

    return (
        <div className="brukerliste__sorteringheader">
            <Checkbox
                checked={alleValgt}
                indeterminate={noenValgt}
                onChange={velgAlle}
                hideLabel
                size="small"
                className="brukerliste__checkbox"
            >
                Velg alle
            </Checkbox>
            {minOversikt && (
                <div className="brukerliste__minoversikt-ikonknapper">
                    <SorteringHeaderIkon
                        ikon={huskelappIkonHeader}
                        felt="fargekategori"
                        title="Sorter på fargekategori"
                        {...sorteringProps}
                    />
                    <SorteringHeaderIkon
                        ikon={fargekategoriIkonHeader}
                        felt="huskelapp"
                        title="Sorter på huskelapp"
                        {...sorteringProps}
                    />
                </div>
            )}
            <div className="brukerliste__innhold">
                <div style={{ flex: 1.5, padding: "0 0.5rem" }}>
                    <SorteringHeader tekst="Etternavn, fornavn" felt="navn" {...sorteringProps} />
                </div>
                <div style={{ flex: 1, padding: "0 0.5rem" }}>
                    <SorteringHeader tekst="Fødselsnr." felt="fnr" {...sorteringProps} />
                </div>
                {!avslutning && (
                    <div style={{ flex: 1.5, padding: "0 0.5rem" }}>
                        <SorteringHeader tekst="Oppfølging startet" felt="oppfolgingStartet" {...sorteringProps} />
                    </div>
                )}
                <div style={{ flex: 3, padding: "0 0.5rem" }}>
                    <SorteringHeader tekst={avslutning ? "Årsak til avslutning" : "Hendelse"} felt="status" {...sorteringProps} />
                </div>
                {avslutning && (
                    <div style={{ flex: 2, padding: "0 0.5rem" }}>
                        <SorteringHeader tekst="Dato for årsak" felt="datoForArsak" {...sorteringProps} />
                    </div>
                )}
                <div style={{ flex: 2, padding: "0 0.5rem" }}>
                    <SorteringHeader tekst="Automatisk avslutning" felt="automatiskAvslutning" {...sorteringProps} />
                </div>
                <div style={{ flex: 2, padding: "0 0.5rem" }}><span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>Merkelapper</span></div>
            </div>
            <div className="brukerliste__gutter-right" aria-label="Status" />
        </div>
    );
}
