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
}

export function BrukerlisteHeader({
    alleValgt,
    noenValgt,
    velgAlle,
    aktivtFelt,
    rekkefolge,
    onSort,
    minOversikt,
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
                        felt="huskelapp"
                        title="Sorter på huskelapp"
                        {...sorteringProps}
                    />
                    <SorteringHeaderIkon
                        ikon={fargekategoriIkonHeader}
                        felt="fargekategori"
                        title="Sorter på fargekategori"
                        {...sorteringProps}
                    />
                </div>
            )}
            <div className="brukerliste__innhold">
                <div style={{ flex: 2, padding: "0 0.25rem" }}>
                    <SorteringHeader tekst="Etternavn, fornavn" felt="navn" {...sorteringProps} />
                </div>
                <div style={{ flex: 1, padding: "0 0.25rem" }}>
                    <SorteringHeader tekst="Fødselsnr." felt="fnr" {...sorteringProps} />
                </div>
                <div style={{ flex: 2, padding: "0 0.25rem" }}>
                    <SorteringHeader tekst="Oppfølging startet" felt="oppfolgingStartet" {...sorteringProps} />
                </div>
                {minOversikt ? (
                    <div style={{ flex: 2, padding: "0 0.25rem" }}>
                        <SorteringHeader tekst="Tildelingsdato" felt="tildelingsdato" {...sorteringProps} />
                    </div>
                ) : (
                    <div style={{ flex: 2, padding: "0 0.25rem" }}>
                        <SorteringHeader tekst="Veileder" felt="veileder" {...sorteringProps} />
                    </div>
                )}
                <div style={{ flex: 2, padding: "0 0.25rem" }}>
                    <SorteringHeader tekst="Automatisk avslutning" felt="automatiskAvslutning" {...sorteringProps} />
                </div>
            </div>
            <div className="brukerliste__gutter-right" aria-label="Status" />
        </div>
    );
}
