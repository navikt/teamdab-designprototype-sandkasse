"use client";

import { ActionMenu, Button, Chips, Detail } from "@navikt/ds-react";
import { FilterIcon } from "@navikt/aksel-icons";

interface ArkivFilterMenyProps {
  alleTyper: string[];
  valgteTyper: string[];
  onToggleType: (type: string) => void;
}

export function ArkivFilterMeny({ alleTyper, valgteTyper, onToggleType }: ArkivFilterMenyProps) {
  return (
    <div className="flex flex-col gap-3">
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button variant="secondary" size="small" icon={<FilterIcon aria-hidden />} className="self-start">
            Filter
          </Button>
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          {alleTyper.map((type) => (
            <ActionMenu.CheckboxItem
              key={type}
              checked={valgteTyper.includes(type)}
              onCheckedChange={() => onToggleType(type)}
            >
              {type}
            </ActionMenu.CheckboxItem>
          ))}
        </ActionMenu.Content>
      </ActionMenu>

      {valgteTyper.length > 0 && (
        <div className="flex flex-col gap-2">
          <Detail className="text-ax-text-neutral-subtle">Valgte filter</Detail>
          <Chips>
            {valgteTyper.map((type) => (
              <Chips.Removable key={type} variant="neutral" onClick={() => onToggleType(type)}>
                {type}
              </Chips.Removable>
            ))}
          </Chips>
        </div>
      )}
    </div>
  );
}
