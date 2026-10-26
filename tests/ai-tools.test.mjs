import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { renderPages, shell } from '../scripts/templates.mjs';

const [profile, projects, technologies] = await Promise.all(['profile', 'projects', 'technologies'].map(async name => JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url)))));
const pages = renderPages({ profile, projects, technologies });
const page = route => pages.find(page => page.route === route).content;

test('AI tools render once after the technical stack with complete static content and local logos', async () => {
  const home = page('/');
  assert.equal((home.match(/id="ai"/g) || []).length, 1);
  assert.ok(home.indexOf('id="skills"') < home.indexOf('id="ai"'));
  assert.ok(home.indexOf('id="about"') < home.indexOf('id="skills"'));
  assert.ok(home.indexOf('id="training"') < home.indexOf('id="ai"'));
  const section = home.match(/<section[^>]*id="ai"[\s\S]*?<\/section>/)[0];
  assert.match(section, /<h3[^>]*>AI Tools I Use<\/h3>/);
  assert.match(section, /I review and test AI-generated suggestions/);
  assert.deepEqual(profile.aiTools.map(tool => tool.name), ['Google Gemini', 'ChatGPT', 'OpenAI Codex', 'Claude', 'GitHub Copilot']);
  const tools = [...section.matchAll(/<li><img[^>]*>[\s\S]*?<\/li>/g)].map(match => match[0]);
  assert.equal(tools.length, 5);
  for (const [index, tool] of profile.aiTools.entries()) {
    assert.ok(tools[index].includes(tool.name));
    assert.ok(tools[index].includes(`src="${tool.logo}"`));
    assert.match(tools[index], /alt=""/);
    await access(new URL(`..${tool.logo}`, import.meta.url));
  }
  for (const text of [profile.aiApproach, profile.aiLearning, 'I review and test AI-generated suggestions']) assert.ok(section.includes(text));
  assert.doesNotMatch(page('/stack/'), /AI Tools I Use|Google Gemini|OpenAI Codex/);
  assert.ok(profile.aiTools.every(tool => !technologies.some(tech => tech.name === tool.name)));
});

test('UI headings and actions use Title Case while prose, official names, and destinations survive', () => {
  for (const text of ['About', 'Tech Stack', 'Projects', 'Experience', 'Certificates', 'Workflow', 'Activity', 'Let’s Build Together', 'Open Full Map', 'Preview Certificate']) assert.ok(page('/').includes(text), text);
  for (const project of projects) assert.ok(page('/projects/').includes(`${project.title} Screenshots`));
  assert.match(page('/projects/'), /Expand Preview/);
  assert.match(page('/projects/sti-vio-log/'), /Tools around the Core Workflow/);
  assert.match(page('/projects/kwiztorya/'), /History through a Playable Sequence/);
  assert.match(page('/projects/kwiztorya/'), /State across Screens/);
  assert.ok(page('/').includes(profile.aboutSummary));
  for (const credential of profile.certifications) assert.ok(page('/training/').includes(credential.title.replaceAll('&', '&amp;')));
  for (const name of ['JavaScript', 'Node.js', 'PostgreSQL', 'GitHub', 'SharedPreferences', 'Socket.IO']) assert.ok(page('/stack/').includes(name));
  for (const item of pages) {
    const html = shell(item, { profile });
    assert.match(html, />Skip to Content<\/a>/);
    assert.match(html, /href="\/stack\/"/);
    assert.doesNotMatch(html, /text-transform\s*:/);
  }
});
