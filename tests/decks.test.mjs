import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderPages} from '../scripts/templates.mjs';
const profile=JSON.parse(await readFile(new URL('../data/profile.json',import.meta.url)));
const projects=JSON.parse(await readFile(new URL('../data/projects.json',import.meta.url)));
const technologies=JSON.parse(await readFile(new URL('../data/technologies.json',import.meta.url)));
const pages=renderPages({profile,projects,technologies});
test('project contexts retain static complete images before JS',()=>{
  for(const [route,count] of [['/',0],['/projects/',0],['/projects/sti-vio-log/',0],['/projects/kwiztorya/',0]]){
    const html=pages.find(p=>p.route===route).content;
    assert.equal((html.match(/data-picture-deck/g)||[]).length,count,route);
    assert.ok(!html.includes('phone-trio'));
    assert.ok(!html.includes('class="project-stage"'));
    const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
    for(const match of html.matchAll(/aria-controls="([^"]+)"/g))assert.ok(ids.includes(match[1]));
    assert.ok(!/data-deck-card[^>]* hidden/.test(html));
    if(route.startsWith('/projects/')&&route!=='/projects/') assert.ok(!html.includes('data-deck-controls'));
    else assert.ok(!html.includes('data-rail-controls'));
  }
});
test('both single project images have complete local records',async()=>{
  assert.deepEqual(projects.map(p=>p.previewScreens.length),[1,1]);
  for(const project of projects)for(const screen of project.previewScreens){
    assert.equal(screen.kind,'desktop');assert.equal(screen.deviceFrame,true);
    assert.ok(screen.label&&screen.alt&&screen.caption&&screen.explanation);
    assert.equal(screen.presentationLabel,'Owner-Supplied Mockup');
    for(const field of ['src','srcSmall'])await readFile(new URL(`..${screen[field]}`,import.meta.url));
  }
});

