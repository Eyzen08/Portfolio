import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {renderPages} from '../scripts/templates.mjs';

const [profile,projects,technologies]=await Promise.all(['profile','projects','technologies'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url)))));
const pages=renderPages({profile,projects,technologies});

test('MemoChro preserves the supplied master and publishes its optimized thumbnail',async()=>{
  const project=projects.find(p=>p.id==='memochro');assert.ok(project);
  const screen=project.previewScreens[0];
  assert.equal(screen.src,'/assets/projects/memochro-featured-v2.png');
  assert.equal(screen.srcSmall,'/assets/projects/memochro-featured-v2-small.webp');
  const png=await readFile(new URL(`..${screen.src}`,import.meta.url));
  const original=await readFile(new URL('../assets/projects/memochro-featured.png',import.meta.url));
  assert.equal(createHash('sha256').update(original).digest('hex'),'2f013ef3d2e156fa9496049aee79e512bda3cc5b99cea6003c8d90aefdc2dc1d');
  assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20)],[2400,1350]);
  assert.equal(screen.smallWidth,960);
  const small=await readFile(new URL(`..${screen.srcSmall}`,import.meta.url));
  assert.equal(small.subarray(8,12).toString(),'WEBP');
  assert.ok(small.length<png.length);
});

test('MemoChro is a personal project after Toyota, with separate case study and preview actions',()=>{
  assert.deepEqual(projects.map(p=>p.id),['sti-vio-log','toyota-heritage-ph','memochro','kwiztorya']);
  const project=projects.find(p=>p.id==='memochro');
  assert.equal(project.context,'Personal project');
  assert.equal(project.status,'Personal project');
  assert.equal(project.role,'Web Designer & Developer');
  assert.equal(project.year,2026);
  assert.deepEqual(project.cardTechnologies,['nextjs','react','typescript','supabase','vercel']);
  for(const route of ['/','/projects/']){
    const html=pages.find(p=>p.route===route).content;
    const card=[...html.matchAll(/<article class="(?:project-feature|project-card)[\s\S]*?<\/article>/g)].map(m=>m[0]).find(row=>row.includes('MemoChro'));
    assert.match(card,/href="\/projects\/memochro\/" >View Project/);
    assert.match(card,/Contributions &amp; features/);
    assert.match(card,/href="https:\/\/github.com\/Eyzen08\/MemoChro"/);
    assert.match(card,/href="https:\/\/memochro.vercel.app\/"/);
    assert.ok(card.includes(`href="${project.previewScreens[0].src}"`));
    assert.doesNotMatch(card,/featured-badge|Client [Pp]roject/);
  }
});

test('MemoChro case study contains seven evidence-based sections, media, demo link and correct architecture',async()=>{
  const project=projects.find(p=>p.id==='memochro');assert.ok(project);
  assert.equal(project.sections.length,7);
  const html=pages.find(p=>p.route==='/projects/memochro/')?.content;assert.ok(html);
  assert.ok(html.includes('memochro-featured-v2.png'));
  assert.ok(html.indexOf('memochro-featured-v2.png')<html.indexOf('class="project-summary"'));
  for(const section of project.sections)assert.ok(html.includes(`id="${section.id}"`));
  assert.match(html,/href="https:\/\/memochro.vercel.app\/demo"/);
  assert.match(html,/documented|recorded/i);assert.match(html,/email/i);assert.match(html,/Personal project/);
  const architecture=html.match(/<figure class="architecture">[\s\S]*?<\/figure>/)?.[0];
  assert.ok(architecture);assert.match(architecture,/Next.js/);assert.match(architecture,/Supabase/);assert.match(architecture,/Vercel/);
  assert.doesNotMatch(architecture,/Android|Firebase|Express/);
  const images=project.sections.flatMap(s=>s.images||[]);assert.equal(images.length,3);
  for(const image of images){
    assert.ok(image.alt&&image.caption&&image.width>0&&image.height>0);
    assert.ok(html.includes(`src="${image.src}"`));
    await readFile(new URL(`..${image.src}`,import.meta.url));
  }
  for(const id of project.technologies)assert.ok(technologies.find(t=>t.id===id)?.projects.includes('memochro'),id);
});
