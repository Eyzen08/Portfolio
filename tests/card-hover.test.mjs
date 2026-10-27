import test from 'node:test';
import assert from 'node:assert/strict';
import { initMotion } from '../assets/motion.js';

function fixture(t,{fine=true,reduced=false,manualReduced=false,onlyMagnet=false}={}){
  const keys=['document','window','matchMedia','IntersectionObserver','requestAnimationFrame','cancelAnimationFrame'];
  const saved=new Map(keys.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  const events={},windowEvents={},frames=new Map(),media={};let nextFrame=1,cleanup;
  const add=(store,type,fn)=>{
    if(!store[type]){const listeners=[];store[type]=event=>[...listeners].forEach(listener=>listener(event));store[type].listeners=listeners;}
    store[type].listeners.push(fn);
  };
  const remove=(store,type,fn)=>{if(store[type]){const listeners=store[type].listeners,index=listeners.indexOf(fn);if(index>=0)listeners.splice(index,1);if(!listeners.length)delete store[type];}};
  const node=(parent=null,excluded=false)=>({dataset:{},parent,values:new Map(),reads:0,matches:selector=>selector.includes('.next-step-grid>article')?!excluded:excluded,
    closest(selector){if(selector==='[data-magnetic]')return this.dataset.magnetic!==undefined?this:null;return this.dataset.cardHover!==undefined?this:this.parent?.closest()||null;},
    contains(other){return other===this||other?.parent===this;},
    getBoundingClientRect(){this.reads++;return {left:20,top:30,width:300,height:200,bottom:230};},
    style:{setProperty(key,value){this.owner.values.set(key,value);},removeProperty(key){this.owner.values.delete(key);}}});
  const outer=node(),inner=node(outer),excluded=node(null,true);
  for(const card of [outer,inner,excluded])card.style.owner=card;
  const keyboard={closest:()=>inner,matches:()=>true};
  globalThis.document={documentElement:{dataset:{motion:manualReduced?'reduced':'full'}},hidden:false,querySelector:()=>null,querySelectorAll:s=>s.startsWith('.card,')?(onlyMagnet?[]:[outer,inner,excluded]):s.startsWith('.hero-copy .button')&&onlyMagnet?[outer]:[],
    addEventListener(type,fn){add(events,type,fn);},removeEventListener(type,fn){remove(events,type,fn);}};
  globalThis.window={innerHeight:900,addEventListener(type,fn){add(windowEvents,type,fn);},removeEventListener(type,fn){remove(windowEvents,type,fn);}};
  globalThis.matchMedia=query=>media[query]??=( {matches:query.includes('prefers-reduced-motion')?reduced:fine,addEventListener(type,fn){add(this,'change',fn);},removeEventListener(type,fn){remove(this,'change',fn);}} );
  globalThis.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
  globalThis.requestAnimationFrame=fn=>{const id=nextFrame++;frames.set(id,fn);return id;};
  globalThis.cancelAnimationFrame=id=>frames.delete(id);
  t.after(()=>{cleanup?.();keys.forEach(key=>saved.get(key)?Object.defineProperty(globalThis,key,saved.get(key)):delete globalThis[key]);});
  return {outer,inner,excluded,keyboard,events,windowEvents,media,frames,start(){cleanup=initMotion();},stop(){cleanup();},flush(){for(const [id,fn] of [...frames]){frames.delete(id);fn();}},move(target=outer,x=90,y=110,pointerType='mouse'){events.pointermove({target,clientX:x,clientY:y,pointerType});}};
}

test('card hover tracks only the nearest card and batches coordinates once per frame',t=>{
  const f=fixture(t);f.start();
  assert.equal(f.outer.dataset.cardHover,'');assert.equal(f.excluded.dataset.cardHover,undefined);
  f.move();f.move(f.outer,120,140);assert.equal(f.frames.size,1);assert.equal(f.outer.values.size,0);
  f.flush();assert.equal(f.outer.values.get('--card-x'),'100px');assert.equal(f.outer.values.get('--card-y'),'110px');assert.equal(f.frames.size,0);
  assert.equal(f.outer.values.get('--card-rx'),'-0.40deg');assert.equal(f.outer.values.get('--card-ry'),'-1.67deg');
  const reads=f.outer.reads;f.move();f.flush();assert.equal(f.outer.reads,reads,'Pointer updates reuse entry geometry');
  f.move(f.outer,-1000,2000);f.flush();
  assert.equal(f.outer.values.get('--card-rx'),'-4.00deg');assert.equal(f.outer.values.get('--card-ry'),'-5.00deg');
  f.move(f.inner);assert.equal(f.outer.dataset.cardActive,undefined);assert.equal(f.inner.dataset.cardActive,'true');
  assert.equal(f.outer.values.has('--card-rx'),false,'Leaving clears the tilt destination for a smooth return');
  f.events.pointerout({relatedTarget:null});assert.equal(f.inner.dataset.cardActive,undefined);assert.equal(f.frames.size,0);
});

test('selected CTA magnetism also works on routes without hover cards',t=>{
  const f=fixture(t,{onlyMagnet:true});f.start();f.move();assert.equal(f.frames.size,1);f.flush();
  assert.ok(f.outer.values.has('--magnet-x'));assert.ok(f.outer.values.has('--magnet-y'));
  f.events.pointerout({relatedTarget:null});assert.equal(f.outer.values.has('--magnet-x'),false);
});

test('card hover ignores touch and coarse pointers while manual reduced motion keeps a static highlight',async t=>{
  for(const options of [{fine:false},{manualReduced:true},{}])await t.test(JSON.stringify(options),t=>{
    const f=fixture(t,options);f.start();f.move(f.outer,90,110,options.fine===false||options.manualReduced?'mouse':'touch');
    assert.equal(f.frames.size,0);assert.equal(f.outer.values.size,0);
    assert.equal(f.outer.dataset.cardActive,options.manualReduced?'true':undefined);
  });
});

test('OS reduced-motion does not override full motion and manual changes reset pending effects',t=>{
  const f=fixture(t,{reduced:true});f.start();f.move();assert.equal(f.frames.size,1);f.flush();
  assert.ok(f.outer.values.has('--card-rx'));
  document.documentElement.dataset.motion='reduced';f.events.motionchange();
  assert.equal(f.outer.dataset.cardActive,undefined);assert.equal(f.outer.values.has('--card-rx'),false);
  f.move();assert.equal(f.frames.size,0);assert.equal(f.outer.dataset.cardActive,'true');
});

test('card hover resets on cancellation, hidden page, pointer capability changes and teardown',t=>{
  const f=fixture(t);f.start();
  for(const reset of [()=>f.events.pointercancel(),()=>{document.hidden=true;f.events.visibilitychange();document.hidden=false;},()=>f.windowEvents.blur(),()=>f.windowEvents.pagehide({persisted:true}),()=>Object.values(f.media)[0].change()]){
    f.move();reset();assert.equal(f.outer.dataset.cardActive,undefined);assert.equal(f.frames.size,0);
  }
  f.events.focusin({type:'focusin',target:f.keyboard});assert.equal(f.inner.dataset.cardFocus,'true');assert.equal(f.outer.dataset.cardFocus,undefined);
  f.events.focusout({type:'focusout',relatedTarget:null});assert.equal(f.inner.dataset.cardFocus,undefined);
  f.move();f.stop();assert.equal(f.outer.dataset.cardHover,undefined);assert.equal(f.frames.size,0);assert.equal(f.events.pointermove,undefined);
});
