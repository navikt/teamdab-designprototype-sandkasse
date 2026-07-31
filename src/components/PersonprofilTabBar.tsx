"use client";

import { Tabs } from "@navikt/ds-react";

export function PersonprofilTabBar() {
  return (
    <div
      className="bg-white [&_.navds-tabs__tab--active]:text-[var(--ax-text-neutral)] [&_.navds-tabs__tab--active]:shadow-[inset_0_-4px_0_0_#0067c5] [&_.navds-tabs__tab]:hover:text-[var(--ax-text-neutral)]"
      style={{ boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(7,26,54,0.21)" }}
    >
      <Tabs.List>
        <Tabs.Tab value="aktivitetsplan" label="Aktivitetsplan" />
        <Tabs.Tab value="dialog" label="Dialog" />
        <Tabs.Tab value="overblikk" label="Overblikk" />
        <Tabs.Tab value="oppfolgingsvedtak" label="Oppfølgingsvedtak § 14 a" />
        <Tabs.Tab value="arbeidsmarkedstiltak" label="Arbeidsmarkedstiltak" />
        <Tabs.Tab value="finn-stillinger" label="Finn stillinger" />
      </Tabs.List>
    </div>
  );
}
