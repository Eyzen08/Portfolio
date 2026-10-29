import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderPages} from '../scripts/templates.mjs';
import {initProjectPreviews} from '../assets/decks.js';
const [profile,projects,technologies]=await Promise.all(['profile','projects','technologies'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url)))));
test('overview pages use one shared project-details dialog outside filterable rows',()=>{
  for(const route of ['/','/projects/']){
    const html=renderPages({profile,projects,technologies}).find(p=>p.route===route).content;
    assert.equal((html.match(/data-project-viewer/g)||[]).length,1);
    const rows=[...html.matchAll(/<article class="(?:project-feature|project-card)[\s\S]*?<\/article>/g)].map(m=>m[0]);
    for(const row of rows){assert.doesNotMatch(row,/<dialog/);assert.match(row,/aria-controls="project-details-viewer"/);}
    assert.ok(html.indexOf('data-project-viewer')>html.lastIndexOf('</article>'));
    assert.ok(html.includes('data-project-panel="sti-vio-log"'));assert.ok(html.includes('data-project-panel="kwiztorya"'));assert.match(html,/More Work/);assert.doesNotMatch(html,/data-project-switch/);
    assert.ok(html.includes('href="https://stiviolog.com/" >Live Site'));
    assert.match(html,/preview-ambient/);assert.match(html,/Close Project Details/);
  }
});
test('project views omit full-image links and popups recommend every other project once',()=>{
  const pages=renderPages({profile,projects,technologies});
  for(const page of pages)assert.doesNotMatch(page.content,/View Full Image|class="(?:picture-image-links|preview-full-image)"/);
  for(const route of ['/','/projects/']){
    const html=pages.find(page=>page.route===route).content;
    for(const project of projects){
      const dialog=html.match(new RegExp(`<section data-project-panel="${project.id}"[\\s\\S]*?</section>`))[0];
      const others=projects.filter(other=>other.id!==project.id);
      assert.equal((dialog.match(/class="project-more-work"/g)||[]).length,1);
      assert.equal((dialog.match(/class="more-project"/g)||[]).length,projects.length-1);
      const footer=dialog.match(/<footer class="project-more-work">[\s\S]*?<\/footer>/)[0];
      assert.match(footer,/>Up Next</);assert.match(footer,/>More Work</);
      assert.match(footer,/class="more-work-grid" data-more-work-track tabindex="0" role="region" aria-label="More projects, scroll horizontally"/);
      assert.match(footer,/Use the arrows, mouse wheel, or swipe to explore\./);
      for(const direction of ['prev','next'])assert.ok(footer.includes(`data-more-work-${direction}`));
      assert.match(footer,/aria-label="Previous projects"/);assert.match(footer,/aria-label="Next projects"/);
      assert.ok(footer.includes(`id="more-work-${project.id}"`));
      assert.equal((footer.match(new RegExp(`aria-controls="more-work-${project.id}"`,'g'))||[]).length,2);
      for(const other of others){
        assert.ok(footer.includes(`href="${other.previewScreens[0].src}"`));
        assert.ok(footer.includes(`data-details-open data-project-id="${other.id}"`));
        assert.ok(footer.includes(`src="${other.previewScreens[0].srcSmall}"`));
        assert.equal((footer.match(new RegExp(`data-project-id="${other.id}"`,'g'))||[]).length,1);
      }
      assert.ok(!footer.includes(`href="/projects/${project.id}/"`));
      assert.ok(html.includes(`class="project-screenshot-link" href="${project.previewScreens[0].src}"`));
    }
  }
  for(const project of projects){
    const html=pages.find(page=>page.route===`/projects/${project.id}/`).content;
    const other=projects[(projects.indexOf(project)+1)%projects.length];
    assert.doesNotMatch(html,/class="project-more-work"/);
    assert.ok(html.includes(`href="/projects/${other.id}/">Next Case Study`));
  }
});
function element(dataset={}){return {dataset,hidden:false,listeners:{},listenerOptions:{},attributes:{},style:{},textContent:'',addEventListener(k,fn,options){this.listeners[k]=fn;this.listenerOptions[k]=options;},setAttribute(k,v){this.attributes[k]=v;},focus(){document.activeElement=this;this.focuses=(this.focuses||0)+1;},closest(){return null;}};}
function fixture(t,{supported=true,throws=false,count=4,navigation=true}={}){
  const original=Object.getOwnPropertyDescriptor(globalThis,'document');t.after(()=>original?Object.defineProperty(globalThis,'document',original):delete globalThis.document);
  const originalObserver=Object.getOwnPropertyDescriptor(globalThis,'ResizeObserver');
  t.after(()=>originalObserver?Object.defineProperty(globalThis,'ResizeObserver',originalObserver):delete globalThis.ResizeObserver);
  globalThis.ResizeObserver=class{constructor(callback){this.callback=callback;}observe(node){node.onResize=this.callback;}};
  const close=element(),title=element(),thumb=element(),featured=element();
  const panels=projects.map(({id},i)=>{
    const p=element({projectPanel:id,projectTitle:projects[i].title,projectFeatured:String(i===0)});
    p.slides=Array.from({length:count},()=>element());p.buttons=navigation?p.slides.map((_,j)=>element({previewIndex:String(j)})):[];p.counter=navigation?element():null;p.previous=navigation?element():null;p.next=navigation?element():null;p.image={src:`/${id}.webp`};
    p.querySelectorAll=s=>s==='[data-preview-slide]'?p.slides:p.buttons;
    p.rail=Object.assign(element(),{scrollLeft:250,scrollWidth:1500,clientWidth:600});
    p.morePrev=element();p.moreNext=element();
    p.morePrev.getAttribute=k=>p.morePrev.attributes[k];p.moreNext.getAttribute=k=>p.moreNext.attributes[k];
    p.rail.children=[{offsetLeft:0},{offsetLeft:314},{offsetLeft:628}];
    p.rail.scrollBy=function(options){this.lastScroll=options;this.scrollLeft=Math.max(0,Math.min(this.scrollWidth-this.clientWidth,this.scrollLeft+options.left));this.listeners.scroll?.();};
    p.querySelector=s=>({'[data-preview-count]':p.counter,'[data-preview-prev]':p.previous,'[data-preview-next]':p.next,'.preview-image':p.image,'[data-more-work-track]':p.rail,'[data-more-work-prev]':p.morePrev,'[data-more-work-next]':p.moreNext}[s]);return p;
  });
  const links=panels.map(p=>element({projectId:p.dataset.projectPanel}));const switches=panels.map(p=>element({projectId:p.dataset.projectPanel}));
  const last=element();const classes=new Set();
  const dialog=Object.assign(element(),{open:false,scrollTop:44,querySelector:s=>({'[data-project-title]':title,'[data-project-thumbnail]':thumb,'[data-project-featured]':featured,'[data-preview-close]':close}[s]),querySelectorAll:s=>s==='[data-project-panel]'?panels:s==='[data-project-switch]'?switches:[close,last],getBoundingClientRect:()=>({left:10,top:10,right:500,bottom:500}),close(){this.open=false;this.listeners.close();}});
  if(supported)dialog.showModal=function(){if(throws)throw Error('unavailable');this.open=true;this.opens=(this.opens||0)+1;};
  globalThis.document={activeElement:null,querySelector:()=>dialog,querySelectorAll:s=>s==='[data-details-open]'?[...links,...switches]:[],documentElement:{dataset:{motion:'full'},classList:{add:s=>classes.add(s),remove:s=>classes.delete(s)}}};
  initProjectPreviews();return {dialog,panels,links,switches,close,last,title,thumb,featured,classes};
}
function click(node,extra={}){let prevented=false;node.listeners.click?.({button:0,currentTarget:node,preventDefault(){prevented=true;},...extra});return prevented;}
test('STI details wraps images, traps focus and restores its external opener',t=>{
 const f=fixture(t);assert.equal(click(f.links[0],{ctrlKey:true}),false);assert.equal(click(f.links[0]),true);
 assert.equal(f.dialog.open,true);assert.ok(f.classes.has('preview-open'));assert.equal(f.title.textContent,'STI Vio-Log');
 f.panels[0].previous.listeners.click();assert.equal(f.panels[0].counter.textContent,'4 / 4');
 f.panels[0].buttons[2].listeners.click();assert.equal(f.panels[0].counter.textContent,'3 / 4');
 f.dialog.listeners.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(f.panels[0].counter.textContent,'4 / 4');
 f.close.focus();f.dialog.listeners.keydown({key:'Tab',shiftKey:true,preventDefault(){}});assert.equal(document.activeElement,f.last);
 f.dialog.listeners.keydown({key:'Tab',shiftKey:false,preventDefault(){}});assert.equal(document.activeElement,f.close);
 f.close.listeners.click();assert.equal(f.dialog.open,false);assert.equal(f.classes.size,0);assert.equal(document.activeElement,f.links[0]);
});

test('More Work switches all details in place and closing restores the original external opener',t=>{
  const f=fixture(t,{count:1,navigation:false});
  assert.equal(click(f.links[1]),true);assert.equal(f.title.textContent,projects[1].title);assert.equal(f.featured.hidden,true);
  for(const index of [0,2,1,2,0,1]){
    f.dialog.scrollTop=300;
    assert.equal(click(f.switches[index]),true);
    assert.equal(f.dialog.open,true);assert.equal(f.dialog.opens,1);
    assert.equal(f.title.textContent,projects[index].title);assert.equal(f.thumb.src,f.panels[index].image.src);
    assert.equal(f.featured.hidden,index!==0);assert.equal(f.panels[index].hidden,false);f.panels.forEach((panel,i)=>assert.equal(panel.hidden,i!==index));
    assert.equal(f.dialog.scrollTop,0);assert.equal(document.activeElement,f.close);
    assert.equal(f.panels[index].rail.scrollLeft,0);
  }
  assert.equal(click(f.switches[0],{ctrlKey:true}),false);assert.equal(f.title.textContent,projects[1].title);
  f.close.listeners.click();assert.equal(document.activeElement,f.links[1]);assert.equal(f.classes.size,0);
});

test('horizontal recommendations remain in the dialog focus order without consuming rail arrow keys',t=>{
  const f=fixture(t);click(f.links[0]);
  let selector;
  const original=f.dialog.querySelectorAll;
  f.dialog.querySelectorAll=s=>{selector=s;return original(s);};
  f.close.focus();f.dialog.listeners.keydown({key:'Tab',shiftKey:true,preventDefault(){}});
  assert.ok(selector.includes('[tabindex="0"]'));
  const before=f.panels[0].counter.textContent;
  let prevented=false;
  f.dialog.listeners.keydown({key:'ArrowRight',target:{closest:s=>s==='[data-more-work-track]'?f.panels[0].rail:null},preventDefault(){prevented=true;}});
  assert.equal(prevented,false);assert.equal(f.panels[0].counter.textContent,before);
});

function wheel(rail,overrides={}){
  let prevented=false;
  assert.equal(typeof rail.listeners.wheel,'function');
  rail.listeners.wheel({deltaX:0,deltaY:120,deltaMode:0,cancelable:true,preventDefault(){prevented=true;},...overrides});
  return prevented;
}

test('mouse wheel scrolls every recommendation track in both directions and releases at its boundaries',t=>{
  const f=fixture(t);
  for(const {rail} of f.panels){
    assert.deepEqual(rail.listenerOptions.wheel,{passive:false});
    rail.scrollLeft=0;assert.equal(wheel(rail),true);assert.equal(rail.scrollLeft,120);
    assert.equal(wheel(rail,{deltaY:-40}),true);assert.equal(rail.scrollLeft,80);
    assert.equal(wheel(rail,{deltaY:-200}),true);assert.equal(rail.scrollLeft,0);
    assert.equal(wheel(rail,{deltaY:-120}),false);assert.equal(rail.scrollLeft,0);
    rail.scrollLeft=880;assert.equal(wheel(rail),true);assert.equal(rail.scrollLeft,900);
    assert.equal(wheel(rail),false);assert.equal(rail.scrollLeft,900);
    rail.scrollLeft=899.75;assert.equal(wheel(rail),false);assert.equal(rail.scrollLeft,899.75);
    rail.scrollLeft=.25;assert.equal(wheel(rail,{deltaY:-120}),false);assert.equal(rail.scrollLeft,.25);
    rail.scrollWidth=rail.clientWidth;rail.scrollLeft=0;
    assert.equal(wheel(rail),false);assert.equal(rail.scrollLeft,0);
  }
});

test('mouse wheel normalizes line and page deltas and keeps small movements responsive',t=>{
  const {rail}=fixture(t).panels[0];rail.scrollLeft=0;
  assert.equal(wheel(rail,{deltaY:3,deltaMode:1}),true);assert.equal(rail.scrollLeft,48);
  assert.equal(wheel(rail,{deltaY:1,deltaMode:2}),true);assert.equal(rail.scrollLeft,648);
  assert.equal(wheel(rail,{deltaY:-1,deltaMode:2}),true);assert.equal(rail.scrollLeft,48);
  assert.equal(wheel(rail,{deltaY:.5}),true);assert.equal(rail.scrollLeft,48.5);
});

test('wheel preserves native horizontal gestures, modifiers and noncancelable events',t=>{
  const {rail}=fixture(t).panels[0];
  for(const input of [{deltaX:150},{deltaX:-150},{deltaX:120},{deltaY:0},{ctrlKey:true},{metaKey:true},{shiftKey:true},{cancelable:false}]){
    rail.scrollLeft=100;assert.equal(wheel(rail,input),false);assert.equal(rail.scrollLeft,100);
  }
});

test('recommendations use the full available width without scroll snapping',async()=>{
  const css=await readFile(new URL('../assets/redesign.css',import.meta.url),'utf8');
  const track=css.match(/\.more-work-grid\{([^}]*)\}/)[1];
  assert.doesNotMatch(track,/max-width|scroll-snap/);
  assert.match(track,/grid-auto-flow:column/);assert.match(track,/overflow-x:auto/);
});

test('More Work arrows move one card plus gap and keep focus stable at a boundary',t=>{
  const f=fixture(t);click(f.links[0]);const {rail,morePrev,moreNext}=f.panels[0];
  assert.equal(morePrev.attributes['aria-disabled'],'true');assert.equal(moreNext.attributes['aria-disabled'],'false');
  click(moreNext);assert.deepEqual(rail.lastScroll,{left:314,behavior:'smooth'});assert.equal(rail.scrollLeft,314);
  click(morePrev);assert.deepEqual(rail.lastScroll,{left:-314,behavior:'smooth'});assert.equal(rail.scrollLeft,0);
  delete rail.lastScroll;click(morePrev);assert.equal(rail.lastScroll,undefined);
  rail.scrollLeft=880;rail.listeners.scroll();moreNext.focus();click(moreNext);
  assert.equal(rail.scrollLeft,900);assert.equal(moreNext.attributes['aria-disabled'],'true');assert.equal(document.activeElement,moreNext);
  delete rail.lastScroll;click(moreNext);assert.equal(rail.lastScroll,undefined);
});

test('More Work arrow states follow native scroll, fractional edges and resizing',t=>{
  const f=fixture(t);click(f.links[0]);const {rail,morePrev,moreNext}=f.panels[0];
  rail.scrollLeft=899.75;rail.listeners.scroll();assert.equal(moreNext.attributes['aria-disabled'],'true');
  rail.scrollLeft=.25;rail.listeners.scroll();assert.equal(morePrev.attributes['aria-disabled'],'true');
  moreNext.focus();rail.clientWidth=1500;rail.onResize();
  assert.equal(morePrev.hidden,true);assert.equal(moreNext.hidden,true);assert.equal(document.activeElement,rail);
  rail.clientWidth=600;rail.onResize();assert.equal(morePrev.hidden,false);assert.equal(moreNext.hidden,false);
});

test('More Work arrows refresh immediately when switching and reopening projects',t=>{
  const f=fixture(t);click(f.links[0]);const p=f.panels[1];
  p.rail.scrollLeft=900;p.rail.listeners.scroll();assert.equal(p.moreNext.attributes['aria-disabled'],'true');
  click(f.switches[1]);assert.equal(p.rail.scrollLeft,0);assert.equal(p.morePrev.attributes['aria-disabled'],'true');assert.equal(p.moreNext.attributes['aria-disabled'],'false');
  f.close.listeners.click();p.rail.scrollLeft=900;click(f.links[1]);assert.equal(p.moreNext.attributes['aria-disabled'],'false');
});

test('More Work arrows use immediate movement under reduced motion',t=>{
  const f=fixture(t);click(f.links[0]);document.documentElement.dataset.motion='reduced';
  click(f.panels[0].moreNext);assert.deepEqual(f.panels[0].rail.lastScroll,{left:314,behavior:'instant'});
});

test('reopening resets saved scroll after the dialog becomes visible',t=>{
  const f=fixture(t,{count:1,navigation:false});let scroll=320;
  Object.defineProperty(f.dialog,'scrollTop',{get:()=>scroll,set:value=>{if(f.dialog.open)scroll=value;}});
  click(f.links[0]);assert.equal(scroll,0);
  scroll=320;f.close.listeners.click();click(f.links[1]);assert.equal(scroll,0);
});

test('public image descriptions explain the projects and STI live links use the requested domain',()=>{
  for(const page of renderPages({profile,projects,technologies})){
    assert.doesNotMatch(page.content,/Owner-Supplied Mockup|owner-supplied presentation|QR payload|device perspectives|not an unmodified|sti-vio-log\.vercel\.app|>Live Preview<|>Live App<|>Open Live Platform</i);
    for(const match of page.content.matchAll(/<a[^>]*href="https:\/\/stiviolog\.com\/"[^>]*>([\s\S]*?)<\/a>/g))assert.match(match[1],/^Live Site/);
  }
  assert.equal(projects[0].liveUrl,'https://stiviolog.com/');
  assert.deepEqual(projects.map(p=>p.previewScreens[0].caption),[
    'Student violation records, QR-based community-service attendance, and clearance tracking in one platform.',
    'An interactive client website combining Toyota heritage storytelling, a searchable vehicle catalogue, and side-by-side comparison.',
    'A private digital chronicle for photographs, people, places, and the stories behind everyday moments.',
    'An Android application for learning Philippine history through interactive quizzes, story-based lessons, and saved progress.'
  ]);
});

test('backdrop dismissal closes only outside the dialog and restores the opener',t=>{
  const f=fixture(t);click(f.links[0]);f.dialog.listeners.click({target:f.dialog,clientX:40,clientY:40});assert.equal(f.dialog.open,true);
  f.dialog.listeners.click({target:f.dialog,clientX:0,clientY:0});assert.equal(f.dialog.open,false);assert.equal(document.activeElement,f.links[0]);
});

test('single STI image opens without navigation controls and retains close/focus behavior',t=>{
  const f=fixture(t,{count:1,navigation:false});
  assert.equal(click(f.links[0]),true);assert.equal(f.dialog.open,true);assert.equal(f.panels[0].slides[0].hidden,false);
  let prevented=false;f.dialog.listeners.keydown({key:'ArrowRight',preventDefault(){prevented=true;}});assert.equal(prevented,false);
  f.close.listeners.click();assert.equal(f.dialog.open,false);assert.equal(document.activeElement,f.links[0]);
});
test('unsupported or throwing dialogs leave native image navigation and scrolling available',async t=>{
  for(const options of [{supported:false},{throws:true}])await t.test(JSON.stringify(options),t=>{const f=fixture(t,options);assert.equal(click(f.links[0]),false);assert.equal(f.dialog.open,false);assert.equal(f.classes.size,0);});
});
