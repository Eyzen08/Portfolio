import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPages } from '../scripts/templates.mjs';

const [profile, projects, technologies] = await Promise.all(['profile', 'projects', 'technologies'].map(async name => JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url)))));
const pages = renderPages({ profile, projects, technologies });
const home = pages.find(page => page.route === '/').content;
const escaped = text => text.replaceAll('&', '&amp;').replaceAll("'", '&#39;');

test('each complete Home project card contains its information, screenshots and valid screen controls', () => {
  const cards = [...home.matchAll(/<article class="project-feature card[\s\S]*?<\/article>/g)].map(match => match[0]);
  assert.equal(cards.length, projects.length);
  projects.forEach((project, index) => {
    const card = cards[index];
    for (const text of [project.title, project.role, project.summary]) assert.ok(card.includes(escaped(text)), text);
    for (const href of [`/projects/${project.id}/`, project.sourceUrl, project.liveUrl].filter(Boolean)) assert.ok(card.includes(`href="${href}"`));
    assert.match(card, /data-deck-prev/); assert.match(card, /data-deck-next/);
    assert.equal((card.match(/data-deck-select\b/g) || []).length, project.previewScreens.length);
    for (const screen of project.previewScreens) {
      assert.ok(card.includes(`aria-controls="picture-${project.id}-${screen.id}"`));
      assert.ok(card.includes(`id="picture-${project.id}-${screen.id}"`));
      assert.ok(card.includes(`href="${screen.src}"`));
      if (screen.originalSrc) assert.ok(card.includes(`href="${screen.originalSrc}"`));
      if (screen.presentationLabel) assert.ok(card.includes(screen.presentationLabel));
    }
  });
});

test('Home displays three certificate previews and keeps the other two training records', () => {
  const training = home.slice(home.indexOf('id="training"'), home.indexOf('id="education"'));
  const featured = [...training.matchAll(/<article class="home-certificate card"[\s\S]*?<\/article>/g)].map(match => match[0]);
  assert.equal(featured.length, 3);
  const expected = profile.certifications.filter(item => item.preview).slice(0, 3);
  expected.forEach((item, index) => {
    for (const text of [escaped(item.title), item.organization, item.period, item.preview.src, item.documentUrl]) assert.ok(featured[index].includes(text), text);
  });
  const remaining = training.slice(training.indexOf('class="training-summary"'));
  assert.match(remaining, /Introduction to Modern AI/); assert.match(remaining, /LEGO Educational Robotics/);
  assert.equal((remaining.match(/<li>/g) || []).length, 2);
  const dedicated = pages.find(page => page.route === '/training/').content;
  assert.equal((dedicated.match(/class="certificate-preview"/g) || []).length, 4);
});

test('matching Education and Experience panels retain every record and bullet', () => {
  const foundation = home.slice(home.indexOf('id="education"'), home.indexOf('id="github"'));
  assert.equal((foundation.match(/class="foundation-panel card"/g) || []).length, 2);
  assert.match(foundation, /<h3[^>]*>Education<\/h3>/);
  assert.match(foundation, /<h3[^>]*>Experience &amp; Immersion<\/h3>/);
  for (const item of [...profile.education, ...profile.experience]) {
    for (const text of [item.title, item.organization, item.period, item.location, ...(item.bullets || [])].filter(Boolean)) assert.ok(foundation.includes(escaped(text)), text);
  }
});
