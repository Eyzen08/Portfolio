import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderPages} from '../scripts/templates.mjs';
const [profile,projects,technologies]=await Promise.all(['profile','projects','technologies'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url)))));
const pages=renderPages({profile,projects,technologies});

test('six supplied steps retain the existing card grid and update both heading layers',()=>{
  const home=pages.find(page=>page.route==='/').content;
  const section=home.slice(home.indexOf('class="contact-next"'),home.indexOf('class="contact-layout"'));
  assert.equal((section.match(/Let’s Build Together/g)||[]).length,2);
  assert.equal((section.match(/<article>/g)||[]).length,6);
  assert.match(section,/class="next-step-grid"/);
  const titles=['Share the opportunity','Talk through the details','Build &amp; experiment','Explore artificial intelligence','Dive into AI engineering','Build &amp; grow together'];
  let previous=-1;
  for(const title of titles){const at=section.indexOf(`<h3>${title}</h3>`);assert.ok(at>previous,title);previous=at;}
  for(const label of ['Start a conversation','Understand the scope','Explore my projects','Discover my AI journey',"Explore what’s possible",'Let’s move forward'])assert.ok(section.includes(label),label);
});
