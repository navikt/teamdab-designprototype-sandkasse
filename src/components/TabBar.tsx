"use client";

import { Tabs } from "@navikt/ds-react";
import { useRouter, useSearchParams } from "next/navigation";

export function TabBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const aktiveTab = searchParams.get("tab") ?? "enhetens-oversikt";

  const handleTabChange = (value: string) => {
    router.replace(`?tab=${value}`);
  };

  return (
    <div className="bg-ax-bg-default" style={{ boxShadow: "0 2px 4px 0 rgba(183, 177, 169, 0.5)" }}>
      <Tabs value={aktiveTab} onChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Tab value="min-oversikt" label="Min oversikt" />
          <Tabs.Tab value="enhetens-oversikt" label="Enhetens oversikt" />
          <Tabs.Tab value="veilederoversikt" label="Veilederoversikt" />
        </Tabs.List>
      </Tabs>
    </div>
  );
}
