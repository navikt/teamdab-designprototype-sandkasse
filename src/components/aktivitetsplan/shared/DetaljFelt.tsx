"use client";

import { Heading } from "@navikt/ds-react";
import { ReactNode } from "react";

interface Props {
  tittel: ReactNode;
  children: ReactNode;
  fullbredde?: boolean;
}

export function DetaljFelt({ tittel, children, fullbredde }: Props) {
  return (
    <div className={fullbredde ? "w-full" : "w-1/2 min-w-52 overflow-hidden overflow-ellipsis"}>
      <Heading level="2" size="xsmall">
        {tittel}
      </Heading>
      {children}
    </div>
  );
}
