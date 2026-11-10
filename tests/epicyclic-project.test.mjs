import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPages } from '../scripts/templates.mjs';

const [profile, projects, technologies] = await Promise.all(['profile', 'projects', 'technologies'].map(async name => JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url)))));
const pages = renderPages({ profile, projects, technologies });
const page = route => pages.find(p => p.route === route);

test('Epicyclic is fourth in the portfolio order and appears across core routes', () => {
  assert.deepEqual(projects.map(project => project.id), ['sti-vio-log', 'toyota-heritage-ph', 'memochro', 'epicyclic', 'kwiztorya']);
  const epicyclic = projects.find(project => project.id === 'epicyclic');
  assert.equal(epicyclic.category, 'E-Commerce Application');
  assert.equal(epicyclic.year, 2026);
  assert.equal(epicyclic.sourceUrl, 'https://github.com/Eyzen08/Epicyclic');
  assert.equal(epicyclic.liveUrl, 'https://epicyclic-store.vercel.app/');
  for (const route of ['/', '/projects/', '/resume/', '/activity/', '/stack/']) assert.ok(page(route).content.includes(epicyclic.title), route);
  for (const id of ['flutter', 'dart', 'supabase', 'vercel', 'git', 'github']) assert.ok(technologies.find(tech => tech.id === id)?.projects.includes('epicyclic'), id);
});

test('Epicyclic case study covers the shopping flow, architecture, and honest limitations', () => {
  const html = page('/projects/epicyclic/')?.content;
  assert.ok(html, 'Epicyclic case study exists');
  assert.match(html, /payment-method labels only/);
  assert.match(html, /SharedPreferences/);
  assert.match(html, /66 passing automated tests/);
  assert.match(html, /epicyclic-store\.vercel\.app/);
  assert.match(html, /href="https:\/\/github.com\/Eyzen08\/Epicyclic"/);
  const architecture = html.match(/<figure class="architecture">[\s\S]*?<\/figure>/)?.[0];
  assert.ok(architecture);
  assert.match(architecture, /Flutter \+ Dart/);
  assert.match(architecture, /Riverpod/);
  assert.match(architecture, /Supabase/);
  for (const text of ['catalog', 'checkout', 'wishlist', 'demo mode']) assert.ok(html.includes(text), text);
});

test('Epicyclic uses the supplied device mockup PNG and WebP thumbnail', async () => {
  const epicyclic = projects.find(project => project.id === 'epicyclic');
  assert.ok(epicyclic);
  assert.equal(epicyclic.previewScreens.length, 1);
  const screen = epicyclic.previewScreens[0];
  assert.equal(screen.width, 1024);
  assert.equal(screen.height, 682);
  assert.equal(screen.smallWidth, 960);
  assert.equal(screen.src, '/assets/projects/epicyclic-devices-showcase.png');
  const png = await readFile(new URL(`..${screen.src}`, import.meta.url));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1024);
  assert.equal(png.readUInt32BE(20), 682);
  const thumbnail = await readFile(new URL(`..${screen.srcSmall}`, import.meta.url));
  assert.equal(thumbnail.subarray(8, 12).toString(), 'WEBP');
  for (const route of ['/', '/projects/', '/projects/epicyclic/']) assert.ok(page(route).content.includes(`src="${screen.src}"`), route);
});

test('case-study navigation reaches Epicyclic after MemoChro and before Kwiztorya', () => {
  assert.ok(page('/projects/memochro/').content.includes('href="/projects/epicyclic/">Next Case Study'));
  assert.ok(page('/projects/epicyclic/').content.includes('href="/projects/kwiztorya/">Next Case Study'));
});
