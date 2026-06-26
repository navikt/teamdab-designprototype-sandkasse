import { Topbar } from "@/components/Topbar";
import { Visittkort } from "@/components/Visittkort";
import { PersonprofilTabBar } from "@/components/PersonprofilTabBar";
import { InfoCard } from "@/components/InfoCard";
import { AktivitetsplanSection } from "@/components/AktivitetsplanSection";
import { AktivitetsplanBoard } from "@/components/aktivitetsplan/AktivitetsplanBoard";

export default async function PersonProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ navn?: string }>;
}) {
  const { navn } = await searchParams;
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <Visittkort navn={navn} />
      <PersonprofilTabBar />
      <main className="flex-1 flex flex-col items-center gap-6 py-6 overflow-x-hidden">
        <div className="inline-block px-6">
          <InfoCard />
        </div>
        <div className="w-full max-w-3xl px-6">
          <AktivitetsplanSection />
        </div>
        <div className="w-full px-6">
          <AktivitetsplanBoard />
        </div>
      </main>
    </div>
  );
}
