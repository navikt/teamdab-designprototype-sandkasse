"use client";

import { Checkbox } from "@navikt/ds-react";
import classNames from "classnames";
import { Bruker } from "@/data/brukere";
import { BrukerlisteDataCeller } from "./BrukerlisteDataCeller";
import { FargekategoriIkon } from "./FargekategoriIkon";
import { HuskelappIkon } from "./HuskelappIkon";
import "./brukerliste.css";

interface Props {
    bruker: Bruker;
    markert: boolean;
    settMarkert: (id: string, markert: boolean) => void;
    minOversikt: boolean;
    erForrigeBruker?: boolean;
}

export function BrukerlisteRad({ bruker, markert, settMarkert, minOversikt, erForrigeBruker = false }: Props) {
    return (
        <li className={classNames("brukerliste_rad", { "brukerliste--forrigeBruker": erForrigeBruker })}>
            <div className="brukerliste__element">
                <Checkbox
                    checked={markert}
                    className="brukerliste__checkbox"
                    hideLabel
                    onChange={() => settMarkert(bruker.id, !markert)}
                    size="small"
                >
                    Velg bruker {bruker.navn}
                </Checkbox>
                {minOversikt && (
                    <div className="brukerliste__minoversikt-ikonknapper">
                        <div style={{ width: "2.5rem" }}><HuskelappIkon harHuskelapp={bruker.huskelapp} /></div>
                        <div style={{ width: "2.5rem" }}><FargekategoriIkon kategori={bruker.fargekategori} /></div>
                    </div>
                )}
                <BrukerlisteDataCeller bruker={bruker} minOversikt={minOversikt} />
            </div>
        </li>
    );
}
