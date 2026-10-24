import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPages, shell } from '../scripts/templates.mjs';

const [profile, projects, technologies] = await Promise.all(['profile', 'projects', 'technologies'].map(async name => JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url)))));
const pages = renderPages({ profile, projects, technologies });
const home = pages.find(page => page.route === '/');

test('Home opens with the complete professional overview and renders each interactive component once', () => {
  const overview = home.content.slice(0, home.content.indexOf('id="projects"'));
  for (const text of [profile.name, profile.role, profile.aboutSummary, profile.goal, profile.intro, profile.workWithMe, 'About Me', 'Craft']) assert.ok(overview.includes(text), text);
  for (const marker of ['data-gallery', 'data-location-map', 'data-background-deck', 'data-moving-strip']) {
    assert.ok(overview.includes(marker), `${marker} belongs in the overview`);
    assert.equal([...home.content.matchAll(new RegExp(`${marker}(?=[\\s>])`, 'g'))].length, 1, `${marker} is not duplicated below the overview`);
  }
  assert.doesNotMatch(home.content, /editorial-hero|hero-project|data-hobby-/);
  const ids = [...home.content.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  const positions = ['top', 'about', 'projects', 'skills', 'ai', 'training', 'education', 'experience', 'github', 'contact'].map(id => ids.indexOf(id));
  assert.ok(positions.every(index => index >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.match(overview, /fetchpriority="high"/);
});

test('Home menu scrolls to existing sections while detailed pages and footer retain their routes', () => {
  for (const page of pages) {
    const html = shell(page, { profile });
    const nav = html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0];
    const hrefs = [...nav.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(hrefs, page.route === '/' ? ['#top', '#about', '#projects', '#skills', '#training', '/resume/', '#contact'] : ['/', '/about/', '/projects/', '/stack/', '/training/', '/resume/', '/contact/']);
    if (page.route === '/') for (const href of hrefs.filter(href => href.startsWith('#'))) assert.ok(home.content.includes(`id="${href.slice(1)}"`));
    const footer = html.match(/<nav class="footer-pages"[\s\S]*?<\/nav>/)[0];
    for (const href of ['/about/', '/projects/', '/stack/', '/training/', '/resume/', '/contact/', '/activity/']) assert.ok(footer.includes(`href="${href}"`));
    assert.equal((nav.match(/aria-current="page"/g) || []).length, ['/404.html', '/activity/'].includes(page.route) ? 0 : 1);
  }
});
