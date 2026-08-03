import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const manifestPath = resolve(root, 'styles.generated.integrity.json');
const outputPath = resolve(root, 'styles.generated.css');
const sourceExtensions = new Set(['.ts', '.tsx', '.html', '.css', '.cjs']);
const ignoredDirectories = new Set(['.git', '.wrangler', 'dist', 'node_modules']);

async function readNormalizedText(path) {
  return (await readFile(path, 'utf8')).replaceAll('\r\n', '\n');
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name) && entry.name !== 'scripts') {
        files.push(...await collectFiles(resolve(directory, entry.name)));
      }
      continue;
    }
    const fullPath = resolve(directory, entry.name);
    if (sourceExtensions.has(extname(entry.name)) && fullPath !== outputPath) files.push(fullPath);
  }
  return files;
}

async function hashSources() {
  const hash = createHash('sha256');
  const files = (await collectFiles(root)).sort();
  for (const file of files) {
    hash.update(relative(root, file).replaceAll('\\', '/'));
    hash.update('\0');
    hash.update(await readNormalizedText(file));
    hash.update('\0');
  }
  return hash.digest('hex');
}

async function hashFile(path) {
  return createHash('sha256').update(await readNormalizedText(path)).digest('hex');
}

const mode = process.argv[2];
const actual = {
  generator: 'tailwindcss@3.4.19',
  sourceSha256: await hashSources(),
  outputSha256: await hashFile(outputPath),
};

if (mode === 'stamp') {
  await writeFile(manifestPath, `${JSON.stringify(actual, null, 2)}\n`, 'utf8');
  console.log(`Stamped ${relative(root, manifestPath)}`);
} else if (mode === 'check') {
  const expected = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (expected.generator !== actual.generator
      || expected.sourceSha256 !== actual.sourceSha256
      || expected.outputSha256 !== actual.outputSha256) {
    throw new Error('Generated Tailwind CSS is stale or modified. Run npm run css:build and review the diff.');
  }
  console.log(`Verified ${actual.generator} static CSS integrity`);
} else {
  throw new Error('Usage: node scripts/tailwind-integrity.mjs <stamp|check>');
}
