import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const builder = await import('../scripts/build.mjs').catch(() => null);
const interactions = await import('../assets/app.js').catch(() => null);

test('project filters combine category and every search word', () => {
  assert.equal(typeof interactions?.matchesFilter, 'function', 'Project filtering is not implemented yet');
  const item = { category: 'web', search: 'STI Vio-Log React Node.js PostgreSQL' };
  assert.equal(interactions.matchesFilter(item, ' NODE   postgres ', 'web'), true);
  assert.equal(interactions.matchesFilter(item, 'react', 'mobile'), false);
  assert.equal(interactions.matchesFilter(item, 'react missing', 'all'), false);
  assert.equal(interactions.matchesFilter(item, '  ', 'all'), true);
});

test('invalid theme preferences use the system setting', () => {
  assert.equal(typeof interactions?.resolveTheme, 'function', 'Theme preferences are not implemented yet');
  assert.equal(interactions.resolveTheme('light', true), 'light');
  assert.equal(interactions.resolveTheme('dark', false), 'dark');
  assert.equal(interactions.resolveTheme('corrupted', true), 'dark');
  assert.equal(interactions.resolveTheme(null, false), 'light');
});

test('build produces twelve substantive routes with working local links and no chatbot', async () => {
  assert.equal(typeof builder?.buildSite, 'function', 'Static generation is not implemented yet');
  const directory = await mkdtemp(join(tmpdir(), 'ej-portfolio-test-'));
  try {
    await builder.buildSite({ outDir: directory });
    const routes = ['', 'about', 'projects', 'activity', 'stack', 'training', 'resume', 'contact', 'projects/sti-vio-log', 'projects/toyota-heritage-ph', 'projects/memochro', 'projects/kwiztorya'];
    for (const route of routes) {
      const html = await readFile(join(directory, route, 'index.html'), 'utf8');
      assert.match(html, /<main\b/);
      assert.match(html, /<h1\b/);
      assert.match(html, /name="robots" content="noindex/);
      assert.doesNotMatch(html, /Ask EJ|chatbot|groq|upstash|href="#"/i);
      for (const match of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)) {
        const pathname = decodeURIComponent(match[1]);
        if (pathname.startsWith('/api/')) continue;
        await access(join(directory, pathname.endsWith('/') ? `${pathname}index.html` : pathname));
      }
    }
    const home = await readFile(join(directory, 'index.html'), 'utf8');
    for (const anchor of ['top', 'about', 'skills', 'projects', 'experience', 'education', 'contact']) {
      assert.match(home, new RegExp(`id="${anchor}"`));
    }
    await assert.rejects(access(join(directory, 'resume.pdf')));
    await assert.rejects(access(join(directory, 'picme.jpg')));
  } finally {
    assert.ok(resolve(directory).startsWith(resolve(tmpdir()) + '\\ej-portfolio-test-') || resolve(directory).startsWith(resolve(tmpdir()) + '/ej-portfolio-test-'));
    await rm(directory, { recursive: true, force: true });
  }
});

test('release build refuses a missing canonical origin', async () => {
  assert.equal(typeof builder?.buildSite, 'function', 'Release gating is not implemented yet');
  await assert.rejects(builder.buildSite({ release: true, origin: '' }), /SITE_URL HTTPS origin/);
});

test('approved release builds indexable pages with canonical URLs and a sitemap', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'ej-portfolio-release-'));
  const origin = 'https://portfolio.example';
  try {
    const routes = await builder.buildSite({ outDir: directory, release: true, origin });
    const sitemap = await readFile(join(directory, 'sitemap.xml'), 'utf8');
    for (const route of routes.filter(route => route !== '/404.html')) {
      const html = await readFile(join(directory, route, 'index.html'), 'utf8');
      assert.ok(html.includes(`rel="canonical" href="${origin}${route}"`));
      assert.match(html, /name="robots" content="index,follow"/);
      assert.ok(sitemap.includes(`<loc>${origin}${route}</loc>`));
    }
    assert.doesNotMatch(sitemap, /404\.html/);
    assert.equal(await readFile(join(directory, 'robots.txt'), 'utf8'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('canonical URLs reject query strings, credentials, fragments, and non-root paths', async () => {
  assert.equal(typeof builder?.buildSite, 'function');
  for (const origin of ['https://portfolio.example?preview=1', 'https://name:secret@portfolio.example', 'https://portfolio.example#home', 'https://portfolio.example/subdirectory', 'http://portfolio.example']) {
    await assert.rejects(builder.buildSite({ release: true, origin }), /SITE_URL/);
  }
});
