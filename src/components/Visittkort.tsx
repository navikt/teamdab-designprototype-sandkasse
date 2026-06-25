"use client";

import { ChevronLeftIcon, PersonCircleFillIcon } from "@navikt/aksel-icons";
import { Tag } from "@navikt/ds-react";

export function Visittkort() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 bg-white border-b border-gray-200">
      <button
        aria-label="Tilbake"
        className="p-1 rounded hover:bg-gray-100 transition-colors"
      >
        <ChevronLeftIcon aria-hidden fontSize="1.5rem" />
      </button>

      <PersonCircleFillIcon
        aria-hidden
        fontSize="2.5rem"
        style={{ color: "#368da8" }}
      />

      <span
        className="font-semibold text-2xl leading-8 whitespace-nowrap"
        style={{
          fontFamily: "'Source Sans Pro', 'Source Sans 3', sans-serif",
          color: "#23262a",
          letterSpacing: "-0.048px",
        }}
      >
        Navn Navnersen (44 år)
      </span>

      <span
        className="text-lg leading-6 whitespace-nowrap"
        style={{
          fontFamily: "'Source Sans Pro', 'Source Sans 3', sans-serif",
          color: "#23262a",
        }}
      >
        12345671234
      </span>

      <div className="flex items-center gap-2 flex-wrap">
        <Tag variant="moderate" data-color="info" size="medium">
          Ikke lengre arbeidssøker
        </Tag>
        <Tag variant="moderate" data-color="info" size="medium">
          Ikke lovlig opphold
        </Tag>
        <Tag variant="moderate" data-color="info" size="medium">
          Død
        </Tag>
      </div>
    </div>
  );
}
