import Image from "next/image";
import { PersonIcon } from "@navikt/aksel-icons";

// Visuell etterligning av Nav sin felles Dekoratør, ikke ekte integrasjon (statisk eksport har ingen server for SSR-varianten).
export function DekoratorHeader() {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-ax-border-neutral-subtle bg-ax-bg-default">
      <div className="flex items-center gap-3">
        <Image src="/NAV_logo_digital_Red.svg" alt="Nav" width={64} height={45} priority style={{ width: "64px", height: "45px" }} />
      </div>
      <div className="flex items-center gap-2 text-ax-text-accent-strong">
        <PersonIcon aria-hidden fontSize="1.5rem" />
        <span>Uspesifisert, Testbruker</span>
      </div>
    </header>
  );
}
