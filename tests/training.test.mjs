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
    assert.deepEqual(labels, page.route === '/' ? ['About', 'Tech Stack', 'Projects', 'Experience', 'Contact'] : ['Home', 'About', 'Projects', 'Skills', 'Training', 'Resume', 'Contact']);
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

test('Training shows seven credentials with accessible image previews and separate original links', async () => {
  const training = pages.find(page => page.route === '/training/');
  assert.ok(training, 'Training page must exist');
  assert.equal((training.content.match(/class="certification-card card"/g) || []).length, 7);
  const previews = [...training.content.matchAll(/<a class="certificate-preview"[^>]*>.*?<\/a>/gs)];
  assert.equal(previews.length, 7);
  for (const [index, preview] of previews.entries()) {
    assert.match(preview[0], /target="_blank"/);
    assert.match(preview[0], /rel="noopener noreferrer"/);
    assert.match(preview[0], /<img [^>]*alt="[^"]+"/);
    assert.match(preview[0], /data-certificate-open/);
    assert.equal(preview[0].match(/href="([^"]+)"/)[1],preview[0].match(/src="([^"]+)"/)[1]);
    for (const attribute of ['href', 'src']) {
      const path = preview[0].match(new RegExp(`${attribute}="([^"]+)"`))[1];
      assert.ok(path.startsWith('/assets/certifications/'), `${index}: ${path}`);
      await access(new URL(`..${path}`, import.meta.url));
    }
  }
  for (const item of profile.certifications) assert.ok(training.content.includes(item.title.replaceAll('&', '&amp;')));
  const ai = training.content.match(/<article class="certification-card card">(?:(?!<\/article>).)*Introduction to Modern AI(?:(?!<\/article>).)*<\/article>/s)[0];
  assert.match(ai, /class="certificate-preview"/);
  assert.match(ai, /introduction-to-modern-ai.pdf/);
  assert.doesNotMatch(training.content, /class="certificate-placeholder"/);
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


test('new certificate originals are unchanged and the TESDA issuer is represented accurately',async()=>{
  const originals={"azure-ai-fundamentals": "b2dc0255e8690b4578825a5dc836af54bdae992501d3c5e63206b4f57e8e8f26", "introduction-to-modern-ai": "f110423ed4b52e0efb1d221b443dfde5b787f8a6a3705bd61b6ab2fd5968ffc2", "fundamentals-of-artificial-intelligence": "65c68cdb3ec376d7172508f2430bd4fe810cb91e197e2e3ffdf08cefc2510ea8"};
  for(const [id,hash] of Object.entries(originals)) {
    const bytes=await readFile(new URL(`../assets/certifications/${id}.pdf`,import.meta.url));
    assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
    assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);
    const image=await readFile(new URL(`../assets/certifications/${id}.webp`,import.meta.url));
    assert.equal(image.subarray(8,12).toString(),'WEBP');
  }
  for(const title of ['Microsoft Artificial Intelligence Course: Azure AI Fundamentals','Fundamentals of Artificial Intelligence']) assert.equal(profile.certifications.find(item=>item.title===title).organization,'TESDA Online Program');
});
