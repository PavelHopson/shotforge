import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const requiredVersion = '3.4.19';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const require = createRequire(import.meta.url);

let packagePath;
try {
  packagePath = require.resolve('tailwindcss/package.json', { paths: [root] });
} catch {
  throw new Error(`Local tailwindcss@${requiredVersion} is required. Refusing an implicit network install.`);
}

const metadata = JSON.parse(await readFile(packagePath, 'utf8'));
if (metadata.version !== requiredVersion) {
  throw new Error(`Expected tailwindcss@${requiredVersion}, found ${metadata.version || 'unknown'}.`);
}

const cliPath = resolve(dirname(packagePath), 'lib', 'cli.js');
const build = spawnSync(process.execPath, [
  cliPath,
  '-c', resolve(root, 'tailwind.config.cjs'),
  '-i', resolve(root, 'styles.css'),
  '-o', resolve(root, 'styles.generated.css'),
  '--minify',
], { cwd: root, stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);

const stamp = spawnSync(process.execPath, [resolve(root, 'scripts', 'tailwind-integrity.mjs'), 'stamp'], {
  cwd: root,
  stdio: 'inherit',
});
if (stamp.status !== 0) process.exit(stamp.status ?? 1);
