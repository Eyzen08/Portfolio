import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPages } from '../scripts/templates.mjs';
const [profile,projects,technologies]=await Promise.all(['profile','projects','technologies'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url)))));

test('Projects exposes both cards, separate preview and case actions, and complete image provenance',()=>{
  const html=renderPages({profile,projects,technologies}).find(page=>page.route==='/projects/').content;
  assert.match(html,/<h1>Projects<\/h1>/);
  assert.match(html,/data-project-grid/);assert.doesNotMatch(html,/data-project-rail/);
  const cards=[...html.matchAll(/<article class="project-card[\s\S]*?<\/article>/g)].map(match=>match[0]);
  assert.equal(cards.length,2);
  for(const [index,project] of projects.entries()){
    const card=cards[index];assert.ok(card.includes(project.role));assert.match(card,/class="tags"/);
    assert.match(card,/Preview Screenshots/);assert.match(card,/View Case Study/);
    assert.ok(card.includes(`href="/projects/${project.id}/"`));
    assert.match(card,/<dialog[^>]+aria-labelledby=/);
    assert.ok(card.includes(`href="${project.previewScreens[0].src}"`),'Preview retains its no-JS image destination');
    const dialog=card.match(/<dialog[\s\S]*?<\/dialog>/)[0];
    assert.equal((dialog.match(/data-preview-slide/g)||[]).length,project.previewScreens.length);
    assert.doesNotMatch(dialog,/class="monitor-frame"|class="phone-frame"|data-deck/);
    for(const screen of project.previewScreens){
      assert.ok(dialog.includes(`src="${screen.src}"`));assert.ok(dialog.includes(screen.caption.replaceAll('&','&amp;')));
      if(screen.originalSrc)assert.ok(dialog.includes(`href="${screen.originalSrc}"`));
    }
  }
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);assert.equal(ids.length,new Set(ids).size);
  for(const match of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g))assert.ok(ids.includes(match[1]));
});

function node(){return {dataset:{},hidden:false,textContent:'',listeners:{},attributes:{},addEventListener(type,fn){this.listeners[type]=fn;},setAttribute(k,v){this.attributes[k]=v;}};}
function globals(t,names){const original=new Map(names.map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));t.after(()=>names.forEach(name=>original.get(name)?Object.defineProperty(globalThis,name,original.get(name)):delete globalThis[name]));}

test('viewer opens the displayed screen, wraps manually, closes cleanly, and falls back without dialog support',async t=>{
  globals(t,['document']);
  const slides=Array.from({length:3},node),buttons=Array.from({length:3},(_,index)=>Object.assign(node(),{dataset:{previewIndex:String(index)}}));
  const counter=node(),prev=node(),next=node(),close=node(),opener=Object.assign(node(),{focuses:0,focus(){this.focuses++;}});
  const dialog=Object.assign(node(),{open:false,showModal(){this.open=true;},close(){this.open=false;this.listeners.close();},
    querySelectorAll:s=>s==='[data-preview-slide]'?slides:buttons,
    querySelector:s=>({'[data-preview-count]':counter,'[data-preview-prev]':prev,'[data-preview-next]':next,'[data-preview-close]':close})[s]});
  const frames=[node(),node(),node()];frames[1].dataset.selected='true';
  const card={dataset:{},dispatchEvent(){},querySelector:()=>dialog,querySelectorAll:s=>s==='[data-preview-open]'?[opener]:frames};
  const classes=new Set();globalThis.document={querySelectorAll:()=>[card],documentElement:{classList:{add:s=>classes.add(s),remove:s=>classes.delete(s)}}};
  const {initProjectPreviews}=await import('../assets/decks.js');assert.equal(typeof initProjectPreviews,'function');initProjectPreviews();
  let prevented=0;const event={button:0,currentTarget:opener,preventDefault(){prevented++;}};
  opener.listeners.click({...event,ctrlKey:true});assert.equal(prevented,0);assert.equal(dialog.open,false);
  opener.listeners.click(event);assert.equal(prevented,1);assert.equal(dialog.open,true);assert.ok(classes.has('preview-open'));
  assert.equal(card.dataset.previewOpen,'true');
  assert.equal(counter.textContent,'2 / 3');assert.equal(slides[1].hidden,false);
  next.listeners.click();assert.equal(counter.textContent,'3 / 3');next.listeners.click();assert.equal(counter.textContent,'1 / 3');
  dialog.listeners.keydown({key:'ArrowLeft',preventDefault(){}});assert.equal(counter.textContent,'3 / 3');
  dialog.listeners.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(counter.textContent,'1 / 3');
  buttons[1].listeners.click();assert.equal(buttons[1].attributes['aria-pressed'],'true');assert.equal(slides.filter(slide=>!slide.hidden).length,1);
  prev.listeners.click();assert.equal(counter.textContent,'1 / 3');close.listeners.click();
  assert.equal(dialog.open,false);assert.equal(classes.has('preview-open'),false);assert.equal(opener.focuses,1);
  assert.equal(card.dataset.previewOpen,undefined);
  delete dialog.showModal;opener.listeners={};initProjectPreviews();assert.equal(opener.listeners.click,undefined,'Unsupported dialogs leave native image links alone');
});

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
