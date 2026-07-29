<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

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