function node(textContent=''){return {dataset:{},hidden:false,textContent,scrollHeight:150,attrs:{},listeners:{},hasAttribute(k){return k in this.attrs;},style:{setProperty(){}},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){this.listeners[k]=fn;},contains(n){return n===this;},querySelector(){return null;},querySelectorAll(){return [];}};}
test('shared decks autoplay independently, pause on interaction and reset hidden time',async t=>{
  const keys=['document','matchMedia','ResizeObserver','IntersectionObserver','setTimeout','clearTimeout'];const saved=new Map(keys.map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
  t.after(()=>keys.forEach(k=>saved.get(k)?Object.defineProperty(globalThis,k,saved.get(k)):delete globalThis[k]));
  const build=(count,kind='project',compact=false)=>{const group=node();group.dataset.deckKind=kind;if(compact)group.attrs['data-deck-compact']='';const controls=node(),prev=node(),next=node(),counter=node(),stage=node();
    const captions=Array.from({length:count},()=>node());const buttons=Array.from({length:count},(_,i)=>{const b=node();b.dataset.deckIndex=String(i);return b;});
    const cards=captions.map((caption,i)=>{const c=node();c.querySelector=s=>s==='[data-deck-caption]'?(compact?null:caption):node();return c;});
    group.querySelectorAll=s=>s==='[data-deck-card]'?cards:compact?[]:buttons;
    group.querySelector=s=>compact&&s!=='[data-deck-stage]'?null:({'[data-deck-controls]':controls,'[data-deck-prev]':prev,'[data-deck-next]':next,'[data-deck-counter]':counter,'[data-deck-stage]':stage})[s]||null;
    return {group,cards,captions,buttons,prev,next,counter};};
  const a=build(6),b=build(3),compact=build(4,'project',true),background=build(3,'background');const groups=[a,b,compact,background];const doc=node();doc.documentElement={dataset:{motion:"full"}};doc.hidden=false;doc.querySelectorAll=()=>groups.map(x=>x.group);globalThis.document=doc;
  const media={matches:false,listeners:{},addEventListener(type,fn){this.listeners[type]=fn;}};globalThis.matchMedia=()=>media;globalThis.ResizeObserver=class{observe(){}};let observer;globalThis.IntersectionObserver=class{constructor(fn){observer=fn;}observe(){}};
  let now=0,id=0;const timers=new Map();globalThis.setTimeout=(fn,ms)=>{timers.set(++id,{fn,at:now+ms});return id;};globalThis.clearTimeout=id=>timers.delete(id);
  const advance=ms=>{now+=ms;for(const [id,timer] of [...timers])if(timer.at<=now){timers.delete(id);timer.fn();}};
  const {initDecks}=await import('../assets/decks.js');initDecks();assert.equal(timers.size,0);
  observer(groups.map(x=>({target:x.group,isIntersecting:true})));advance(4000);
  assert.equal(a.buttons[1].attrs['aria-pressed'],'true');assert.equal(compact.cards[1].attrs['aria-hidden'],'false');assert.equal(b.buttons[1].attrs['aria-pressed'],'true');assert.equal(background.buttons[1].attrs['aria-pressed'],'true');
  background.buttons[2].listeners.pointerenter({pointerType:'mouse'});assert.equal(background.buttons[2].attrs['aria-pressed'],'true');
  background.buttons[0].listeners.focus();assert.equal(background.buttons[0].attrs['aria-pressed'],'true');
  a.next.listeners.click();assert.equal(a.buttons[2].attrs['aria-pressed'],'true');assert.equal(b.buttons[1].attrs['aria-pressed'],'true');
  a.group.listeners.pointerenter();advance(4000);assert.equal(a.buttons[2].attrs['aria-pressed'],'true');assert.equal(b.buttons[2].attrs['aria-pressed'],'true');
  a.group.listeners.pointerleave();a.group.listeners.focusin();advance(4000);assert.equal(a.buttons[2].attrs['aria-pressed'],'true');assert.equal(b.buttons[0].attrs['aria-pressed'],'true');
  a.group.listeners.focusout({relatedTarget:null});advance(4000);assert.equal(a.buttons[3].attrs['aria-pressed'],'true');
  a.buttons[5].listeners.click();a.next.listeners.click();assert.equal(a.buttons[0].attrs['aria-pressed'],'true');a.prev.listeners.click();assert.equal(a.buttons[5].attrs['aria-pressed'],'true');
  doc.hidden=true;doc.listeners.visibilitychange();assert.equal(timers.size,0);advance(60000);doc.hidden=false;doc.listeners.visibilitychange();advance(3999);assert.equal(a.buttons[5].attrs['aria-pressed'],'true');
  observer(groups.map(x=>({target:x.group,isIntersecting:false})));assert.equal(timers.size,0);
  assert.equal(a.captions.filter(c=>!c.hidden).length,1);assert.equal(a.counter.textContent,'6 / 6');
  a.group.dataset.previewOpen='true';
  observer([{target:a.group,isIntersecting:true}]);
  const previewFrame=a.counter.textContent;
  a.group.listeners.focusout({relatedTarget:null});advance(4000);
  assert.equal(a.counter.textContent,previewFrame,'An open viewer must keep its card paused even when focus moves to browser chrome');
  delete a.group.dataset.previewOpen;a.group.listeners.previewchange();advance(4000);
  assert.notEqual(a.counter.textContent,previewFrame,'Normal autoplay resumes after the viewer closes and focus leaves');
  media.matches=true;media.listeners.change?.();assert.ok(timers.size>0,'OS reduced motion leaves visible autoplay active');
  const beforeManual=a.counter.textContent;a.next.listeners.click();assert.notEqual(a.counter.textContent,beforeManual,'Manual controls remain available');
  const manualFrame=a.counter.textContent;advance(4000);assert.notEqual(a.counter.textContent,manualFrame,'Autoplay continues under reduced motion');
  media.matches=false;media.listeners.change?.();assert.ok(timers.size>0,'Autoplay remains active under standard motion');
  doc.documentElement.dataset.motion='reduced';doc.listeners.motionchange();assert.equal(timers.size,0);
  const paused=a.counter.textContent;advance(12000);assert.equal(a.counter.textContent,paused);
  a.next.listeners.click();assert.notEqual(a.counter.textContent,paused,'Manual gallery controls still work');
  doc.documentElement.dataset.motion='full';doc.listeners.motionchange();assert.ok(timers.size>0);
});
