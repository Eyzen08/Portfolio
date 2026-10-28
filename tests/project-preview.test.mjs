import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPages } from '../scripts/templates.mjs';
const [profile,projects,technologies]=await Promise.all(['profile','projects','technologies'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url)))));

test('Projects exposes all cards, separate preview and case actions, and complete project descriptions',()=>{
  const html=renderPages({profile,projects,technologies}).find(page=>page.route==='/projects/').content;
  assert.match(html,/<h1>Projects<\/h1>/);
  assert.match(html,/data-project-grid/);assert.doesNotMatch(html,/data-project-rail/);
  const cards=[...html.matchAll(/<article class="project-card[\s\S]*?<\/article>/g)].map(match=>match[0]);
  assert.equal(cards.length,projects.length);
  for(const [index,project] of projects.entries()){
    const card=cards[index];assert.ok(card.includes(project.role.replaceAll('&','&amp;')));assert.match(card,/class="tags"/);
    assert.match(card,/View Project/);assert.match(card,/Case Study/);
    assert.ok(card.includes(`href="/projects/${project.id}/"`));
    assert.ok(card.includes(`href="${project.previewScreens[0].src}"`),'Preview retains its no-JS image destination');
    const dialog=html.match(new RegExp(`<section data-project-panel="${project.id}"[\\s\\S]*?</section>`))[0];
    assert.equal((dialog.match(/data-preview-slide/g)||[]).length,project.previewScreens.length);
    assert.doesNotMatch(dialog,/class="monitor-frame"|class="phone-frame"|data-deck/);
    for(const screen of project.previewScreens){
      assert.ok(dialog.includes(`src="${screen.src}"`));assert.ok(dialog.includes(screen.caption.replaceAll('&','&amp;')));
      if(screen.originalSrc)assert.ok(dialog.includes(`href="${screen.originalSrc}"`));
    }
  }
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);assert.equal(ids.length,new Set(ids).size);
  for(const match of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g))assert.ok(ids.includes(match[1]));
});

function node(){return {dataset:{},hidden:false,textContent:'',listeners:{},attributes:{},addEventListener(type,fn){this.listeners[type]=fn;},setAttribute(k,v){this.attributes[k]=v;}};}
function globals(t,names){const original=new Map(names.map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));t.after(()=>names.forEach(name=>original.get(name)?Object.defineProperty(globalThis,name,original.get(name)):delete globalThis[name]));}

test('project grid follows combined search and category filters, including zero results and reset',async t=>{
  globals(t,['document','localStorage','matchMedia']);
  const input=Object.assign(node(),{value:'',focus(){}}),result=node(),empty=node(),grid=Object.assign(node(),{dataset:{}}),reset=node(),controls=node();
  const items=[Object.assign(node(),{dataset:{search:'STI React PostgreSQL',itemCategory:'web'}}),Object.assign(node(),{dataset:{search:'Kwiztorya Java Android',itemCategory:'mobile'}})];
  const buttons=['all','web','mobile'].map(category=>Object.assign(node(),{dataset:{category},click(){this.listeners.click();}}));
  const group={dataset:{filterGroup:'projects'},dispatchEvent(){},querySelectorAll:s=>s==='[data-filter-item]'?items:buttons,
    querySelector:s=>({'[data-filter-controls]':controls,'input[type="search"]':input,'[data-result-count]':result,'[data-empty]':empty,'[data-reset]':reset,'[data-project-grid]':grid})[s]};
  globalThis.document={documentElement:{dataset:{}},querySelector:()=>null,querySelectorAll:s=>s==='[data-filter-group]'?[group]:[],addEventListener(){}};
  globalThis.localStorage={getItem:()=>null};globalThis.matchMedia=()=>({matches:true,addEventListener(){}});
  await import('../assets/app.js?project-grid-regression');assert.equal(grid.dataset.count,'2');assert.equal(grid.hidden,false);
  buttons[2].click();input.value='java';input.listeners.input();assert.equal(grid.dataset.count,'1');assert.equal(items[0].hidden,true);assert.equal(items[1].hidden,false);
  input.value='react';input.listeners.input();assert.equal(grid.hidden,true);assert.equal(empty.hidden,false);assert.equal(result.textContent,'0 projects');
  reset.listeners.click();assert.equal(grid.dataset.count,'2');assert.equal(grid.hidden,false);assert.equal(empty.hidden,true);
});
