import { Topbar } from "@/components/Topbar";
import { TabBar } from "@/components/TabBar";
import { FilterHeader } from "@/components/FilterHeader";
import { FilterPanel } from "@/components/FilterPanel";
import { Toolbar } from "@/components/Toolbar";

export default function VeilarbportefoljeflatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#ecedef]">
      <Topbar />
      <TabBar />
      <main className="flex-1 p-6 flex gap-4">
        <FilterPanel />
        <div className="flex flex-col gap-2 flex-1">
          <FilterHeader />
          <Toolbar />
        </div>
      </main>
    </div>
  );
}
