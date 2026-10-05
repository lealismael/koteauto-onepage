import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build, collectPages } from './build-site.mjs';

const page = (url, date = '2026-10-01', extra = '') => `
<link href="${url}" rel="canonical"><meta content="Descrição" name="description">
${extra}<script type="application/ld+json">{"@type":"WebPage","dateModified":"${date}"}</script>`;

async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'koteauto-site-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  await writeFile(join(dir, 'index.html'), page('https://www.koteauto.com.br/'));
  return dir;
}

test('build mantém datas editoriais, inclui nova URL e exclui estudos do pacote', async t => {
  const dir = await fixture(t);
  await writeFile(join(dir, 'guia.html'), page('https://www.koteauto.com.br/guia', '2026-10-02'));
  await mkdir(join(dir, 'claude-lab'));
  await writeFile(join(dir, 'claude-lab', 'ensaio.html'), 'privado');
  await writeFile(join(dir, 'README.md'), 'interno');
  await mkdir(join(dir, 'assets'));
  await writeFile(join(dir, 'assets', 'style.css'), 'body{}');
  await build(dir);
  const xml = await readFile(join(dir, 'dist', 'sitemap.xml'), 'utf8');
  assert.match(xml, /<loc>https:\/\/www.koteauto.com.br\/guia<\/loc>/);
  assert.match(xml, /<lastmod>2026-10-01<\/lastmod>/);
  assert.match(xml, /<lastmod>2026-10-02<\/lastmod>/);
  assert.ok(!(await readdir(join(dir, 'dist'))).includes('claude-lab'));
  assert.ok(!(await readdir(join(dir, 'dist'))).includes('README.md'));
  assert.equal(await readFile(join(dir, 'dist', 'assets', 'style.css'), 'utf8'), 'body{}');
  await build(dir);
  assert.equal(await readFile(join(dir, 'dist', 'sitemap.xml'), 'utf8'), xml);
});

test('não inclui página noindex no sitemap', async t => {
  const dir = await fixture(t);
  await writeFile(join(dir, 'rascunho.html'), '<meta name="robots" content="noindex, follow">');
  assert.equal((await collectPages(dir)).length, 1);
});

test('rejeita canonical errado e data inválida', async t => {
  const dir = await fixture(t);
  await writeFile(join(dir, 'guia.html'), page('https://outro.com/guia'));
  await assert.rejects(collectPages(dir), /canonical/);
  await writeFile(join(dir, 'guia.html'), page('https://www.koteauto.com.br/guia', '2026-02-30'));
  await assert.rejects(collectPages(dir), /inválida/);
});

test('versão do CSS muda apenas quando seu conteúdo muda', async t => {
  const dir = await fixture(t);
  await mkdir(join(dir, 'assets'));
  await writeFile(join(dir, 'assets', 'style.css'), 'body{color:red}');
  await writeFile(join(dir, 'index.html'), page('https://www.koteauto.com.br/') + '<link href="/assets/style.css?v=antiga" rel="stylesheet">');
  await build(dir);
  const first = await readFile(join(dir, 'dist', 'index.html'), 'utf8');
  assert.match(first, /style\.css\?v=[a-f0-9]{12}/);
  await build(dir);
  assert.equal(await readFile(join(dir, 'dist', 'index.html'), 'utf8'), first);
  await writeFile(join(dir, 'assets', 'style.css'), 'body{color:green}');
  await build(dir);
  assert.notEqual(await readFile(join(dir, 'dist', 'index.html'), 'utf8'), first);
});
