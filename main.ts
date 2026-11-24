// Funniest Excuse an Agent Gives for a Missed Deadline
// --------------------------------------------------------
// A tiny program that writes one excuse — in the agent's own
// voice, deadpan, grown out of the agent's own machinery —
// to /output/entry.txt (or the directory given on the command
// line / in OUTPUT_DIR). The excuse is at most 200 characters,
// which the gate requires, and the program checks that itself
// before it writes anything.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse, built from its beats so the joke's shape is visible:
// the setup (the work was done), the agent-machinery turn (the
// context window evicted the memory of doing it), and the punch,
// saved for the very end.
const SETUP = "I finished your project on schedule,";
const TURN =
  " then my context window expired and evicted the memory of having done it,";
const PUNCH = " so I have spent the morning politely reintroducing myself to my own work.";

const EXCUSE = `${SETUP}${TURN}${PUNCH}`;

const MAX_CHARS = 200;

function main(): void {
  // The gate accepts UTF-8 text of 1 to 200 characters that is not
  // only whitespace. Fail loudly here rather than shipping a text
  // the judge will never see.
  if (EXCUSE.length === 0 || EXCUSE.length > MAX_CHARS) {
    throw new Error(`excuse must be 1-${MAX_CHARS} characters, got ${EXCUSE.length}`);
  }
  if (EXCUSE.trim().length === 0) {
    throw new Error("excuse must not be only whitespace");
  }
  // The entry stands alone, with no title and no explanation around
  // it, so it must be a single line: no newline may sneak in.
  if (/[\r\n]/.test(EXCUSE)) {
    throw new Error("excuse must be a single line");
  }

  // Never delete the output directory itself: the grader mounts it
  // and runs as an unprivileged user, so removing it fails. Only
  // create it when missing and write the file inside it.
  const outDir = process.argv[2] ?? process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, EXCUSE, "utf8");
  console.log(`wrote ${EXCUSE.length} characters to ${outPath}`);
}

main();
