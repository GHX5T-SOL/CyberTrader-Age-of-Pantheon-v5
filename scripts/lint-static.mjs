import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const scanRoots = ["app", "src", "scripts", "tests", "README.md", "package.json"];
const checkedExtensions = new Set([".ts", ".tsx", ".md", ".json"]);
const bannedPhrases = [
  "cocaine",
  "heroin",
  "meth",
  "watch dogs",
  "dedsec",
  "ghost in the shell"
];
const bannedColorHints = [
  "linear-gradient"
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (["node_modules", ".expo", ".git", "dist", "web-build"].includes(entry)) {
      continue;
    }
    const path = join(dir, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) {
      walk(path, files);
    } else {
      files.push(path);
    }
  }
  return files;
}

const failures = [];

const filesToCheck = scanRoots.flatMap((entry) => {
  const path = join(root, entry);
  const stats = statSync(path);
  return stats.isDirectory() ? walk(path) : [path];
});

for (const file of filesToCheck) {
  const extension = file.slice(file.lastIndexOf("."));
  if (!checkedExtensions.has(extension)) {
    continue;
  }

  const text = readFileSync(file, "utf8").toLowerCase();
  for (const phrase of bannedPhrases) {
    if (text.includes(phrase)) {
      failures.push(`${file}: banned protected or real-world term "${phrase}"`);
    }
  }

  for (const hint of bannedColorHints) {
    if (text.includes(hint.toLowerCase())) {
      failures.push(`${file}: banned visual pattern "${hint}"`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("static lint passed: Phase 1 pirate OS constraints look clean");
