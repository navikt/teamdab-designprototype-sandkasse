import { PersonIcon } from "@navikt/aksel-icons";

// Visuell etterligning av Nav sin felles Dekoratør, ikke ekte integrasjon (statisk eksport har ingen server for SSR-varianten).
export function DekoratorHeader() {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-ax-border-neutral-subtle bg-ax-bg-default">
      <span className="font-bold text-xl text-ax-text-neutral">nav.no</span>
      <div className="flex items-center gap-2 text-ax-text-neutral">
        <PersonIcon aria-hidden fontSize="1.5rem" />
        <span>Uspesifisert, Testbruker</span>
      </div>
    </header>
  );
}
