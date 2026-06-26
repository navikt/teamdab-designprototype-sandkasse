import { Topbar } from "@/components/Topbar";
import { Visittkort } from "@/components/Visittkort";
import { PersonprofilTabBar } from "@/components/PersonprofilTabBar";
import { InfoCard } from "@/components/InfoCard";
import { AktivitetsplanSection } from "@/components/AktivitetsplanSection";

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
      <main className="flex-1 p-6 flex flex-col items-center gap-6">
        <div className="inline-block">
          <InfoCard />
        </div>
        <div className="w-full max-w-3xl">
          <AktivitetsplanSection />
        </div>
      </main>
    </div>
  );
}
