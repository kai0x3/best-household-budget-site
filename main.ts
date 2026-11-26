// Dana Rumah — the hand-in program for best-household-budget-site-20261126-1457.
// Node 22, standard library only. It takes this repository's app/ (the static
// household-budget site) and screenshots/ (four renders of it running) and
// hands them to the grader: both folders are copied into the output
// directory, then /output/dossier.json is written with buildDossier from the
// vendored make.fun library, which must stay byte for byte the kit's copy.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appOut = join(outputDir, 'app');
const shotsOut = join(outputDir, 'screenshots');

mkdirSync(outputDir, { recursive: true });

// Start from a clean app/ + screenshots/ so a stale file can never survive
// from an earlier run; both runs must write the same bytes.
rmSync(appOut, { recursive: true, force: true });
rmSync(shotsOut, { recursive: true, force: true });
cpSync(join(repoRoot, 'app'), appOut, { recursive: true });
mkdirSync(shotsOut, { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), shotsOut, { recursive: true });
}

// The scorer's own caps (from the kit's gate): the dossier text is capped at
// 160 KiB; screenshots at most 4 files, each at most 256 KiB; app/ at most
// 993 files and directories and 16 MiB in all.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
