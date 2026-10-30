<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:demo-oppsett-rules -->
## Demo-oppsett: spor, flyter og scenarioer

Prototypen har to levende spor. Begge utvikles aktivt.

| Spor (`spor`) | Innhold |
|---|---|
| `naavaerende` | Aktivitetsplanen slik den er i dag. Små og mellomstore endringer. |
| `framtid` | Framtidsvisjonen. Større idéer og konsepter. |

Hvert spor har to flyter. Rollen følger ruten, ikke en parameter.

- Veileder: `/?tab=min-oversikt&filter=i-avtalt-aktivitet` (Oversikt) → `/personprofil`.
- Bruker: `/minaktivitetsplan`.

Scenarioer (komplette startpunkter, kombineres ikke) er definert i `src/spor/spor.ts`: `naavaerende` har `aktiviteter` og `tom`; `framtid` har `aktiviteter`, `tom` (med onboarding) og `ungdomsprogram`.

### URL-kontrakten

| Parameter | Betydning |
|---|---|
| `spor` | `naavaerende` (standard) eller `framtid` |
| `scenario` | Scenario-id innen sporet |
| `forslag=varsel` | Vis forslag som varsel (framtid, bruker) |
| `delmalVarsel=1` | Vis ingen delmål-varsel (framtid, bruker) |
| `demo=av` | Skjul den gule demo-trekanten helt (brukertest) |
| `nullstill=1` | Tøm lagret data for spor og scenario ved oppstart, deretter fjernes parameteren |

Den gule DEMO-trekanten (`src/demo/DemoHjorne.tsx`) åpner en modal der oppsettet velges og URL-en kan kopieres. Veileders «Se som bruker» (Visittkort) er en ekte funksjon og ligger utenfor demo-modalen.

### Tre regler

1. URL-en beskriver oppsettet. Alt som kan velges, ligger i URL-en (`src/demo/oppsett.ts`).
2. Data lagres per spor og scenario i localStorage: `proto:v1:{spor}:{scenario}:{kort|mal|onboarding|visning}`. Bruk `useLagretTilstand` (`src/demo/useLagretTilstand.ts`), aldri `localStorage` direkte.
3. Samme oppsett fortsetter, nytt oppsett starter fra scenarioet.

### Navigasjon

All intern navigasjon må bære oppsettet videre. Bruk `useDemoRouter` (`href`, `push`, `replace`, `back`) eller `medOppsett()` fra `src/demo/`. Bruk `withBasePath()` for rå `<a href>` (GitHub Pages). `useSearchParams` krever Suspense; rot-layouten har en.

### Legge til nytt spor eller scenario

1. Spor: legg til i `SporId` og `SPOR` i `src/spor/spor.ts`, og skjermene i `SKJERMER` i `src/spor/skjermer.tsx`.
2. Scenario: legg til i sporets `scenarioer` i `spor.ts` (`lagKort`, `startMedOnboarding`, `startVisning`, `timeplan`).
3. Nye parametere: utvid `parseOppsett` og `medOppsett` i `oppsett.ts`, og legg valget i `DemoHjorne.tsx`.

### Kodeplassering

- `src/spor/naavaerende/`: nåværende aktivitetsplan og bruker-side.
- `src/spor/framtid/`: framtidsskjermer. `FramtidVeilederAktivitetsplan` er en plassholder (ny plan innebygd i veileders personprofil).
- `src/components/bruker/`: hører til framtid.
- `src/components/aktivitetsplan/`: delt.
<!-- END:demo-oppsett-rules -->

<!-- BEGIN:testdata-rules -->
## Testdata og prototype-innhold

Denne appen er en UX-prototype. All testdata skal være umulig å forveksle med reelle data. Følg disse reglene strengt:

### Personnavn
Bruk **ordkombinasjoner av norske fellesord** (substantiv + adjektiv), aldri egennavn:
- Format: `"Substantiv, Adjektiv"` — f.eks. `"Kunnskap, Fattig"`, `"Utsikt, Stille"`, `"Balanse, Skarp"`
- Aldri: fornavn, etternavn, kjente navn, navn som ligner ekte norske navn

### Fødselsnummer / D-nummer
Bruk alltid dagdelen `00` (to første siffer i fnr = `00`), f.eks. `"00010112345"`.
- Dag `00` er ugyldig i alle norske nummersystemer (fødselsnummer, D-nummer, syntetisk nummer) og kan aldri feiltolkes som et ekte nummer.
- Aldri bruk tilfeldige 11-sifrede tall — de kan tilfeldigvis matche et ekte nummer.

### Lokasjoner, virksomheter og steder
- **Ingen navn på virkelige steder** — ikke gater, byer, Nav-kontorer, bydeler, skoler, sykehus
- **Ingen navn på virkelige virksomheter** — ikke bedrifter, organisasjoner, butikker
- Bruk generiske rollebeskrivelser: `"Arbeidsgiver"`, `"Behandler"`, `"Skole"` — ikke `"Fretex"`, `"Kulturhuset"`, `"NAV Grünerløkka"`
- Kortitler og beskrivelser skal heller ikke inneholde lokasjoner: ikke `"Arbeidstrening hos Fretex"`, men `"Arbeidstrening"`

### Aktivitetstyper
Bruk typestrengene fra `aktivitetTypeMap` i `src/utils/textMappers.ts` i prod-appen (`aktivitetsplan`-repoet). Ikke finn opp nye typer.

### Datoer
Bruk datoer i fremtiden eller nær fortid. Unngå spesifikke datoer som kan knyttes til reelle hendelser.
<!-- END:testdata-rules -->
