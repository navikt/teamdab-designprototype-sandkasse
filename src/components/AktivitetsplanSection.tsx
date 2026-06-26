import { BriefcaseIcon, PlusIcon } from "@navikt/aksel-icons";
import { BodyLong, BodyShort, Button, Heading, Link, Select } from "@navikt/ds-react";

export function AktivitetsplanSection() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top links row */}
      <div className="flex items-center gap-8">
        <Link href="#">Hva er aktivitetsplanen?</Link>
        <Link href="#">Skriv ut</Link>
      </div>

      <Heading size="large" level="1">Aktivitetsplan</Heading>

      {/* Mitt mål card */}
      <div className="flex gap-8 items-center bg-white border-2 border-dashed border-[rgba(2,20,49,0.49)] rounded-lg px-8 py-4 w-full">
        <div className="shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-[#ccf1d6]">
          <BriefcaseIcon aria-hidden fontSize="3rem" style={{ color: "#23262a" }} />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <Heading size="medium" level="2">Mitt mål</Heading>
          <BodyLong>
            Skriv noen ord om hva som er målet ditt slik at vi kan veilede deg bedre.
          </BodyLong>
          <ul className="list-disc pl-5">
            <li><BodyShort as="span">Hva er målet på kort sikt? Hva er målet på lengre sikt?</BodyShort></li>
            <li><BodyShort as="span">Hva slags arbeidsoppgaver ønsker du deg?</BodyShort></li>
          </ul>
          <div>
            <Button variant="secondary" size="small">Sett et mål</Button>
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-4 w-full">
        <Button variant="primary" size="small" icon={<PlusIcon aria-hidden />} iconPosition="left">
          Legg til en aktivitet
        </Button>
        <div className="flex flex-1 justify-end">
          <Select label="" hideLabel className="w-64">
            <option value="navarende">Nåværende periode</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
