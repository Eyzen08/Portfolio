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
test('project views omit full-image links and popups recommend the other project once',()=>{
  const pages=renderPages({profile,projects,technologies});
  for(const page of pages)assert.doesNotMatch(page.content,/View Full Image|class="(?:picture-image-links|preview-full-image)"/);
  for(const route of ['/','/projects/']){
    const html=pages.find(page=>page.route===route).content;
    for(const project of projects){
      const dialog=html.match(new RegExp(`<section data-project-panel="${project.id}"[\\s\\S]*?</section>`))[0];
      const other=projects.find(other=>other.id!==project.id);
      assert.equal((dialog.match(/class="project-more-work"/g)||[]).length,1);
      assert.equal((dialog.match(/class="more-project"/g)||[]).length,1);
      const footer=dialog.match(/<footer class="project-more-work">[\s\S]*?<\/footer>/)[0];
      assert.match(footer,/>Up Next</);assert.match(footer,/>More Work</);
      assert.ok(footer.includes(`href="${other.previewScreens[0].src}"`));
      assert.ok(footer.includes(`data-details-open data-project-id="${other.id}"`));
      assert.ok(footer.includes(`src="${other.previewScreens[0].srcSmall}"`));
      assert.ok(!footer.includes(`href="/projects/${project.id}/"`));
      assert.ok(html.includes(`class="project-screenshot-link" href="${project.previewScreens[0].src}"`));
    }
  }
  for(const project of projects){
    const html=pages.find(page=>page.route===`/projects/${project.id}/`).content;
    const other=projects.find(other=>other.id!==project.id);
    assert.doesNotMatch(html,/class="project-more-work"/);
    assert.ok(html.includes(`href="/projects/${other.id}/">Next Case Study`));
  }
});
function element(dataset={}){return {dataset,hidden:false,listeners:{},attributes:{},style:{},textContent:'',addEventListener(k,fn){this.listeners[k]=fn;},setAttribute(k,v){this.attributes[k]=v;},focus(){document.activeElement=this;this.focuses=(this.focuses||0)+1;},closest(){return null;}};}
function fixture(t,{supported=true,throws=false,count=4,navigation=true}={}){
  const original=Object.getOwnPropertyDescriptor(globalThis,'document');t.after(()=>original?Object.defineProperty(globalThis,'document',original):delete globalThis.document);
  const close=element(),title=element(),thumb=element(),featured=element();
  const panels=projects.map(({id},i)=>{
    const p=element({projectPanel:id,projectTitle:projects[i].title,projectFeatured:String(i===0)});
    p.slides=Array.from({length:count},()=>element());p.buttons=navigation?p.slides.map((_,j)=>element({previewIndex:String(j)})):[];p.counter=navigation?element():null;p.previous=navigation?element():null;p.next=navigation?element():null;p.image={src:`/${id}.webp`};
    p.querySelectorAll=s=>s==='[data-preview-slide]'?p.slides:p.buttons;
    p.querySelector=s=>({'[data-preview-count]':p.counter,'[data-preview-prev]':p.previous,'[data-preview-next]':p.next,'.preview-image':p.image}[s]);return p;
  });
  const links=panels.map(p=>element({projectId:p.dataset.projectPanel}));const switches=panels.map(p=>element({projectId:p.dataset.projectPanel}));
  const last=element();const classes=new Set();
  const dialog=Object.assign(element(),{open:false,scrollTop:44,querySelector:s=>({'[data-project-title]':title,'[data-project-thumbnail]':thumb,'[data-project-featured]':featured,'[data-preview-close]':close}[s]),querySelectorAll:s=>s==='[data-project-panel]'?panels:s==='[data-project-switch]'?switches:[close,last],getBoundingClientRect:()=>({left:10,top:10,right:500,bottom:500}),close(){this.open=false;this.listeners.close();}});
  if(supported)dialog.showModal=function(){if(throws)throw Error('unavailable');this.open=true;this.opens=(this.opens||0)+1;};
  globalThis.document={activeElement:null,querySelector:()=>dialog,querySelectorAll:s=>s==='[data-details-open]'?[...links,...switches]:[],documentElement:{classList:{add:s=>classes.add(s),remove:s=>classes.delete(s)}}};
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

test('More Work switches both details in place and closing restores the original external opener',t=>{
  const f=fixture(t,{count:1,navigation:false});
  assert.equal(click(f.links[1]),true);assert.equal(f.title.textContent,'Kwiztorya');assert.equal(f.featured.hidden,true);
  for(const index of [0,1,0,1]){
    f.dialog.scrollTop=300;
    assert.equal(click(f.switches[index]),true);
    assert.equal(f.dialog.open,true);assert.equal(f.dialog.opens,1);
    assert.equal(f.title.textContent,projects[index].title);assert.equal(f.thumb.src,f.panels[index].image.src);
    assert.equal(f.featured.hidden,index!==0);assert.equal(f.panels[index].hidden,false);assert.equal(f.panels[1-index].hidden,true);
    assert.equal(f.dialog.scrollTop,0);assert.equal(document.activeElement,f.close);
  }
  assert.equal(click(f.switches[0],{ctrlKey:true}),false);assert.equal(f.title.textContent,'Kwiztorya');
  f.close.listeners.click();assert.equal(document.activeElement,f.links[1]);assert.equal(f.classes.size,0);
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
