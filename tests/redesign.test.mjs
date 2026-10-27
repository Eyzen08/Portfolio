import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../scripts/build.mjs';
import { renderPages, shell } from '../scripts/templates.mjs';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';

const profile = JSON.parse(await readFile(new URL('../data/profile.json', import.meta.url)));
const projects = JSON.parse(await readFile(new URL('../data/projects.json', import.meta.url)));
const technologies = JSON.parse(await readFile(new URL('../data/technologies.json', import.meta.url)));
const pages = renderPages({ profile, projects, technologies });
const page = route => pages.find(item => item.route === route).content;

test('Home and About keep the portrait and photo branding without the old workflow', async () => {
  const home = page('/');
  assert.match(home, /class="summary-grid"/);
  assert.match(home, /class="hero-portrait bento-photo card card--media"/);
  assert.match(home, /src="\/assets\/personal\/ej-formal-cutout.png"/);
  assert.match(home, /class="hero-formal-portrait"/);
  assert.match(home, /width="1024" height="1536"/);
  assert.doesNotMatch(home, /STI Vio-Log workflow|workflow-violation|hero-studio|EJ’s initials/);
  assert.match(page('/about/'), /ej-portrait.webp/);
  assert.match(page('/projects/sti-vio-log/'), /<ol class="process-list">[\s\S]*Record[\s\S]*Clearance/);
  for (const item of pages) {
    const html = shell(item, { profile });
    assert.equal((html.match(/class="logo-avatar"/g) || []).length, 2, 'Header and footer use the photo logo');
    assert.match(html, /rel="icon" href="\/assets\/brand\/favicon-32.png"/);
    assert.doesNotMatch(html, /\/assets\/brand\/ej.svg/);
  }
  for (const name of ['ej-portrait.webp', 'ej-portrait-400.webp', 'ej-avatar.webp']) {
    const bytes = await readFile(new URL(`../assets/personal/${name}`, import.meta.url));
    assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
  }
});

