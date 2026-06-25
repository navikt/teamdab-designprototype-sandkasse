import { Topbar } from "@/components/Topbar";
import { Visittkort } from "@/components/Visittkort";

export default function PersonProfilPage() {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <Visittkort />
      <main className="flex-1 p-6">
        <h1>PersonProfil</h1>
      </main>
    </div>
  );
}
