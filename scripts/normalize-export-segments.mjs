import { copyFile, readdir } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";

// Next.js issue 85374: Windows exports some segment paths as nested folders.
const output = resolve("out");
let aliases = 0;

async function copySegmentFiles(directory, route) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await copySegmentFiles(path, route);
    if (entry.isFile() && entry.name.endsWith(".txt")) {
      const segment = relative(route, path).split(sep).join(".");
      await copyFile(path, join(route, segment));
      aliases += 1;
    }
  }
}

async function visitRoutes(route) {
  for (const entry of await readdir(route, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "_next") continue;
    const path = join(route, entry.name);
    if (entry.name.startsWith("__next.")) await copySegmentFiles(path, route);
    else await visitRoutes(path);
  }
}

await visitRoutes(output);
if (aliases) console.log("Normalized " + aliases + " static navigation segment paths.");
