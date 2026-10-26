import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderPages} from '../scripts/templates.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
const profile=JSON.parse(await read('data/profile.json'));
const projects=JSON.parse(await read('data/projects.json'));
const technologies=JSON.parse(await read('data/technologies.json'));

test('each experience retains six ordered responsibilities on Home and résumé',()=>{
  assert.equal(profile.experience.length,2);
  for(const item of profile.experience){
    assert.equal(item.bullets.length,6,item.organization);
    assert.equal(new Set(item.bullets).size,6);
    for(const bullet of item.bullets)assert.match(bullet,/^[A-Z][a-z]+ .+ to .+\.$/);
  }
  const pages=renderPages({profile,projects,technologies});
  for(const route of ['/','/resume/']){
    const html=pages.find(page=>page.route===route).content;
    const lists=[...html.matchAll(/<ul class="experience-bullets">([\s\S]*?)<\/ul>/g)];
    assert.equal(lists.length,2,route);
    lists.forEach((list,i)=>{
      assert.equal((list[1].match(/<li>/g)||[]).length,6);
      let previous=-1;
      for(const text of profile.experience[i].bullets){const at=list[1].indexOf(text.replaceAll("'",'&#39;'));assert.ok(at>previous);previous=at;}
    });
  }
});

test('education remains exactly the two supplied institutions, qualifications and periods',()=>{
  assert.deepEqual(profile.education.map(({organization,title,period})=>({organization,title,period})),[
    {organization:'STI College Global City',title:'Bachelor of Science in Information Technology (BSIT)',period:'2023–Present'},
    {organization:'Moreh Academy',title:'Information and Communications Technology (ICT) Strand, Senior High School',period:'2021–2023'}
  ]);
});

test('production styles and controllers do not automatically suppress motion by OS preference',async()=>{
  for(const path of ['assets/site.css','assets/redesign.css','assets/motion.css','assets/home.js','assets/decks.js','assets/motion.js'])
    assert.doesNotMatch(await read(path),/prefers-reduced-motion/,path);
});
