"use client";

import { PlusIcon } from "@navikt/aksel-icons";
import { Button, Dropdown } from "@navikt/ds-react";

interface Props {
  onVelgMote: () => void;
}

// Fra LeggTilNyttAktivitetsKort i aktivitetsplan-repoet (veileder-visning). Kun "Møte med NAV" har funksjon.
const FOR_NAV_ANSATT = ["Avtale om å søke jobber", "Møte med NAV", "Samtalereferat"];
const FOR_BRUKER_OG_NAV_ANSATT = ["En jobb jeg vil søke på", "En jobb jeg har nå", "Jobbrettet egenaktivitet", "Medisinsk behandling"];

export function LeggTilAktivitetMeny({ onVelgMote }: Props) {
  return (
    <Dropdown>
      <Button as={Dropdown.Toggle} variant="primary" size="small" icon={<PlusIcon aria-hidden />} iconPosition="left">
        Legg til aktivitet
      </Button>
      <Dropdown.Menu placement="bottom-start">
        <Dropdown.Menu.GroupedList>
          <Dropdown.Menu.GroupedList.Heading>For NAV-ansatt</Dropdown.Menu.GroupedList.Heading>
          {FOR_NAV_ANSATT.map((tekst) => (
            <Dropdown.Menu.GroupedList.Item key={tekst} onClick={tekst === "Møte med NAV" ? onVelgMote : undefined}>
              {tekst}
            </Dropdown.Menu.GroupedList.Item>
          ))}
        </Dropdown.Menu.GroupedList>
        <Dropdown.Menu.Divider />
        <Dropdown.Menu.GroupedList>
          <Dropdown.Menu.GroupedList.Heading>For bruker og NAV-ansatt</Dropdown.Menu.GroupedList.Heading>
          {FOR_BRUKER_OG_NAV_ANSATT.map((tekst) => (
            <Dropdown.Menu.GroupedList.Item key={tekst}>{tekst}</Dropdown.Menu.GroupedList.Item>
          ))}
        </Dropdown.Menu.GroupedList>
      </Dropdown.Menu>
    </Dropdown>
  );
}
