"use client";

import { Detail, Radio } from "@navikt/ds-react";
import "./bar.css";

interface BarInputRadioProps {
  filterVerdi: string;
  labelTekst: string;
  statustall: number;
}

export function BarInputRadio({ filterVerdi, labelTekst, statustall }: BarInputRadioProps) {
  return (
    <div className="barinput-radio">
      <Radio value={filterVerdi} size="small" className="barinput-radio__radio">
        {labelTekst}
        <Detail weight="semibold">{statustall}</Detail>
      </Radio>
    </div>
  );
}
