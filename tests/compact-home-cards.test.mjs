import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPages } from '../scripts/templates.mjs';

const [profile, projects, technologies] = await Promise.all(['profile', 'projects', 'technologies'].map(async name => JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url)))));
const pages = renderPages({ profile, projects, technologies });
const home = pages.find(page => page.route === '/').content;
const escaped = text => text.replaceAll('&', '&amp;').replaceAll("'", '&#39;');

test('each complete Home project card contains its information and one image without slideshow controls', () => {
  const cards = [...home.matchAll(/<article class="project-feature card[\s\S]*?<\/article>/g)].map(match => match[0]);
  assert.equal(cards.length, projects.length);
  projects.forEach((project, index) => {
    const card = cards[index];
    for (const text of [project.title, project.role, project.summary]) assert.ok(card.includes(escaped(text)), text);
    for (const href of [`/projects/${project.id}/`, project.sourceUrl, project.liveUrl].filter(Boolean)) assert.ok(card.includes(`href="${href}"`));
    const gallery=home.match(new RegExp(`<section data-project-panel="${project.id}"[\\s\\S]*?</section>`))[0];
    assert.doesNotMatch(gallery, /data-preview-prev|data-preview-next|data-preview-select|data-preview-count/);
    for (const screen of project.previewScreens) {
      assert.ok(gallery.includes(`id="preview-${project.id}-${screen.id}"`));
      assert.ok(gallery.includes(`src="${screen.src}"`));
      if (screen.originalSrc) assert.ok(gallery.includes(`href="${screen.originalSrc}"`));
      if (screen.presentationLabel) assert.ok(gallery.includes(screen.presentationLabel));
    }
  });
});

test('Home retains all seven credentials and all seven supplied document previews', () => {
  const training = home.slice(home.indexOf('id="training"'), home.indexOf('id="ai"'));
  const cards = [...training.matchAll(/<article class="home-certificate card"[\s\S]*?<\/article>/g)].map(match => match[0]);
  assert.equal(cards.length, 7);
  for (const item of profile.certifications) {
    const card = cards.find(card => card.includes(escaped(item.title)));
    assert.ok(card, item.title);
    for (const text of [item.organization, item.period].filter(Boolean)) assert.ok(card.includes(escaped(text)));
    if (item.preview) { assert.ok(card.includes(item.preview.src)); assert.doesNotMatch(card,/data-certificate-open|data-certificate-original/); }
    else { assert.match(card, /Certificate preview unavailable/); assert.doesNotMatch(card, /class="certificate-preview"/); }
  }
  assert.equal((training.match(/class="certificate-preview"/g) || []).length, 7);
  assert.match(training, /tabindex="0" role="region"/);
  assert.match(training, /Earlier training/);
});

test('matching Education and Experience panels retain every record and bullet', () => {
  const foundation = home.slice(home.indexOf('id="education"'), home.indexOf('id="training"'));
  assert.equal((foundation.match(/name="experience-rows"/g) || []).length, profile.experience.length);
  assert.match(foundation, /— Education/);
  assert.match(foundation, /Student training &amp; work immersion/);
  for (const item of [...profile.education, ...profile.experience]) {
    for (const text of [item.title, item.organization, item.period, item.location, ...(item.bullets || [])].filter(Boolean)) assert.ok(foundation.includes(escaped(text)), text);
  }
});
