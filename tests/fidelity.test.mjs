import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { renderPages, shell } from '../scripts/templates.mjs';
import { motionAllowed } from '../assets/home.js';

const [profile, projects, technologies] = await Promise.all(['profile','projects','technologies'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url)))));
const pages = renderPages({profile,projects,technologies});
const home = pages.find(page=>page.route==='/');

test('reference composition uses the supplied transparent formal portrait and truthful sections', async()=>{
  assert.match(home.content,/hero-formal-portrait/);
  assert.match(home.content,/class="reference-heading"/);
  const ids=['about','education','skills','projects','experience','training','ai','github','contact'];
  const positions=ids.map(id=>home.content.indexOf(`id="${id}"`));
  assert.ok(positions.every(value=>value>=0));
  assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));
  assert.match(home.content,/id="skills" data-sphere/);
  assert.match(home.content,/data-sphere-presentation hidden/);
  assert.doesNotMatch(home.content,/data-skill-folder/);
  assert.match(home.content,/name="experience-rows"/);
  assert.match(home.content,/data-contact-form/);
  assert.doesNotMatch(home.content,/JERWIN|TEÑAJURA|CLIENT SATISFACTION|PROJECTS DELIVERED/);
  assert.match(shell(home,{profile}),/archivo-variable\.ttf/);
  const image=await readFile(new URL('../assets/personal/ej-formal-cutout.png',import.meta.url));
  assert.equal(createHash('sha256').update(image).digest('hex'),profile.heroPortrait.sha256);
});

test('OS motion preference leaves intended autoplay active while manual galleries remain available',()=>{
  const active={hidden:false,visible:true,interacting:false,reduced:false};
  assert.equal(motionAllowed(active),true);
  assert.equal(motionAllowed({...active,reduced:true}),true);
});


test('restored globe uses project-backed logos while every current skill remains linked',()=>{
  const skills=home.content.slice(home.content.indexOf('id="skills"'),home.content.indexOf('id="projects"'));
  assert.match(skills,/class="skills-layout"/);
  assert.match(skills,/<canvas width="640" height="520" aria-hidden="true"><\/canvas>/);
  assert.equal((skills.match(/data-sphere-item\b/g)||[]).length,technologies.filter(tech=>tech.projects.length&&tech.name!=='Node test runner').length);
  for(const tech of technologies.filter(tech=>tech.name!=='Node test runner')) {
    assert.ok(skills.includes(tech.name.replaceAll('&','&amp;')),tech.name);
    const href=tech.projects.length?`/projects/${tech.projects[0]}/`:'/resume/#skills';
    assert.ok(skills.includes(`href="${href}"`),href);
  }
  assert.match(skills,/Familiar languages/);
  assert.match(skills,/AI &amp; Learning/);
  assert.match(skills,/href="#ai"/);
  for(const tool of profile.aiTools) assert.ok(skills.includes(tool.name));
});
