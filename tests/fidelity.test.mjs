import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { renderPages, shell } from '../scripts/templates.mjs';
import { motionAllowed } from '../assets/home.js';

const [profile, projects, technologies] = await Promise.all(['profile','projects','technologies'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url)))));
const pages = renderPages({profile,projects,technologies});
const home = pages.find(page=>page.route==='/');

test('hero strip presents the three development capabilities in order',()=>{
  const strip=home.content.match(/<div class="hero-facts">([\s\S]*?)<\/section>/)[1];
  const pairs=[...strip.matchAll(/<strong>(.*?)<\/strong><span>(.*?)<\/span>/g)].map(match=>match.slice(1));
  assert.deepEqual(pairs,[
    ['WEB + APP','APPLICATION DEVELOPMENT'],
    ['FULL-STACK','FRONTEND &amp; BACKEND'],
    ['AI-ASSISTED','DEVELOPMENT WORKFLOW']
  ]);
});

test('reference composition uses the supplied transparent formal portrait and truthful sections', async()=>{
  assert.match(home.content,/hero-formal-portrait/);
  assert.match(home.content,/class="reference-heading"/);
  const ids=['about','education','projects','experience','skills','training','ai','github','contact'];
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
  assert.equal(image.subarray(1,4).toString(),'PNG');
  assert.equal(image.readUInt32BE(16),profile.heroPortrait.width);
  assert.equal(image.readUInt32BE(20),profile.heroPortrait.height);
  assert.equal(image[25],6,'Hero PNG supports full alpha transparency');
  assert.equal(createHash('sha256').update(image).digest('hex'),profile.heroPortrait.sha256);
});

test('OS motion preference leaves intended autoplay active while manual galleries remain available',()=>{
  const active={hidden:false,visible:true,interacting:false,reduced:false};
  assert.equal(motionAllowed(active),true);
  assert.equal(motionAllowed({...active,reduced:true}),true);
});


test('globe shows branded technologies and AI tools while all skills retain their evidence links',()=>{
  const skills=home.content.slice(home.content.indexOf('id="skills"'),home.content.indexOf('id="training"'));
  assert.match(skills,/class="skills-layout"/);
  assert.match(skills,/<canvas width="640" height="520" tabindex="0" role="group" aria-label="Interactive technology globe" aria-describedby="sphere-instructions"><\/canvas>/);
  const globeItems=[...skills.matchAll(/<li data-sphere-item data-name="([^"]+)">([\s\S]*?)<\/li>/g)];
  assert.equal(globeItems.length,32);
  for(const [,name,item] of globeItems)assert.doesNotMatch(item,/src="\/assets\/icons\/(?:code|document|database)\.svg"/,name);
  for(const [name,id] of [['TypeScript','typescript'],['Tailwind CSS','tailwind']]){
    const item=globeItems.find(item=>item[1]===name);assert.ok(item,name);
    assert.ok(item[2].includes(`/assets/icons/${id}.svg`),name);
  }
  for(const name of ['SQL','XML','SharedPreferences','PDFKit','ExcelJS','Responsive user interfaces','REST APIs','Role-based access control','Cookie-based sessions','CSRF protection'])assert.ok(!globeItems.some(item=>item[1]===name),name);
  for(const tech of technologies.filter(tech=>tech.name!=='Node test runner')) {
    assert.ok(skills.includes(tech.name.replaceAll('&','&amp;')),tech.name);
    const href=tech.projects.length?`/projects/${tech.projects[0]}/`:'/resume/#skills';
    assert.ok(skills.includes(`href="${href}"`),href);
  }
  assert.match(skills,/Familiar languages/);
  assert.match(skills,/AI Tools I Use/);
  assert.match(skills,/href="#ai"/);
  for(const tool of profile.aiTools) assert.ok(skills.includes(`<li data-sphere-item data-name="${tool.name}"><img src="${tool.logo}"`),tool.name);
});
