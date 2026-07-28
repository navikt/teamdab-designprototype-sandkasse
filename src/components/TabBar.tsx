"use client";

import { Tabs } from "@navikt/ds-react";

export function TabBar() {
  return (
    <div className="bg-ax-bg-default" style={{ boxShadow: "0 2px 4px 0 rgba(183, 177, 169, 0.5)" }}>
      <Tabs defaultValue="enhetens-oversikt">
        <Tabs.List>
          <Tabs.Tab value="min-oversikt" label="Min oversikt" />
          <Tabs.Tab value="enhetens-oversikt" label="Enhetens oversikt" />
          <Tabs.Tab value="veilederoversikt" label="Veilederoversikt" />
        </Tabs.List>
      </Tabs>
    </div>
  );
}
