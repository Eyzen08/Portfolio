import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderPages} from '../scripts/templates.mjs';
const [profile,projects,technologies]=await Promise.all(['profile','projects','technologies'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url)))));
const pages=renderPages({profile,projects,technologies});

test('Home and Training use image-first previews with all original documents retained',()=>{
  for(const route of ['/','/training/']){
    const html=pages.find(page=>page.route===route).content;
    assert.equal((html.match(/data-certificate-open/g)||[]).length,7);
    assert.equal((html.match(/data-certificate-viewer/g)||[]).length,1);
    for(const item of profile.certifications){
      assert.ok(html.includes(`href="${item.preview.src}"`));
      assert.ok(html.includes(`href="${item.documentUrl}"`));
    }
    assert.doesNotMatch(html,/<(?:iframe|embed|object)\b/);
    assert.match(html,/data-certificate-original/);
  }
});

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

function node(extra={}){return {hidden:false,dataset:{},listeners:{},attrs:{},textContent:'',addEventListener(type,fn){this.listeners[type]=fn;},setAttribute(key,value){this.attrs[key]=value;},getAttribute(key){return this.attrs[key];},...extra};}
function fixture(t,{supported=true,throws=false}={}){
  const saved=Object.getOwnPropertyDescriptor(globalThis,'document');
  t.after(()=>saved?Object.defineProperty(globalThis,'document',saved):delete globalThis.document);
  const image=node(),title=node(),original=node(),close=node(),error=node();
  const parts={'[data-certificate-image]':image,'[data-certificate-title]':title,'[data-certificate-document]':original,'[data-certificate-close]':close,'[data-certificate-error]':error};
  const dialog=node({open:false,querySelector:key=>parts[key],getBoundingClientRect:()=>({left:100,right:800,top:100,bottom:700}),showModal:supported?function(){if(throws)throw Error('Unavailable');this.open=true;}:undefined,close(){this.open=false;this.listeners.close();}});
  const entries=profile.certifications.map(item=>{
    const thumbnail={alt:item.preview.alt,width:item.preview.width,height:item.preview.height,getAttribute:()=>item.preview.src};
    const fallback=node({href:item.documentUrl,dataset:{documentKind:item.documentUrl.endsWith('.pdf')?'PDF':'Image'}});
    const link=node({dataset:{certificateTitle:item.title},querySelector:()=>thumbnail,closest:()=>({querySelector:()=>fallback}),focuses:0,focus(){this.focuses++;}});
    return {link,fallback,item};
  });
  const classes=new Set();globalThis.document={querySelector:()=>dialog,querySelectorAll:()=>entries.map(e=>e.link),documentElement:{classList:{add:name=>classes.add(name),remove:name=>classes.delete(name)}}};
  return {dialog,image,title,original,close,error,entries,classes};
}

test('certificate viewer selects images, preserves original destinations and restores focus/scroll',async t=>{
  const f=fixture(t);const {initCertificatePreviews}=await import('../assets/decks.js');
  assert.equal(typeof initCertificatePreviews,'function');initCertificatePreviews();
  let prevented=0;
  for(const {link,fallback,item} of f.entries){
    const event={button:0,currentTarget:link,preventDefault(){prevented++;}};
    link.listeners.click({...event,ctrlKey:true});assert.equal(f.dialog.open,false);
    assert.equal(fallback.hidden,true);
    link.listeners.click(event);assert.equal(f.dialog.open,true);assert.ok(f.classes.has('preview-open'));
    assert.equal(f.image.src,item.preview.src);assert.equal(f.image.alt,item.preview.alt);
    assert.equal(f.title.textContent,item.title);assert.equal(f.original.href,item.documentUrl);
    f.dialog.listeners.click({target:f.dialog,clientX:150,clientY:150});assert.equal(f.dialog.open,true,'Clicking dialog padding is not a backdrop click');
    f.dialog.listeners.click({target:f.dialog,clientX:10,clientY:10});assert.equal(f.dialog.open,false);
    assert.equal(f.classes.size,0);assert.equal(link.focuses,1);
  }
  assert.equal(prevented,7);
  const {link}=f.entries[0];link.listeners.click({button:0,currentTarget:link,preventDefault(){}});
  let focused,tabPrevented=0;
  f.close.focus=()=>{focused=f.close;};f.original.focus=()=>{focused=f.original;};
  document.activeElement=f.original;f.dialog.listeners.keydown({key:'Tab',shiftKey:false,preventDefault(){tabPrevented++;}});assert.equal(focused,f.close);
  document.activeElement=f.close;f.dialog.listeners.keydown({key:'Tab',shiftKey:true,preventDefault(){tabPrevented++;}});assert.equal(focused,f.original);assert.equal(tabPrevented,2);
  f.image.listeners.error();assert.equal(f.error.hidden,false);assert.equal(f.image.hidden,true);
  f.close.listeners.click();assert.equal(f.dialog.open,false);assert.equal(link.focuses,2);
});

test('unsupported or failed dialogs preserve native image and original-document fallback',async t=>{
  for(const options of [{supported:false},{throws:true}])await t.test(JSON.stringify(options),async t=>{
    const f=fixture(t,options);const {initCertificatePreviews}=await import('../assets/decks.js');initCertificatePreviews();
    const {link,fallback}=f.entries[0];let prevented=false;
    link.listeners.click?.({button:0,currentTarget:link,preventDefault(){prevented=true;}});
    assert.equal(prevented,false);assert.equal(fallback.hidden,false);assert.equal(f.classes.size,0);
  });
});
