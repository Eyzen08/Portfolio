import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPages } from '../scripts/templates.mjs';

const [profile, projects, technologies] = await Promise.all(['profile', 'projects', 'technologies'].map(async name => JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url)))));
const pages = renderPages({profile, projects, technologies});

test('updated résumé facts reach Home, training, résumé and metadata', () => {
  assert.equal(profile.role, 'Aspiring Software Developer');
  assert.equal(profile.positioning, 'Aspiring Software Developer | Full-Stack Web Development | Exploring AI Engineering');
  assert.equal(profile.certifications.length, 7);
  assert.equal(profile.aiTools.length, 5);
  assert.match(profile.summary, /fourth-year BSIT/i);
  for (const route of ['/', '/resume/']) {
    const html = pages.find(page => page.route === route).content;
    assert.match(html, /54-Hour NSTP OJT Trainee/);
    assert.match(html, /Media and Information Technology \(MIT\) Department/);
    assert.doesNotMatch(html, /Admission Office/);
    for (const item of profile.certifications) assert.ok(html.includes(item.title.replaceAll('&', '&amp;')));
  }
  assert.ok(pages.find(page => page.route === '/').title.includes(profile.positioning));
  for (const name of ['TypeScript', 'Tailwind CSS', 'Role-based access control', 'Cookie-based sessions', 'CSRF protection']) assert.ok(technologies.some(tech => tech.name === name), name);
  for (const project of projects) {
    const home = pages.find(page => page.route === '/').content;
    for (const text of [project.category, project.status, project.contribution, String(project.year)]) assert.ok(home.includes(text), text);
  }
});

test('page navigation stays native without the aborted cross-document transition effect', async () => {
  const css = await readFile(new URL('../assets/site.css', import.meta.url), 'utf8');
  assert.doesNotMatch(css, /@view-transition\s*\{\s*navigation:\s*auto/);
});
