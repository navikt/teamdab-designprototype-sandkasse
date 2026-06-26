import { Topbar } from "@/components/Topbar";
import { PersonprofilContent } from "@/components/PersonprofilContent";

export default async function PersonProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ navn?: string }>;
}) {
  const { navn } = await searchParams;
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <PersonprofilContent navn={navn} />
    </div>
  );
}
