import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPages } from '../scripts/templates.mjs';

test('About has its longer introduction and both portraits without changing shared copy', async()=>{
  const [profile,projects,technologies]=await Promise.all(['profile','projects','technologies'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url)))));
  const pages=renderPages({profile,projects,technologies});
  const about=pages.find(page=>page.route==='/about/').content;
  assert.equal(profile.aboutIntroHeading,'Building Ideas with Code, Creativity, and AI.');
  assert.ok(profile.aboutIntroText.includes('continuously strengthening my own technical knowledge'));
  const intro=about.slice(about.indexOf('class="about-intro"'),about.indexOf('<h2>How I Work</h2>'));
  for(const text of [profile.aboutIntroHeading,profile.aboutIntroText,profile.goal,profile.workWithMe,profile.portrait,profile.heroPortrait.src]) assert.ok(intro.includes(text),text);
  assert.ok(intro.includes('data-portrait-swap'));
  assert.ok(intro.includes('aria-pressed="false"'));
  assert.ok(intro.includes('type="button"'));
  assert.ok(!intro.includes('hero-formal-portrait'),'About photo does not inherit the hero fade');
  for(const route of ['/','/contact/']) assert.ok(!pages.find(page=>page.route===route).content.includes(profile.aboutIntroText));
});

test('About portrait supports hover, button toggles, delayed loading and failure fallback', async t=>{
  const names=['document','matchMedia','localStorage'];
  const original=new Map(names.map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));
  t.after(()=>names.forEach(name=>original.get(name)?Object.defineProperty(globalThis,name,original.get(name)):delete globalThis[name]));
  for(const loaded of [true,false]) await t.test(loaded?'already loaded':'loads after hover',async()=>{
    const imageEvents={},buttonEvents={},attributes={'aria-pressed':'false'};
    const image={naturalWidth:loaded?1024:0,addEventListener(type,fn){imageEvents[type]=fn;}};
    const button={disabled:true,querySelector:()=>image,setAttribute:(key,value)=>attributes[key]=value,getAttribute:key=>attributes[key],addEventListener(type,fn){buttonEvents[type]=fn;}};
    globalThis.document={documentElement:{dataset:{}},querySelector:s=>s==='[data-portrait-swap]'?button:null,querySelectorAll:()=>[],addEventListener(){}};
    globalThis.matchMedia=()=>({matches:false,addEventListener(){}});
    globalThis.localStorage={getItem:()=>null};
    await import(`../assets/app.js?about-portrait-${loaded}`);
    assert.equal(typeof buttonEvents.pointerenter,'function');
    assert.equal(attributes['aria-pressed'],'false');
    assert.equal(button.disabled,!loaded);
    buttonEvents.pointerenter({pointerType:'mouse'});
    if(!loaded){assert.equal(attributes['aria-pressed'],'false');image.naturalWidth=1024;imageEvents.load();}
    assert.equal(attributes['aria-pressed'],'true');
    assert.equal(button.disabled,false);
    for(let i=0;i<2;i++){
      buttonEvents.pointerleave({pointerType:'mouse'});assert.equal(attributes['aria-pressed'],'false');
      buttonEvents.pointerenter({pointerType:'mouse'});assert.equal(attributes['aria-pressed'],'true');
    }
    buttonEvents.pointerleave({pointerType:'mouse'});
    buttonEvents.pointerenter({pointerType:'touch'});assert.equal(attributes['aria-pressed'],'false');
    buttonEvents.click();assert.equal(attributes['aria-pressed'],'true');
    buttonEvents.pointerleave({pointerType:'touch'});assert.equal(attributes['aria-pressed'],'true');
    buttonEvents.click();assert.equal(attributes['aria-pressed'],'false');
    buttonEvents.click();assert.equal(attributes['aria-pressed'],'true');
    imageEvents.error();assert.equal(attributes['aria-pressed'],'false');assert.equal(button.disabled,true);
    buttonEvents.pointerenter({pointerType:'mouse'});assert.equal(attributes['aria-pressed'],'false');
  });
});
