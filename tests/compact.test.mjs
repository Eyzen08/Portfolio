import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderPages} from '../scripts/templates.mjs';
const profile=JSON.parse(await readFile(new URL('../data/profile.json',import.meta.url)));
const projects=JSON.parse(await readFile(new URL('../data/projects.json',import.meta.url)));
const technologies=JSON.parse(await readFile(new URL('../data/technologies.json',import.meta.url)));
const pages=renderPages({profile,projects,technologies});

test('overview and case-study mockups are not wrapped in additional devices',()=>{
 for(const project of projects)for(const route of ['/','/projects/',`/projects/${project.id}/`]){
   const html=pages.find(p=>p.route===route).content;
   for(const screen of project.previewScreens){
     assert.ok(html.includes(`src="${screen.src}"`));
     assert.ok(!html.includes(`class="phone-frame"><img src="${screen.src}"`));
     assert.ok(!html.includes(`class="monitor-display"><img src="${screen.src}"`));
   }
   assert.match(html,/Owner-Supplied Mockup/);
 }
});

test('Home and Activity expose a contribution card with a GitHub fallback link',()=>{
 for(const route of ['/','/activity/']){
  const html=pages.find(p=>p.route===route).content;
  assert.match(html,/class="contribution-card"/);
  assert.match(html,/>Contribution Activity<\/h[34]>/);
  assert.match(html,/href="https:\/\/github.com\/Eyzen08\?tab=overview"[^>]*>View on GitHub/);
  assert.match(html,/data-calendar-section hidden/);
  assert.match(html,/class="calendar-scroll" tabindex="0" role="region" aria-label="Contribution calendar"/);
  assert.match(html,/Read Daily Contribution Counts/);
 }
});

test('globe mesh is finite, connected on the sphere and rotates through the existing projection',async()=>{
 const {sphereMesh,projectPoint}=await import('../assets/home.js');
 assert.equal(typeof sphereMesh,'function');const lines=sphereMesh();
 assert.equal(lines.length,840);
 for(const line of lines)for(const p of line){assert.ok(Math.abs(Math.hypot(p.x,p.y,p.z)-1)<1e-9);assert.ok(Number.isFinite(projectPoint(p,.7).x));}
 const point=lines.find(l=>Math.abs(l[0].x)>.1)[0];assert.notDeepEqual(projectPoint(point,0),projectPoint(point,.4));
});

test('new Home mockup leads the supplied Kwiz sequence without fabricated release claims',()=>{
 const kwiz=projects.find(p=>p.id==='kwiztorya');assert.deepEqual(kwiz.previewScreens.map(s=>s.id),['home','quiz','story','settings']);
 assert.equal(kwiz.previewScreens[0].presentationLabel,'Owner-Supplied Mockup');
 assert.match(kwiz.previewScreens[0].caption,/not an unmodified device capture/);
 assert.equal(kwiz.platform,'Mobile');assert.equal(kwiz.liveUrl,null);
 assert.ok(kwiz.previewScreens.every(s=>!s.originalSrc));
});
