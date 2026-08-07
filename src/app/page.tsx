"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { TabBar } from "@/components/TabBar";
import { FilterHeader } from "@/components/FilterHeader";
import { FilterPanel } from "@/components/FilterPanel";
import { MinOversiktFilterPanel } from "@/components/MinOversiktFilterPanel";
import { MinOversiktFilterHeader } from "@/components/MinOversiktFilterHeader";
import { Toolbar } from "@/components/Toolbar";
import { Brukerliste } from "@/components/brukerliste/Brukerliste";
import { brukere, avsluttForlengBrukere } from "@/data/brukere";

function EnhetensOversiktInnhold() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("filter") ?? "avslutt-forleng";
  const tab = searchParams.get("tab") ?? "enhetens-oversikt";
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const tableData = statusFilter === "ikke-servicebehov" ? brukere : avsluttForlengBrukere;

  const handleStatusFilterChange = (value: string) => {
    setSelectedRows([]);
    router.replace(`?tab=${tab}&filter=${value}`);
  };

  return (
    <main className="flex-1 p-6 flex gap-4">
      <FilterPanel statusFilter={statusFilter} onStatusFilterChange={handleStatusFilterChange} />
      <div className="flex flex-col gap-2 flex-1">
        <FilterHeader statusFilter={statusFilter} totalRows={tableData.length} selectedCount={selectedRows.length} />
        <Toolbar />
        <Brukerliste data={tableData} selectedRows={selectedRows} onSelectedRowsChange={setSelectedRows} />
      </div>
    </main>
  );
}

function MinOversiktInnhold() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("filter");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const tableData = statusFilter === "ikke-servicebehov" ? brukere : avsluttForlengBrukere;

  const handleStatusFilterChange = (value: string) => {
    setSelectedRows([]);
    router.replace(`?tab=min-oversikt&filter=${value}`);
  };

  const handleClearFilter = () => {
    setSelectedRows([]);
    router.replace("?tab=min-oversikt");
  };

  return (
    <main className="flex-1 p-6 flex gap-4">
      <MinOversiktFilterPanel statusFilter={statusFilter ?? ""} onStatusFilterChange={handleStatusFilterChange} />
      <div className="flex flex-col gap-2 flex-1">
        <MinOversiktFilterHeader
          statusFilter={statusFilter}
          totalRows={tableData.length}
          selectedCount={selectedRows.length}
          onClearFilter={handleClearFilter}
        />
        <Toolbar minOversikt />
        <Brukerliste data={tableData} selectedRows={selectedRows} onSelectedRowsChange={setSelectedRows} minOversikt />
      </div>
    </main>
  );
}

function Innhold() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "enhetens-oversikt";

  if (tab === "min-oversikt") {
    return <MinOversiktInnhold />;
  }
  return <EnhetensOversiktInnhold />;
}

export default function VeilarbportefoljeflatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-ax-bg-neutral-moderate">
      <Topbar />
      <Suspense fallback={null}>
        <TabBar />
      </Suspense>
      <Suspense fallback={null}>
        <Innhold />
      </Suspense>
    </div>
  );
}
