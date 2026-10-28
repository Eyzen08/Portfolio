import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPages, shell } from '../scripts/templates.mjs';
const profile = JSON.parse(await readFile(new URL('../data/profile.json', import.meta.url)));
const projects = JSON.parse(await readFile(new URL('../data/projects.json', import.meta.url)));
const technologies = JSON.parse(await readFile(new URL('../data/technologies.json', import.meta.url)));
const pages = renderPages({profile,projects,technologies});
const home = pages.find(p => p.route === '/');
test('Home retains projects, resources and complete no-JS evidence', () => {
  for (const marker of ['data-home', 'data-gallery', 'skill-categories', 'id="training"']) assert.ok(home.content.includes(marker), marker);
  assert.doesNotMatch(home.content, /data-hobby-|\/assets\/hobbies\/|Artwork Credits/);
  assert.doesNotMatch(home.content,/data-background-card/);
  assert.equal((home.content.match(/<article class="project-feature/g)||[]).length,projects.length);
  assert.ok(home.content.includes(projects.find(project=>project.id==='kwiztorya').previewScreens[0].src));
  assert.doesNotMatch(home.content,/hobby-art|highlight-tabs|STI Vio-Log workflow/);
  assert.equal((home.content.match(/<h1/g)||[]).length,1);
  for(const page of pages){
    const html=shell(page,{profile});
    assert.match(html,/inter-latin-variable.woff2/);
    for(const href of ['/about/','/stack/','/activity/','/resume/','/contact/']) assert.ok(html.includes(`href="${href}"`));
    assert.match(html,/class="main-nav"/); assert.doesNotMatch(html,/data-motion-pause|Pause motion/);
  }
});
test('new media records have source credits and local optimized assets', async()=>{
  assert.equal(profile.hobbyCards.length,5);
  assert.equal(profile.gallery.length,1);
  for(const item of [...profile.hobbyCards,...profile.gallery]){
    assert.ok(item.alt && item.credit && item.description && item.width>0 && item.height>0);
    assert.ok(item.src.startsWith('/assets/'));
    await readFile(new URL(`..${item.src}`,import.meta.url));
  }
});
test('gallery wraps and resets, deck positions wrap, motion stops at each lifecycle boundary',async()=>{
  const {galleryIndex,deckOffset,motionAllowed,spherePoints,projectPoint}=await import('../assets/home.js');
  assert.equal(galleryIndex(0,-1,3),2);assert.equal(galleryIndex(2,1,3),0);assert.equal(galleryIndex(2,0,3,true),0);assert.equal(galleryIndex(0,1,1),0);
  assert.deepEqual([0,1,2,3,4].map(i=>deckOffset(i,0,5)),[0,1,2,-2,-1]);
  const active={hidden:false,visible:true,interacting:false};
  assert.equal(motionAllowed(active),true);
  assert.equal(motionAllowed({...active,reduced:true}),true,'Decorative Home motion stays active under either system preference');
  for(const key of ['hidden','interacting']) assert.equal(motionAllowed({...active,[key]:true}),false,key);
  assert.equal(motionAllowed({...active,visible:false}),false);
  const points=spherePoints(20);assert.equal(points.length,20);
  for(const p of points){assert.ok(Math.abs(Math.hypot(p.x,p.y,p.z)-1)<1e-8);const q=projectPoint(p,.5);assert.ok(Number.isFinite(q.x)&&Number.isFinite(q.y)&&q.scale>0);}
  assert.deepEqual(spherePoints(0),[]);
});

test('wide-screen section tracking follows section positions',async()=>{
  const { currentSection }=await import('../assets/home.js');
  const sections=[{id:'top',top:-1000},{id:'about',top:-200},{id:'projects',top:200},{id:'skills',top:1500}];
  assert.equal(currentSection(sections,900),'projects');
  assert.equal(currentSection(sections,768),'projects');
  assert.equal(currentSection(sections,320),'about');

});

test('categorized skill evidence stays static and marquee copies are decorative',()=>{
  assert.doesNotMatch(home.content,/data-sphere-pause|data-sphere-list|data-sphere-controls|Pause sphere|List view|Sphere view/);
  assert.match(home.content, /class="skill-categories"/);
  assert.match(home.content, /href="\/projects\/sti-vio-log\/"/);
  assert.match(home.content, /data-sphere-presentation hidden><canvas/);
  assert.match(home.content,/<ul class="bento-tools" aria-hidden="true">/);
  const copy=home.content.match(/<ul class="bento-tools" aria-hidden="true">([\s\S]*?)<\/ul>/)[1];
  assert.doesNotMatch(copy,/<a |<button|tabindex/);
});
