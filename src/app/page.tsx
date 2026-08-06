"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import { TabBar } from "@/components/TabBar";
import { FilterHeader } from "@/components/FilterHeader";
import { FilterPanel } from "@/components/FilterPanel";
import { Toolbar } from "@/components/Toolbar";
import { BrukerTable } from "@/components/BrukerTable";
import { brukere, avsluttForlengBrukere } from "@/data/brukere";

export default function VeilarbportefoljeflatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("filter") ?? "avslutt-forleng";
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const tableData = statusFilter === "ikke-servicebehov" ? brukere : avsluttForlengBrukere;

  const handleStatusFilterChange = (value: string) => {
    setSelectedRows([]);
    router.replace(`?filter=${value}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-ax-bg-neutral-moderate">
      <Topbar />
      <TabBar />
      <main className="flex-1 p-6 flex gap-4">
        <FilterPanel statusFilter={statusFilter} onStatusFilterChange={handleStatusFilterChange} />
        <div className="flex flex-col gap-2 flex-1">
          <FilterHeader statusFilter={statusFilter} totalRows={tableData.length} selectedCount={selectedRows.length} />
          <Toolbar />
          <BrukerTable data={tableData} selectedRows={selectedRows} onSelectedRowsChange={setSelectedRows} />
        </div>
      </main>
    </div>
  );
}
