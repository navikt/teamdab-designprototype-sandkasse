/**
 * Guardrail: Sjekker at ingen gyldige norske fødselsnumre (fnr) finnes i kildekoden.
 *
 * Syntetiske D-nummer og testdata fra Dolly/Tenor er OK — de vil ikke passere
 * fnr-validering med gyldige kontrollsifre OG gyldig dato.
 *
 * Kjøres via: npm run check:testdata
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const FILE_EXT = new Set([".ts", ".tsx", ".js", ".jsx"]);
const IDENT_REGEX = /\b\d{11}\b/g;

const K1 = [3, 7, 6, 1, 8, 9, 4, 5, 2];
const K2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (FILE_EXT.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

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

  // D-nummer: dag += 40; fiktivt fnr (Dolly): måned += 40
  if (day >= 41 && day <= 71) day -= 40;
  if (month >= 41 && month <= 52) month -= 40;

  if (!isValidDate(day, month, year)) return false;

  const c1 = mod11(K1, digits);
  if (c1 < 0 || c1 !== digits[9]) return false;

  const c2 = mod11(K2, [...digits.slice(0, 9), c1]);
  if (c2 < 0 || c2 !== digits[10]) return false;

  return true;
}

const files = walk(SRC_DIR);
const findings = [];

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matches = line.match(IDENT_REGEX);
    if (!matches) continue;

    for (const candidate of matches) {
      if (looksLikeValidFnr(candidate)) {
        findings.push({ file: rel, line: i + 1, candidate });
      }
    }
  }
}

if (findings.length > 0) {
  console.error("❌ Fant mulig gyldig fnr i kildekoden:");
  for (const f of findings) {
    console.error(`   - ${f.file}:${f.line} -> ${f.candidate}`);
  }
  process.exit(1);
}

console.log("✅ OK: Ingen gyldige fnr funnet i src/.");
