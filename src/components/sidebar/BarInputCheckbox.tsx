"use client";

import { Checkbox, Detail } from "@navikt/ds-react";
import "./bar.css";

interface BarInputCheckboxProps {
  filterVerdi: string;
  labelTekst: string;
  antall: number;
  checked: boolean;
  onChange: (checked: boolean, value: string) => void;
}

export function BarInputCheckbox({ filterVerdi, labelTekst, antall, checked, onChange }: BarInputCheckboxProps) {
  return (
    <div className="barinput-checkbox">
      <Checkbox
        size="small"
        value={filterVerdi}
        checked={checked}
        onChange={(e) => onChange(e.target.checked, filterVerdi)}
        className="barinput-checkbox__checkbox"
      >
        {labelTekst}
        <Detail weight="semibold">{antall}</Detail>
      </Checkbox>
    </div>
  );
}
