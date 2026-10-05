import { readdir, readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://www.koteauto.com.br';

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)]
    .map(([, key, value]) => [key.toLowerCase(), value]));
}

export async function collectPages(directory) {
  const names = (await readdir(directory)).filter(name => name.endsWith('.html')).sort();
  const pages = [];
  for (const file of names) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.html$/.test(file)) {
      throw new Error(`${file}: use um nome de página com letras minúsculas, números e hífens.`);
    }
    const html = await readFile(resolve(directory, file), 'utf8');
    const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag));
    if (metas.some(meta => ['robots', 'googlebot'].includes(meta.name?.toLowerCase()) &&
      /\b(noindex|none)\b/i.test(meta.content))) continue;
    const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag))
      .filter(link => link.rel?.toLowerCase() === 'canonical');
    const expected = `${origin}/${file === 'index.html' ? '' : file.slice(0, -5)}`;
    if (canonicals.length !== 1 || canonicals[0].href !== expected) {
      throw new Error(`${file}: canonical deve ser ${expected}`);
    }
    if (!metas.some(meta => meta.name === 'description' && meta.content?.trim())) {
      throw new Error(`${file}: falta meta description.`);
    }
    const dates = new Set();
    function visit(value) {
      if (!value || typeof value !== 'object') return;
      if (value.dateModified) dates.add(value.dateModified);
      Object.values(value).forEach(visit);
    }
    for (const [, tag, json] of html.matchAll(/(<script\b[^>]*>)([\s\S]*?)<\/script>/gi)) {
      if (attributes(tag).type === 'application/ld+json') visit(JSON.parse(json));
    }
    if (dates.size !== 1) throw new Error(`${file}: informe uma data editorial dateModified coerente no JSON-LD.`);
    const [lastmod] = dates;
    if (typeof lastmod !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(lastmod) ||
      !Number.isFinite(Date.parse(lastmod)) || new Date(lastmod).toISOString().slice(0, 10) !== lastmod ||
      lastmod > new Date().toISOString().slice(0, 10)) {
      throw new Error(`${file}: dateModified inválida ou futura: ${lastmod}`);
    }
    pages.push({ file, url: expected, lastmod });
  }
  if (!pages.some(page => page.file === 'index.html')) throw new Error('Home indexável não encontrada.');
  return pages.sort((a, b) => a.file === 'index.html' ? -1 : b.file === 'index.html' ? 1 : a.file.localeCompare(b.file));
}

export function sitemap(pages) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    pages.map(page => `  <url>\n    <loc>${page.url}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n  </url>`).join('\n') +
    '\n</urlset>\n';
}

export async function build(directory, sitemapOnly = false) {
  const pages = await collectPages(directory);
  const xml = sitemap(pages);
  if (sitemapOnly) {
    await writeFile(resolve(directory, 'sitemap.xml'), xml);
    return pages;
  }
  const output = resolve(directory, 'dist');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  // Mudar a URL quando o CSS/JS mudar evita reutilizar estilos de um deploy anterior.
  async function versionAssets(html) {
    const pattern = /((?:href|src)=["'])(\/assets\/[a-zA-Z0-9_./-]+\.(?:css|js))(?:\?[^"']*)?(["'])/g;
    const hashes = new Map();
    for (const [, , url] of html.matchAll(pattern)) {
      if (url.includes('..')) throw new Error(`Caminho de asset inválido: ${url}`);
      const bytes = await readFile(resolve(directory, '.' + url));
      hashes.set(url, createHash('sha256').update(bytes).digest('hex').slice(0, 12));
    }
    return html.replace(pattern, (_, prefix, url, quote) => `${prefix}${url}?v=${hashes.get(url)}${quote}`);
  }
  // Só arquivos públicos: não publicar docs, estudos locais, scripts ou testes.
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ((entry.isDirectory() && entry.name === 'assets') ||
      (entry.isFile() && (/\.(html|png|webp|avif|jpg|jpeg|svg|ico)$/i.test(entry.name) ||
        ['robots.txt', 'llms.txt'].includes(entry.name)))) {
      if (entry.isFile() && entry.name.endsWith('.html')) {
        await writeFile(resolve(output, entry.name), await versionAssets(await readFile(resolve(directory, entry.name), 'utf8')));
      } else {
        await cp(resolve(directory, entry.name), resolve(output, entry.name), { recursive: true });
      }
    }
  }
  await writeFile(resolve(output, 'sitemap.xml'), xml);
  return pages;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pages = await build(root, process.argv.includes('--sitemap-only'));
  console.log(`${pages.length} URLs validadas; sitemap gerado${process.argv.includes('--sitemap-only') ? ' na raiz' : ' em dist/'}.`);
}
