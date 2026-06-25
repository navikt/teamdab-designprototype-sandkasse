import { Topbar } from "@/components/Topbar";
import { TabBar } from "@/components/TabBar";
import { FilterPanel } from "@/components/FilterPanel";

export default function VeilarbportefoljeflatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#ecedef]">
      <Topbar />
      <TabBar />
      <main className="flex-1 p-6">
        <FilterPanel />
      </main>
    </div>
  );
}
