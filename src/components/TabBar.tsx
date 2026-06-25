"use client";

import { Tabs } from "@navikt/ds-react";

export function TabBar() {
  return (
    <div className="bg-white" style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.08)" }}>
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
