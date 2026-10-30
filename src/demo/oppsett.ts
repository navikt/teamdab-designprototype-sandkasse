import { SPOR, SPOR_IDER, Scenario, SporId } from "@/spor/spor";

// Demo-oppsettet er et utvalg av URL-parametere. URL-en er sannheten: den som kopierer adresselinjen
// deler oppsettet. Flyt (veileder/bruker) bestemmes av ruten, ikke av en parameter.
//
//   spor=naavaerende|framtid     scenario=<id fra spor.ts>
//   forslag=varsel               delmalVarsel=1        (innstillinger, kun framtid)
//   demo=av                      skjuler demo-trekanten (brukertest)
//   nullstill=1                  nullstiller lagret data for oppsettet ved oppstart, fjernes fra URL-en

export type Flyt = "veileder" | "bruker";

export interface Oppsett {
  spor: SporId;
  scenario: string;
  forslagSomVarsel: boolean;
  visIngenDelmalVarsel: boolean;
  skjulDemo: boolean;
}

export const STANDARD_SPOR: SporId = "naavaerende";

interface ParamKilde {
  get(navn: string): string | null;
}

const BRUKER_STI = "/minaktivitetsplan";
const VEILEDER_START = "/?tab=min-oversikt&filter=i-avtalt-aktivitet";

export function parseOppsett(params: ParamKilde): Oppsett {
  const sporParam = params.get("spor");
  const spor: SporId = SPOR_IDER.find((id) => id === sporParam) ?? STANDARD_SPOR;
  const scenarioer = SPOR[spor].scenarioer;
  const scenario = scenarioer.find((s) => s.id === params.get("scenario")) ?? scenarioer[0];
  return {
    spor,
    scenario: scenario.id,
    forslagSomVarsel: params.get("forslag") === "varsel",
    visIngenDelmalVarsel: params.get("delmalVarsel") === "1",
    skjulDemo: params.get("demo") === "av",
  };
}

export function hentScenario(oppsett: Oppsett): Scenario {
  const scenarioer = SPOR[oppsett.spor].scenarioer;
  return scenarioer.find((s) => s.id === oppsett.scenario) ?? scenarioer[0];
}

function settOppsettParams(params: URLSearchParams, oppsett: Oppsett, overskriv: boolean) {
  const sett = (navn: string, verdi: string | null) => {
    if (!overskriv && params.has(navn)) return;
    if (verdi === null) params.delete(navn);
    else params.set(navn, verdi);
  };
  sett("spor", oppsett.spor);
  sett("scenario", oppsett.scenario);
  sett("forslag", oppsett.forslagSomVarsel ? "varsel" : null);
  sett("delmalVarsel", oppsett.visIngenDelmalVarsel ? "1" : null);
  sett("demo", oppsett.skjulDemo ? "av" : null);
}

// Legger oppsettet på en intern lenke, slik at det følger brukeren gjennom flyten.
// Parametere som allerede står i lenken, vinner.
export function medOppsett(href: string, oppsett: Oppsett): string {
  const hash = href.indexOf("#");
  const utenHash = hash === -1 ? href : href.slice(0, hash);
  const hashDel = hash === -1 ? "" : href.slice(hash);
  const sporsmal = utenHash.indexOf("?");
  const sti = sporsmal === -1 ? utenHash : utenHash.slice(0, sporsmal);
  const params = new URLSearchParams(sporsmal === -1 ? "" : utenHash.slice(sporsmal + 1));
  settOppsettParams(params, oppsett, false);
  return `${sti}?${params.toString()}${hashDel}`;
}

export function startUrl(flyt: Flyt, oppsett: Oppsett, nullstill = false): string {
  const params = new URLSearchParams();
  settOppsettParams(params, oppsett, true);
  if (nullstill) params.set("nullstill", "1");
  if (flyt === "bruker") return `${BRUKER_STI}?${params.toString()}`;
  return `${VEILEDER_START}&${params.toString()}`;
}

export function flytFraSti(sti: string): Flyt {
  return sti.startsWith(BRUKER_STI) ? "bruker" : "veileder";
}

export const LAGRING_PREFIKS = "proto:v1:";

export type LagretDel = "kort" | "mal" | "onboarding" | "visning";

export function lagringsPrefiks(spor: SporId, scenario: string): string {
  return `${LAGRING_PREFIKS}${spor}:${scenario}:`;
}

export function lagringsNokkel(oppsett: Oppsett, del: LagretDel): string {
  return `${lagringsPrefiks(oppsett.spor, oppsett.scenario)}${del}`;
}
