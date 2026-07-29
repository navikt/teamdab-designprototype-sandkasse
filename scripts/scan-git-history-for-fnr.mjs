/**
 * Scanner hele git-historikken for gyldige norske fødselsnumre (fnr).
 *
 * Kjøres via: node scripts/scan-git-history-for-fnr.mjs
 *
 * Rapporten viser commit-hash, filnavn og linjenummer for hvert treff.
 * Bruk dette før overføring av repo til ny organisasjon.
 */

import { execSync } from "node:child_process";

const IDENT_REGEX = /\b\d{11}\b/g;
const K1 = [3, 7, 6, 1, 8, 9, 4, 5, 2];
const K2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

function mod11(weights, digits) {
  const sum = weights.reduce((acc, w, i) => acc + w * digits[i], 0);
  const rem = sum % 11;
  if (rem === 0) return 0;
  if (rem === 1) return -1;
  return 11 - rem;
}

function isValidDate(dd, mm, yy) {
  const year = yy <= 39 ? 2000 + yy : 1900 + yy;
  const d = new Date(Date.UTC(year, mm - 1, dd));
  return (
    d.getUTCFullYear() === year &&
    d.getUTCMonth() === mm - 1 &&
    d.getUTCDate() === dd
  );
}

function looksLikeValidFnr(value) {
  if (!/^\d{11}$/.test(value)) return false;
  const digits = value.split("").map(Number);

  let day = Number(value.slice(0, 2));
  let month = Number(value.slice(2, 4));
  const year = Number(value.slice(4, 6));

  if (day >= 41 && day <= 71) day -= 40;
  if (month >= 41 && month <= 52) month -= 40;

  if (!isValidDate(day, month, year)) return false;

  const c1 = mod11(K1, digits);
  if (c1 < 0 || c1 !== digits[9]) return false;

  const c2 = mod11(K2, [...digits.slice(0, 9), c1]);
  if (c2 < 0 || c2 !== digits[10]) return false;

  return true;
}

// Hent alle commit-hasher i historikken
const commits = execSync("git log --all --format=%H", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean);

console.log(`Scanner ${commits.length} commits...\n`);

const findings = [];

for (const hash of commits) {
  // Hent diff for denne commiten (kun tillagte linjer, dvs. + linjer)
  let diff;
  try {
    diff = execSync(`git show --unified=0 ${hash}`, {
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
    });
  } catch {
    // Merge-commits eller tomme commits kan feile — hopp over
    continue;
  }

  let currentFile = null;
  let lineNum = 0;

  for (const line of diff.split("\n")) {
    // Spor hvilken fil vi er i
    if (line.startsWith("+++ b/")) {
      currentFile = line.slice(6);
      continue;
    }
    // Spor linjenummer fra hunk-header: @@ -a,b +c,d @@
    const hunkMatch = line.match(/^@@ [^+]*\+(\d+)/);
    if (hunkMatch) {
      lineNum = parseInt(hunkMatch[1], 10) - 1;
      continue;
    }
    // Tell linjer (både kontekst og tillagte)
    if (line.startsWith("+") && !line.startsWith("+++")) {
      lineNum++;
      const content = line.slice(1);
      const matches = content.match(IDENT_REGEX);
      if (matches) {
        for (const candidate of matches) {
          if (looksLikeValidFnr(candidate)) {
            findings.push({ hash: hash.slice(0, 8), file: currentFile, line: lineNum, candidate });
          }
        }
      }
    } else if (!line.startsWith("-")) {
      lineNum++;
    }
  }
}

if (findings.length === 0) {
  console.log("✅ Ingen gyldige fnr funnet i git-historikken.");
  process.exit(0);
}

console.error(`❌ Fant ${findings.length} mulig(e) gyldige fnr i git-historikken:\n`);
for (const f of findings) {
  console.error(`   commit ${f.hash}  ${f.file}:${f.line}  →  ${f.candidate}`);
}
console.error(`
Disse verdiene lå på et tidspunkt i en commit, selv om de er fjernet fra HEAD.
Før overføring til ny org bør historikken ryddes med f.eks.:
  git filter-repo --replace-text <(echo '${findings.map(f => f.candidate).join("\\n")}')
Se: https://github.com/newren/git-filter-repo
`);
process.exit(1);
