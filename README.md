# Modia-prototype — Team DAB

> **⚠️ Dette er en prototype**
> Repoet brukes til utforskning og intern testing av ideer, og har ingen funksjonell rolle i produksjon. Koden skal ikke driftsettes eller kobles til reelle systemer.

## Hva er dette?

En interaktiv prototype utviklet av Team DAB for å utforske og kommunisere ideer knyttet til brukeropplevelsen i Modia — primært aktivitetsplan, men også andre deler av arbeidsflaten.

Prototypen er et mer realistisk og klikkbart alternativ til Figma-skisser, og brukes til:

- **Designutforskning** — teste ut interaksjonsmønstre og layout
- **Kommunikasjon** — vise frem ideer til andre team og interessenter
- **Brukertesting** — støtte interne tester av brukeropplevelse

Utviklingen skjer primært med KI-verktøy (GitHub Copilot).

## Teknologi

- [Next.js](https://nextjs.org/) (App Router)
- [Aksel](https://aksel.nav.no/) — NAVs designsystem (`@navikt/ds-react`)
- TypeScript

## Kom i gang

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

## Testdata

All data i prototypen er fiktiv og laget utelukkende for demonstrasjonsformål. Ingen reelle brukere, fødselsnumre eller personopplysninger skal forekomme i kodebasen.

## Status

🧪 Aktiv prototype — ikke produksjonsklar

## Sikkerhetsregler for testdata

For å kunne bruke realistisk terminologi i UI (for eksempel «Fødselsnr.») uten å risikere ekte persondata, gjelder disse reglene:

- **Kun syntetiske testverdier er tillatt** i kildekoden (f.eks. Dolly/Tenor-genererte data).
- **Ingen gyldige fødselsnumre** skal forekomme.
- **Pull requests skal avvises** hvis guardrail-sjekken finner gyldig fnr.

Kjør kontroll lokalt:

```sh
npm run check:testdata
```
