import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export function redirectMap(text) {
  const redirects = new Map();
  const quote = value => JSON.stringify(value).replaceAll('$', '\\$');
  for (const line of text.split(/\r?\n/)) {
    const rule = line.trim();
    if (!rule || rule.startsWith('#')) continue;
    const [source, target, status, ...extra] = rule.split(/\s+/);
    if (extra.length || status !== '301' || !source?.startsWith('/') || !target?.startsWith('/') ||
        source.startsWith('//') || target.startsWith('//') || /[?*#]/.test(source)) {
      throw new Error(`Unsupported redirect rule: ${rule}`);
    }
    if (source === target) continue;
    // Preserve both forms of old directory URLs without a redirect chain.
    const sources = source.endsWith('/') ? [source, source.slice(0, -1)] : [source];
    for (const path of sources) {
      if (redirects.has(path) && redirects.get(path) !== target) {
        throw new Error(`Conflicting redirect for ${path}`);
      }
      redirects.set(path, target);
    }
  }
  return [...redirects].sort(([a], [b]) => a.localeCompare(b))
    .map(([source, target]) => `${quote(source)} ${quote(target)};`).join('\n') + '\n';
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const map = redirectMap(await readFile('dist/_redirects', 'utf8'));
  await writeFile('nginx-redirects.map', map);
}
