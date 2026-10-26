import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPages, shell } from '../scripts/templates.mjs';
const [profile, projects, technologies] = await Promise.all(['profile','projects','technologies'].map(async name => JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url)))));
const pages = renderPages({profile,projects,technologies});
const home = pages.find(page=>page.route==='/').content;

test('summary Home puts the professional overview before project evidence',()=>{
  const ids=['top','about','education','skills','projects','experience','training','ai','github','contact'];
  const positions=ids.map(id=>home.indexOf(`id="${id}"`));
  assert.ok(positions.every(index=>index>=0));
  assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));
  assert.ok(home.includes(profile.aboutSummary));
  assert.match(home,/href="#projects"/);assert.match(home,/href="\/resume\/"[^>]*>View Résumé/);
  assert.doesNotMatch(home,/class="bento-grid"|data-project-rail/);
  const features=[...home.matchAll(/<article class="project-feature[\s\S]*?<\/article>/g)].map(match=>match[0]);
  assert.equal(features.length,2);
  projects.forEach((project,i)=>{
    assert.ok(features[i].includes(project.title));assert.ok(features[i].includes(project.role));
    assert.ok(features[i].includes(`href="/projects/${project.id}/"`));
    assert.ok(features[i].includes(`href="${project.sourceUrl}"`));
    assert.match(features[i],/class="tags"/);
    if(project.liveUrl)assert.ok(features[i].includes(`href="${project.liveUrl}"`));
    else assert.doesNotMatch(features[i],/Open Live Platform/);
  });
  assert.match(features[1],/Owner-Supplied Mockup/);
  assert.match(home,/I review and test AI-generated suggestions/);
});

test('navigation retains seven destinations and a separate activity footer link',()=>{
  for(const page of pages){
    const html=shell(page,{profile});
    const nav=html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0];
    const hrefs=[...nav.matchAll(/href="([^"]+)"/g)].map(match=>match[1]);
    assert.deepEqual(hrefs,page.route === '/' ? ['#about','#skills','#projects','#experience','#training','#contact'] : ['/','/about/','/projects/','/stack/','/training/','/resume/','/contact/']);
    assert.doesNotMatch(html,/>Contacts</);
    assert.match(html,/href="\/activity\/"/);
    if(page.route==='/stack/')assert.match(nav,/href="\/stack\/" aria-current="page"/);
  }
});
