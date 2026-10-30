"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button, Checkbox, CheckboxGroup, Link, Modal, Radio, RadioGroup } from "@navikt/ds-react";
import { withBasePath } from "@/lib/basePath";
import { SPOR, SPOR_IDER, SporId } from "@/spor/spor";
import { Flyt, Oppsett, flytFraSti, medOppsett, startUrl } from "./oppsett";
import { nullstillVedOppstart } from "./nullstillVedOppstart";
import { useOppsett } from "./useOppsett";

// Lastes i rotlayouten og dekker dermed alle startsider, også de som ikke bruker useLagretTilstand.
nullstillVedOppstart();

// Den gule trekanten i hjørnet åpner demo-oppsettet. Under en brukertest er den bare en rolig markering,
// og ?demo=av fjerner den helt.
export function DemoHjorne() {
  const oppsett = useOppsett();
  const [apen, setApen] = useState(false);

  if (oppsett.skjulDemo) return null;

  return (
    <>
      <button type="button" className="demo-corner" aria-label="Åpne demo-oppsett" onClick={() => setApen(true)}>
        <span className="demo-corner__label" aria-hidden="true">DEMO</span>
        <span className="demo-corner__sublabel" aria-hidden="true">Designprototype</span>
      </button>
      <Modal open={apen} onClose={() => setApen(false)} header={{ heading: "Demo-oppsett" }} width="small">
        {apen && <DemoSkjema oppsett={oppsett} onAvbryt={() => setApen(false)} />}
      </Modal>
    </>
  );
}

function DemoSkjema({ oppsett, onAvbryt }: { oppsett: Oppsett; onAvbryt: () => void }) {
  const pathname = usePathname();
  const [flyt, setFlyt] = useState<Flyt>(flytFraSti(pathname));
  const [spor, setSpor] = useState<SporId>(oppsett.spor);
  const [scenario, setScenario] = useState(oppsett.scenario);
  const [forslagSomVarsel, setForslagSomVarsel] = useState(oppsett.forslagSomVarsel);
  const [visIngenDelmalVarsel, setVisIngenDelmalVarsel] = useState(oppsett.visIngenDelmalVarsel);
  const [nullstill, setNullstill] = useState(false);

  const valgtSpor = SPOR[spor];

  const byttSpor = (id: SporId) => {
    setSpor(id);
    setScenario(SPOR[id].scenarioer[0].id);
  };

  // Full sidelasting gir en ren start, uten rester av forrige oppsett i minnet.
  const apne = () => {
    const nytt: Oppsett = {
      spor,
      scenario,
      forslagSomVarsel: valgtSpor.harInnstillinger && forslagSomVarsel,
      visIngenDelmalVarsel: valgtSpor.harInnstillinger && visIngenDelmalVarsel,
      skjulDemo: false,
    };
    window.location.assign(withBasePath(startUrl(flyt, nytt, nullstill)));
  };

  return (
    <>
      <Modal.Body className="flex flex-col gap-6">
        <RadioGroup legend="Flyt" value={flyt} onChange={(v: Flyt) => setFlyt(v)}>
          <Radio value="veileder" description="Starter i Min oversikt, velg en person.">Veileder</Radio>
          <Radio value="bruker" description="Starter i brukerens aktivitetsplan.">Bruker</Radio>
        </RadioGroup>

        <RadioGroup legend="Spor" value={spor} onChange={(v: SporId) => byttSpor(v)}>
          {SPOR_IDER.map((id) => (
            <Radio key={id} value={id} description={SPOR[id].beskrivelse}>{SPOR[id].label}</Radio>
          ))}
        </RadioGroup>

        <RadioGroup legend="Scenario" value={scenario} onChange={(v: string) => setScenario(v)}>
          {valgtSpor.scenarioer.map((s) => (
            <Radio key={s.id} value={s.id} description={s.beskrivelse}>{s.label}</Radio>
          ))}
        </RadioGroup>

        {valgtSpor.harInnstillinger && (
          <CheckboxGroup
            legend="Innstillinger for dette sporet"
            value={[forslagSomVarsel && "forslag", visIngenDelmalVarsel && "delmal"].filter(Boolean) as string[]}
            onChange={(valgte: string[]) => {
              setForslagSomVarsel(valgte.includes("forslag"));
              setVisIngenDelmalVarsel(valgte.includes("delmal"));
            }}
          >
            <Checkbox value="forslag">Vis forslag som varsel</Checkbox>
            <Checkbox value="delmal">Vis «ingen delmål»-varsel</Checkbox>
          </CheckboxGroup>
        )}

        <Checkbox checked={nullstill} onChange={(e) => setNullstill(e.target.checked)}>
          Start på nytt (nullstill lagret data for dette scenarioet)
        </Checkbox>

        {spor === "framtid" && (
          <Link href={withBasePath(medOppsett("/minaktivitetsplan/onboarding-oversikt", { ...oppsett, spor, scenario, forslagSomVarsel, visIngenDelmalVarsel }))}>
            Se flyt for onboarding (oversikt)
          </Link>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={apne}>Åpne</Button>
        <Button variant="tertiary" onClick={onAvbryt}>Avbryt</Button>
      </Modal.Footer>
    </>
  );
}
