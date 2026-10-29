import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderPages} from '../scripts/templates.mjs';

test('tech strip repeats every public skill with decorative, matching copies',async()=>{
 const [profile,projects,technologies]=await Promise.all(['profile','projects','technologies'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url)))));
 const home=renderPages({profile,projects,technologies}).find(page=>page.route==='/').content;
 const lists=[...home.matchAll(/<ul class="bento-tools"[^>]*>([\s\S]*?)<\/ul>/g)];
 assert.equal(lists.length,2);
 const skills=technologies.filter(tech=>tech.name!=='Node test runner');
 assert.equal(skills.length,39);
 for(const list of lists){
  assert.equal((list[1].match(/<li>/g)||[]).length,skills.length);
  for(const tech of skills){
   assert.ok(list[1].includes(`>${tech.name.replaceAll('&','&amp;')}<`),tech.name);
   assert.ok(list[1].includes(`/assets/icons/${tech.iconId||tech.id}.svg`),tech.name);
  }
 }
 assert.match(lists[1][0],/aria-hidden="true"/);
 assert.doesNotMatch(lists[1][1],/<a\b|<button\b|tabindex/);
 const labels=list=>[...list.matchAll(/<span>([^<]*)<\/span>/g)].map(match=>match[1]);
 assert.deepEqual(labels(lists[0][1]),labels(lists[1][1]));
});
