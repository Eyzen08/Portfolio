import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderPages} from '../scripts/templates.mjs';

const [profile,projects,technologies]=await Promise.all(['profile','projects','technologies'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url)))));
const pages=renderPages({profile,projects,technologies});
const page=route=>pages.find(page=>page.route===route);

test('Toyota is the second client project and appears throughout the portfolio',()=>{
  assert.deepEqual(projects.map(project=>project.id),['sti-vio-log','toyota-heritage-ph','kwiztorya']);
  const toyota=projects.find(project=>project.id==='toyota-heritage-ph');
  assert.equal(toyota.role,'Web Designer & Developer');
  assert.equal(toyota.context,'Client Project');
  assert.equal(toyota.year,2026);
  assert.equal(toyota.sourceUrl,'https://github.com/Eyzen08/toyota-heritage-ph');
  assert.equal(toyota.liveUrl,'https://toyota-heritage-ph.vercel.app/');
  for(const route of ['/','/projects/','/resume/','/activity/','/stack/'])assert.ok(page(route).content.includes(toyota.title),route);
  assert.match(page('/').content,/Selected <sup>03<\/sup>/);
  assert.match(page('/').content,/Selected academic and client work/);
  assert.ok(page('/projects/').description.includes(toyota.title));
  for(const id of ['html5','css3','javascript','git','github','vercel'])assert.ok(technologies.find(tech=>tech.id===id).projects.includes(toyota.id),id);
});

test('Toyota case study explains the static architecture, client credits and licensing',()=>{
  const html=page('/projects/toyota-heritage-ph/')?.content;
  assert.ok(html,'Toyota case study exists');
  assert.match(html,/Designed &amp; Developed by EJ Christian Medilo\./);
  assert.match(html,/Katrina Guillermo and Trish Stephanie Cahanding/);
  assert.match(html,/two client profiles credited on the project/);
  assert.match(html,/Wikimedia Commons/);assert.match(html,/Creative Commons/);
  assert.match(html,/not affiliated with, endorsed by, or sponsored by Toyota/);
  assert.match(html,/href="https:\/\/github.com\/Eyzen08\/toyota-heritage-ph\/blob\/main\/README.md"/);
  const architecture=html.match(/<figure class="architecture">[\s\S]*?<\/figure>/)?.[0];
  assert.ok(architecture);assert.match(architecture,/HTML5 \+ CSS3/);assert.match(architecture,/JavaScript/);assert.match(architecture,/Vercel/);
  assert.doesNotMatch(architecture,/Android|Firebase|PostgreSQL|Express/);
  for(const text of ['22-model','three vehicles','heritage timeline','gallery','theme'])assert.ok(html.includes(text),text);
});

test('Toyota uses the unchanged supplied PNG and a correctly sized thumbnail',async()=>{
  const toyota=projects.find(project=>project.id==='toyota-heritage-ph');
  assert.ok(toyota);assert.equal(toyota.previewScreens.length,1);
  const screen=toyota.previewScreens[0];
  assert.equal(screen.width,1600);assert.equal(screen.height,900);assert.equal(screen.smallWidth,960);
  const png=await readFile(new URL(`..${screen.src}`,import.meta.url));
  assert.equal(png.readUInt32BE(16),1600);assert.equal(png.readUInt32BE(20),900);
  const thumbnail=await readFile(new URL(`..${screen.srcSmall}`,import.meta.url));
  assert.equal(thumbnail.subarray(8,12).toString(),'WEBP');
  for(const route of ['/','/projects/','/projects/toyota-heritage-ph/'])assert.ok(page(route).content.includes(`src="${screen.src}"`),route);
});

test('case-study navigation cycles through the displayed project order',()=>{
  projects.forEach((project,index)=>{
    const next=projects[(index+1)%projects.length];
    assert.ok(page(`/projects/${project.id}/`).content.includes(`href="/projects/${next.id}/">Next Case Study`));
  });
});

test('all project artwork uses matching filled 16:9 frames',async()=>{
  for(const route of ['/','/projects/']){
    const covers=[...page(route).content.matchAll(/<span class="showcase-cover([^\"]*)">/g)].map(match=>match[1]);
    assert.deepEqual(covers,['','','']);
  }
  const css=await readFile(new URL('../assets/redesign.css',import.meta.url),'utf8');
  assert.match(css,/\.showcase-cover\{[^}]*aspect-ratio:16\/9/);
  assert.match(css,/\.showcase-cover>img\{[^}]*object-fit:cover/);
  assert.match(css,/\.project-details-main \.preview-image\{[^}]*aspect-ratio:16\/9;object-fit:cover/);
  assert.match(css,/\.more-project>img\{[^}]*height:auto;aspect-ratio:16\/9;object-fit:cover/);
  assert.match(css,/\.picture-media>img\{[^}]*aspect-ratio:16\/9;object-fit:cover/);
});
