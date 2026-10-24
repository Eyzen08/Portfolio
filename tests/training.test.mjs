import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { renderPages, shell } from '../scripts/templates.mjs';

const profile = JSON.parse(await readFile(new URL('../data/profile.json', import.meta.url)));
const projects = JSON.parse(await readFile(new URL('../data/projects.json', import.meta.url)));
const technologies = JSON.parse(await readFile(new URL('../data/technologies.json', import.meta.url)));
const pages = renderPages({ profile, projects, technologies });

test('visitors can reach Training, Resume and Contact directly from every desktop header', () => {
  for (const page of pages) {
    const html = shell(page, { profile });
    const header = html.match(/<nav class="main-nav"[^>]*>(.*?)<\/nav>/s)[1];
    assert.deepEqual([...header.matchAll(/<a\b[^>]*>([^<]+)<\/a>/g)].map(match => match[1]), ['Home', 'About', 'Projects', 'Skills', 'Training', 'Resume', 'Contact']);
    for (const [route, label] of [['/training/', 'Training'], ['/resume/', 'Resume'], ['/contact/', 'Contact']]) {
      const href = page.route === '/' && route !== '/resume/' ? `#${label.toLowerCase()}` : route;
      assert.ok(header.includes(`href="${href}"`), label);
      const link = [...header.matchAll(/<a\b[^>]*>[^<]+<\/a>/g)].find(match => match[0].includes(`href="${href}"`))[0];
      assert.equal(link.includes('aria-current="page"'), page.route === route);
      assert.ok(!link.includes('data-section-link'), 'Page links must keep their own active state');
    }
    assert.ok(!html.includes('class="header-contact'));
    for (const name of ['main-nav', 'footer-pages']) {
      const navigation = html.match(new RegExp(`<nav class="${name}"[^>]*>(.*?)</nav>`, 's'))[1];
      assert.ok(navigation.includes(`href="${page.route === '/' && name === 'main-nav' ? '#training' : '/training/'}"`));
    }
  }
});

test('Training shows five credentials with four accessible previews opening their supplied documents', async () => {
  const training = pages.find(page => page.route === '/training/');
  assert.ok(training, 'Training page must exist');
  assert.equal((training.content.match(/class="certification-card card"/g) || []).length, 5);
  const previews = [...training.content.matchAll(/<a class="certificate-preview"[^>]*>.*?<\/a>/gs)];
  assert.equal(previews.length, 4);
  for (const [index, preview] of previews.entries()) {
    assert.match(preview[0], /target="_blank"/);
    assert.match(preview[0], /rel="noopener noreferrer"/);
    assert.match(preview[0], /<img [^>]*alt="[^"]+"/);
    for (const attribute of ['href', 'src']) {
      const path = preview[0].match(new RegExp(`${attribute}="([^"]+)"`))[1];
      assert.ok(path.startsWith('/assets/certifications/'), `${index}: ${path}`);
      await access(new URL(`..${path}`, import.meta.url));
    }
  }
  for (const item of profile.certifications) assert.ok(training.content.includes(item.title.replaceAll('&', '&amp;')));
  const ai = training.content.match(/<article class="certification-card card">(?:(?!<\/article>).)*Introduction to Modern AI(?:(?!<\/article>).)*<\/article>/s)[0];
  assert.ok(!ai.includes('<img') && !ai.includes('certificate-preview'));
  assert.match(ai,/class="certificate-placeholder"/);
  assert.match(ai,/Certificate preview unavailable/);
  const resume = pages.find(page => page.route === '/resume/');
  assert.ok(!resume.content.includes('certificate-preview'), 'Résumé must stay compact');
  const home = pages.find(page => page.route === '/').content;
  assert.ok(!home.includes('/resume/#certifications'));
  assert.ok((home.match(/href="\/training\/"/g) || []).length >= 2);
});

test('Background highlights include relevant previews and the location retains a map fallback',()=>{
  const home=pages.find(page=>page.route==='/').content;
  for(const id of ['education','leadership','training']){
    const card=home.match(new RegExp(`<article class="background-card" id="background-${id}"[\\s\\S]*?<\\/article>`))[0];
    assert.match(card,/<img /);
    assert.match(card,/Read More/);
  }
  assert.match(home,/\/assets\/education\/sti-global-city.jpg/);
  assert.match(home,/data-location-map/);
  assert.match(home,/data-map-status/);
  assert.match(home,/OpenStreetMap/);
  assert.match(home,/data-github-retry/);
});
