---
applyTo: "src/**/*.{ts,tsx}"
---

# Testdata-konvensjoner

Denne appen er en demo/prototype som deles med testbrukere. Mock- og testdata må aldri kunne forveksles med reelle personopplysninger.

## Navn

Bruk aldri egennavn (fornavn/etternavn) i mock- eller testdata — de kan ved tilfeldighet sammenfalle med navnet til en virkelig person.

Bruk i stedet ord-kombinasjoner i formatet **"Substantiv, Adjektiv"** (Etternavn, Fornavn), etter samme praksis som andre Nav-testløsninger:

- `Kunnskap, Fattig`
- `Avstand, Oversiktlig`
- `Utsikt, Stille`
- `Rutine, Åpen`

## Fødselsnummer-lignende tall

Bruk aldri tilfeldige 11-sifrede tall som testdata for fødselsnummer/fnr — de kan ved tilfeldighet være et gyldig, reelt fødselsnummer.

Dag-delen (de to første sifrene) skal alltid være **"00"**. Dag 00 er ugyldig i ethvert ekte fødselsnummer, D-nummer og Nav-internt syntetisk testnummer, så tallet kan aldri sammenfalle med et reelt.

- Eksempel: `00010112345`

## Eksisterende bruk

Se [src/components/BrukerTable.tsx](../../src/components/BrukerTable.tsx) og [src/components/Visittkort.tsx](../../src/components/Visittkort.tsx) for gjeldende eksempler.
