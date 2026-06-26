"use client";

import { InformationSquareIcon, LeaveIcon, TimerStartIcon, XMarkIcon } from "@navikt/aksel-icons";
import { BodyLong, Button } from "@navikt/ds-react";

interface InfoCardProps {
  onHide: () => void;
  onOpenForleng: () => void;
  onOpenAvslutt: () => void;
}

export function InfoCard({ onHide, onOpenForleng, onOpenAvslutt }: InfoCardProps) {
  return (
    <div
      className="flex flex-col items-start overflow-clip rounded-xl w-full"
      style={{ border: "1px solid var(--ax-border-info, #457c9d)" }}
    >
      {/* Header */}
      <div
        className="flex gap-2 items-start px-4 py-1.5 w-full"
        style={{
          background: "var(--ax-bg-info-moderate, #e3eff7)",
          borderBottom: "1px solid var(--ax-border-info-subtleA, rgba(0,90,146,0.25))",
        }}
      >
        <InformationSquareIcon
          aria-hidden
          fontSize="1.5rem"
          className="shrink-0 mt-0.5"
          style={{ color: "var(--ax-text-info, #002942)" }}
        />
        <p
          className="font-semibold text-lg leading-6 flex-1"
          style={{ color: "var(--ax-text-info, #002942)" }}
        >
          Vurder om oppfølging skal avsluttes eller forlenges
        </p>
        <Button
          variant="tertiary"
          size="xsmall"
          icon={<XMarkIcon aria-hidden />}
          aria-label="Lukk"
          onClick={onHide}
          style={{ color: "var(--ax-text-info, #002942)" }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 items-start pt-2 pb-3 px-4 w-full bg-white">
        <ul className="list-disc pl-5 space-y-0.5">
          <li><BodyLong as="span" size="small">Ikke lengre arbeidssøker</BodyLong></li>
        </ul>
      </div>

      {/* Footer */}
      <div className="flex gap-3 items-center pb-3 px-3 w-full bg-white">
        <Button
          variant="primary"
          size="small"
          icon={<LeaveIcon aria-hidden />}
          iconPosition="left"
          onClick={onOpenAvslutt}
        >
          Avslutt oppfølging
        </Button>
        <Button
          variant="secondary"
          size="small"
          icon={<TimerStartIcon aria-hidden />}
          iconPosition="left"
          onClick={onOpenForleng}
        >
          Forleng oppfølging
        </Button>
      </div>
    </div>
  );
}