test('summary overview retains factual background, professional summary and reading order', () => {
  const home = page('/');
  assert.doesNotMatch(home, /class="bento-grid"/);
  for(const text of ['About Me','Education','Project Leadership','Training','Taguig City, Philippines','Philippine Standard Time','UTC+8','STI College Global City','7 training and certification entries']) assert.ok(home.includes(text),text);
  const ids = [...home.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(ids.length,new Set(ids).size);
  for(const match of home.matchAll(/aria-controls="([^"]+)"/g)) assert.ok(ids.includes(match[1]));
  for(const anchor of ['top','about','skills','projects','experience','education','contact']) assert.ok(ids.includes(anchor));
  const order=['summary-grid','sphere-section','featured-section','home-background','home-training','home-ai','home-contact'].map(name=>home.indexOf(name));
  assert.deepEqual(order,[...order].sort((a,b)=>a-b));
});

test('Home and About share professional AI content without hobbies', () => {
  const about = page('/about/');
  assert.match(about, /<h1>About Me<\/h1>/);
  assert.match(about, /How I Use AI/);
  assert.match(about, /Learning AI Engineering/);
  for (const html of [page('/'), about]) {
    for (const field of ['aboutSummary', 'aiApproach', 'aiLearning']) {
      assert.equal(typeof profile[field], 'string', field);
      assert.ok(html.includes(profile[field]), `${field} is rendered`);
    }
    assert.doesNotMatch(html, /data-hobby-|\/assets\/hobbies\/|Beyond the Code|Artwork Credits/);
  }
  assert.match(page('/'), /href="\/about\/">More About Me/);
  assert.ok(page('/resume/').includes(profile.summary), 'Résumé summary remains intact');
});

test('résumé offers the supplied PDF, responsibilities, and a readable skills section', async () => {
  const html = page('/resume/');
  assert.match(html, /href="\/assets\/resume\/ej-christian-medilo-resume.pdf"[^>]*download/);
  assert.match(html, /54-Hour NSTP OJT Trainee — Media and Information Technology \(MIT\) Department/);
  assert.match(html, /54-Hour NSTP/);
  assert.match(html, /80-Hour Work Immersion/);
  assert.match(html, /Bachelor of Science in Information Technology \(BSIT\)/);
  assert.match(html, /Information and Communications Technology \(ICT\) Strand, Senior High School/);
  assert.equal(profile.certifications.length, 7);
  assert.doesNotMatch(html, /IT Support Volunteer|MySQL/);
  assert.match(html, /id="skills"/);
  assert.match(html, /Introduction to Modern AI/);
  for (const item of pages) assert.doesNotMatch(item.content, /internship|aspiring developer|awaiting approval/i);
  const directory = await mkdtemp(join(tmpdir(), 'ej-redesign-'));
  try {
    await buildSite({ outDir: directory });
    const pdf = await readFile(join(directory, 'assets/resume/ej-christian-medilo-resume.pdf'));
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
    assert.equal(createHash('sha256').update(pdf).digest('hex'), '789013513f4916e26205c61831ee166379b0d714c8a807b96a5683f3e713e641', 'The latest supplied PDF must remain unmodified');
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('initial visual theme updates browser chrome with saved, system, and unavailable storage preferences', async () => {
  const source = await readFile(new URL('../assets/theme-init.js', import.meta.url), 'utf8');
  for (const [saved, prefersDark, fails, expected] of [['light', true, false, 'light'], ['dark', false, false, 'dark'], [null, true, false, 'dark'], ['invalid', false, false, 'light'], [null, true, true, 'dark']]) {
    const root = { dataset: {} };
    const meta = { setAttribute(name, value) { this[name] = value; } };
    runInNewContext(source, { document: { documentElement: root, querySelector: () => meta }, localStorage: { getItem() { if (fails) throw new Error('Unavailable'); return saved; } }, matchMedia: () => ({ matches: prefersDark }) });
    assert.equal(root.dataset.theme, expected);
    assert.equal(meta.content, expected === 'dark' ? '#0f0f0f' : '#fdfdfc');
  }
});

test('project cards retain searchable evidence and genuine case-study destinations', () => {
  for (const route of ['/projects/']) {
    const html = page(route);
    const cards = [...html.matchAll(/<article class="project-card[\s\S]*?<\/article>/g)].map(match => match[0]);
    assert.equal(cards.length, 2);
    assert.match(cards[0], /PostgreSQL/);
    assert.match(cards[0], /Full-Stack Developer/);
    assert.match(cards[0], /class="project-status"/);
    assert.match(page('/projects/sti-vio-log/'), /PostgreSQL/);
    assert.match(cards[1], /kwiztorya-history-showcase.png/);
    assert.match(cards[1], /href="\/projects\/kwiztorya\/"/);
    assert.doesNotMatch(cards[1], /welcome-art/);
  }
});

test('Kwiztorya preview has one static image before JavaScript and valid unique IDs', async () => {
  const html = page('/projects/kwiztorya/');
  assert.match(html, /aria-label="Kwiztorya Project Image"/);
  assert.equal((html.match(/data-deck-card/g) || []).length, 1);
  assert.doesNotMatch(html, /data-picture-deck|data-deck-controls/);
  assert.doesNotMatch(html, /data-deck-card hidden/);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const match of html.matchAll(/aria-controls="([^"]+)"/g)) assert.ok(ids.includes(match[1]));
  const kwiz = projects.find(item => item.id === 'kwiztorya');
  assert.equal(kwiz.previewScreens.length, 1);
  for (const screen of kwiz.previewScreens) {
    assert.ok(screen.width > 0 && screen.height < screen.width);
    assert.ok(screen.alt && screen.caption && screen.explanation);
    const bytes = await readFile(new URL(`..${screen.src}`, import.meta.url));
    assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
  }
});

test('résumé-only skills link to résumé evidence rather than portfolio source', () => {
  const html = page('/stack/');
  const python = html.match(/<article[^>]*data-search="Python[\s\S]*?<\/article>/)?.[0];
  assert.ok(python, 'Additional résumé languages should be represented');
  assert.match(python, /Additional Familiarity/);
  assert.match(python, /href="\/resume\/#skills"/);
  assert.doesNotMatch(python, /Portfolio source|Used in this portfolio/);
});
