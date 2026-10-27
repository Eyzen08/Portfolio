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
    assert.doesNotMatch(rows[0],/<dialog/);assert.match(rows[0],/aria-controls="project-details-viewer"/);assert.match(rows[1],/id="preview-kwiztorya"/);
    assert.ok(html.indexOf('data-project-viewer')>html.lastIndexOf('</article>'));
    assert.ok(html.includes('data-project-panel="sti-vio-log"'));assert.ok(!html.includes('data-project-panel="kwiztorya"'));assert.match(html,/More Work/);assert.doesNotMatch(html,/data-project-switch/);
    assert.equal((html.match(/>Live Preview</g)||[]).length,1);
    assert.match(html,/preview-ambient/);assert.match(html,/Close Project Details/);
  }
});
test('project views omit full-image links and popups recommend the other project once',()=>{
  const pages=renderPages({profile,projects,technologies});
  for(const page of pages)assert.doesNotMatch(page.content,/View Full Image|class="(?:picture-image-links|preview-full-image)"/);
  for(const route of ['/','/projects/']){
    const html=pages.find(page=>page.route===route).content;
    for(const project of projects){
      const id=project.id==='sti-vio-log'?'project-details-viewer':'preview-kwiztorya';
      const dialog=[...html.matchAll(/<dialog[\s\S]*?<\/dialog>/g)].map(match=>match[0]).find(dialog=>dialog.includes(`id="${id}"`));
      const other=projects.find(other=>other.id!==project.id);
      assert.equal((dialog.match(/class="project-more-work"/g)||[]).length,1);
      assert.equal((dialog.match(/class="more-project"/g)||[]).length,1);
      const footer=dialog.match(/<footer class="project-more-work">[\s\S]*?<\/footer>/)[0];
      assert.match(footer,/>Up Next</);assert.match(footer,/>\/More Work</);
      assert.ok(footer.includes(`href="/projects/${other.id}/"`));
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
  const panels=['sti-vio-log'].map((id,i)=>{
    const p=element({projectPanel:id,projectTitle:projects[i].title,projectFeatured:String(i===0)});
    p.slides=Array.from({length:count},()=>element());p.buttons=navigation?p.slides.map((_,j)=>element({previewIndex:String(j)})):[];p.counter=navigation?element():null;p.previous=navigation?element():null;p.next=navigation?element():null;p.image={src:`/${id}.webp`};
    p.querySelectorAll=s=>s==='[data-preview-slide]'?p.slides:p.buttons;
    p.querySelector=s=>({'[data-preview-count]':p.counter,'[data-preview-prev]':p.previous,'[data-preview-next]':p.next,'.preview-image':p.image}[s]);return p;
  });
  const links=panels.map(p=>element({projectId:p.dataset.projectPanel}));const switches=panels.map(p=>element({projectSwitch:p.dataset.projectPanel}));
  const last=element();const classes=new Set();
  const dialog=Object.assign(element(),{open:false,scrollTop:44,querySelector:s=>({'[data-project-title]':title,'[data-project-thumbnail]':thumb,'[data-project-featured]':featured,'[data-preview-close]':close}[s]),querySelectorAll:s=>s==='[data-project-panel]'?panels:s==='[data-project-switch]'?switches:[close,last],getBoundingClientRect:()=>({left:10,top:10,right:500,bottom:500}),close(){this.open=false;this.listeners.close();}});
  if(supported)dialog.showModal=function(){if(throws)throw Error('unavailable');this.open=true;};
  globalThis.document={activeElement:null,querySelector:()=>dialog,querySelectorAll:s=>s==='[data-details-open]'?links:[],documentElement:{classList:{add:s=>classes.add(s),remove:s=>classes.delete(s)}}};
  initProjectPreviews();return {dialog,panels,links,switches,close,last,title,featured,classes};
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
