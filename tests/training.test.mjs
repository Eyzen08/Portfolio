import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { renderPages, shell } from '../scripts/templates.mjs';

const profile = JSON.parse(await readFile(new URL('../data/profile.json', import.meta.url)));
const projects = JSON.parse(await readFile(new URL('../data/projects.json', import.meta.url)));
const technologies = JSON.parse(await readFile(new URL('../data/technologies.json', import.meta.url)));
const pages = renderPages({ profile, projects, technologies });

test('compact Home navigation preserves direct training, résumé and contact routes', () => {
  for (const page of pages) {
    const html = shell(page, { profile });
    const header = html.match(/<nav class="main-nav"[^>]*>(.*?)<\/nav>/s)[1];
    const labels = [...header.matchAll(/<a\b[^>]*>([^<]+)<\/a>/g)].map(match => match[1]);
    assert.deepEqual(labels, page.route === '/' ? ['About', 'Tech Stack', 'Projects', 'Experience', 'Certificates', 'Contact'] : ['Home', 'About', 'Projects', 'Skills', 'Certificates', 'Resume', 'Contact']);
    const footer = html.match(/<nav class="footer-pages"[^>]*>(.*?)<\/nav>/s)[1];
    for (const route of ['/training/', '/resume/', '/contact/']) assert.ok(footer.includes(`href="${route}"`));
    assert.match(html, /class="button header-contact" href="\/contact\/"/);
    if (page.route === '/') {
      for (const anchor of ['about','skills','projects','experience','contact']) assert.ok(header.includes(`href="#${anchor}"`));
      assert.match(page.content, /href="\/resume\/"/);
      assert.match(page.content, /href="\/training\/"/);
    }
  }
});

test('Training shows seven credentials with accessible static previews', async () => {
  const training = pages.find(page => page.route === '/training/');
  assert.ok(training, 'Training page must exist');
  assert.equal((training.content.match(/class="certification-card card"/g) || []).length, 7);
  const previews = [...training.content.matchAll(/<figure class="certificate-preview"[^>]*>.*?<\/figure>/gs)];
  assert.equal(previews.length, 7);
  for (const [index, preview] of previews.entries()) {
    assert.doesNotMatch(preview[0], /href=|data-certificate-open/);
    assert.match(preview[0], /<img [^>]*alt="[^"]+"/);
    for (const attribute of ['src']) {
      const path = preview[0].match(new RegExp(`${attribute}="([^"]+)"`))[1];
      assert.ok(path.startsWith('/assets/certifications/'), `${index}: ${path}`);
      await access(new URL(`..${path}`, import.meta.url));
    }
  }
  for (const item of profile.certifications) assert.ok(training.content.includes(item.title.replaceAll('&', '&amp;')));
  const ai = training.content.match(/<article class="certification-card card">(?:(?!<\/article>).)*Introduction to Modern AI(?:(?!<\/article>).)*<\/article>/s)[0];
  assert.match(ai, /class="certificate-preview"/);
  assert.match(ai, /introduction-to-modern-ai.webp/);
  assert.doesNotMatch(training.content, /class="certificate-placeholder"/);
  const resume = pages.find(page => page.route === '/resume/');
  assert.ok(!resume.content.includes('certificate-preview'), 'Résumé must stay compact');
  const home = pages.find(page => page.route === '/').content;
  assert.ok(!home.includes('/resume/#certifications'));
  assert.match(home,/href="\/training\/"/);
});

test('Education retains its preview and the hero location retains a map fallback',()=>{
  const home=pages.find(page=>page.route==='/').content;
  assert.match(home,/\/assets\/education\/sti-global-city.jpg/);
  assert.match(home,/data-location-map/);
  assert.match(home,/data-map-status/);
  assert.match(home,/OpenStreetMap/);
  assert.match(home,/data-github-retry/);
});


test('unsigned certificate previews remain unchanged and TESDA issuer remains accurate',async()=>{
  const hashes={
    'azure-ai-fundamentals':'11718f495bd9a10273db6a6652b50c8c4d26ed53983f323ca82cdc8cd67b8ff3',
    'introduction-to-modern-ai':'b419df9d5e515b8827b287bf90c7340828cff760007d45bfb2b1d5ad8797ad18',
    'fundamentals-of-artificial-intelligence':'8b814896a19ce40888a26a034eca7ddddf76e1067b6548ab07ee61374ba8cf4e'
  };
  for(const [id,hash] of Object.entries(hashes)){
    const image=await readFile(new URL(`../assets/certifications/${id}.webp`,import.meta.url));
    assert.equal(createHash('sha256').update(image).digest('hex'),hash);
  }
  for(const title of ['Microsoft Artificial Intelligence Course: Azure AI Fundamentals','Fundamentals of Artificial Intelligence']) assert.equal(profile.certifications.find(item=>item.title===title).organization,'TESDA Online Program');
});
