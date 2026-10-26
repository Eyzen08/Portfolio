import test from 'node:test';
import assert from 'node:assert/strict';
import { initMotion } from '../assets/motion.js';

function fixture(t,{fine=true,reduced=false}={}){
  const keys=['document','window','matchMedia','IntersectionObserver','requestAnimationFrame','cancelAnimationFrame'];
  const saved=new Map(keys.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  const events={},windowEvents={},frames=new Map(),media={};let nextFrame=1,cleanup;
  const add=(store,type,fn)=>{
    if(!store[type]){const listeners=[];store[type]=event=>[...listeners].forEach(listener=>listener(event));store[type].listeners=listeners;}
    store[type].listeners.push(fn);
  };
  const remove=(store,type,fn)=>{if(store[type]){const listeners=store[type].listeners,index=listeners.indexOf(fn);if(index>=0)listeners.splice(index,1);if(!listeners.length)delete store[type];}};
  const node=(parent=null,excluded=false)=>({dataset:{},parent,values:new Map(),matches:()=>excluded,
    closest(){return this.dataset.cardHover!==undefined?this:this.parent?.closest()||null;},
    contains(other){return other===this||other?.parent===this;},
    getBoundingClientRect:()=>({left:20,top:30,width:300,height:200,bottom:230}),
    style:{setProperty(key,value){this.owner.values.set(key,value);},removeProperty(key){this.owner.values.delete(key);}}});
  const outer=node(),inner=node(outer),excluded=node(null,true);
  for(const card of [outer,inner,excluded])card.style.owner=card;
  const keyboard={closest:()=>inner,matches:()=>true};
  globalThis.document={hidden:false,querySelector:()=>null,querySelectorAll:s=>s.startsWith('.card,')?[outer,inner,excluded]:[],
    addEventListener(type,fn){add(events,type,fn);},removeEventListener(type,fn){remove(events,type,fn);}};
  globalThis.window={innerHeight:900,addEventListener(type,fn){add(windowEvents,type,fn);},removeEventListener(type,fn){remove(windowEvents,type,fn);}};
  globalThis.matchMedia=query=>media[query]??=( {matches:query.includes('prefers-reduced-motion')?reduced:fine,addEventListener(type,fn){this.change=fn;},removeEventListener(){delete this.change;}} );
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
  f.move(f.inner);assert.equal(f.outer.dataset.cardActive,undefined);assert.equal(f.inner.dataset.cardActive,'true');
  f.events.pointerout({relatedTarget:null});assert.equal(f.inner.dataset.cardActive,undefined);assert.equal(f.frames.size,0);
});

test('card hover ignores touch and coarse pointers while reduced motion keeps a static highlight',async t=>{
  for(const options of [{fine:false},{reduced:true},{}])await t.test(JSON.stringify(options),t=>{
    const f=fixture(t,options);f.start();f.move(f.outer,90,110,options.fine===false?'mouse':options.reduced?'mouse':'touch');
    assert.equal(f.frames.size,0);assert.equal(f.outer.values.size,0);
    assert.equal(f.outer.dataset.cardActive,options.reduced?'true':undefined);
  });
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
