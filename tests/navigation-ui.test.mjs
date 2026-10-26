import test from 'node:test';
import assert from 'node:assert/strict';

test('mobile navigation manages inert state, outside clicks, Escape and desktop resize',async t=>{
  const keys=['document','matchMedia','localStorage'];
  const saved=new Map(keys.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  t.after(()=>keys.forEach(key=>saved.get(key)?Object.defineProperty(globalThis,key,saved.get(key)):delete globalThis[key]));
  const events={},buttonEvents={},menuEvents={},mediaEvents={};let phone=true,focuses=0;
  const menu={dataset:{},contains:node=>node===menu,addEventListener(type,fn){menuEvents[type]=fn;}};
  const button={hidden:true,setAttribute(){},contains:node=>node===button,addEventListener(type,fn){buttonEvents[type]=fn;},focus(){focuses++;}};
  globalThis.document={documentElement:{dataset:{}},querySelector:selector=>selector==='[data-menu]'?menu:selector==='[data-menu-button]'?button:null,querySelectorAll:()=>[],addEventListener(type,fn){events[type]=fn;}};
  globalThis.matchMedia=query=>({matches:query.includes('max-width')&&phone,addEventListener(type,fn){mediaEvents[query]=fn;}});
  globalThis.localStorage={getItem:()=>null};
  await import('../assets/app.js?navigation-regression');
  assert.equal(menu.inert,true);assert.equal(menu.dataset.open,'false');
  buttonEvents.click();assert.equal(menu.dataset.open,'true');assert.equal(menu.inert,false);
  events.pointerdown({target:menu});assert.equal(menu.dataset.open,'true');
  events.pointerdown({target:{}});assert.equal(menu.dataset.open,'false');assert.equal(menu.inert,true);
  buttonEvents.click();events.keydown({key:'Escape'});assert.equal(focuses,1);assert.equal(menu.inert,true);
  phone=false;mediaEvents['(min-width: 1024px)']();assert.equal(menu.inert,false,'Desktop page links must remain available');
});
