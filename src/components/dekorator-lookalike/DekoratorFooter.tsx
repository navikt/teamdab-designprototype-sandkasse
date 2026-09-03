import { Link } from "@navikt/ds-react";

// Visuell etterligning av Nav sin felles Dekoratør-footer, ikke ekte integrasjon.
export function DekoratorFooter() {
  return (
    <footer className="mt-auto border-t border-ax-border-neutral-subtle bg-ax-bg-neutral-soft px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-sm">
        <div className="flex flex-col gap-2">
          <Link href="#">Om nav.no</Link>
          <Link href="#">Tilgjengelighet</Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="#">Personvern</Link>
          <Link href="#">Informasjonskapsler</Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="#">Kontakt oss</Link>
          <Link href="#">Klage og tilbakemelding</Link>
        </div>
      </div>
    </footer>
  );
}
