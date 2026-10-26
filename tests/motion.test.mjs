import test from 'node:test';
import assert from 'node:assert/strict';
import { initMotion, playMotion } from '../assets/motion.js';

function fixture(t,{reduced=false,top=1000,observer=true}={}) {
  const keys=['document','window','matchMedia','IntersectionObserver','requestAnimationFrame','cancelAnimationFrame'];
  const saved=new Map(keys.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  let cleanup;
  t.after(()=>{cleanup?.();keys.forEach(key=>saved.get(key)?Object.defineProperty(globalThis,key,saved.get(key)):delete globalThis[key]);});
  const listeners={};
  const media={matches:reduced,addEventListener(type,fn){listeners.media=fn;},removeEventListener(){}};
  globalThis.matchMedia=()=>media;
  let canceled=0;
  const calls=[];
  const node={dataset:{},hidden:false,parentElement:{children:[]},getBoundingClientRect:()=>({top,bottom:top+100,height:100}),animate(frames,options){calls.push({frames,options});return {finished:new Promise(()=>{}),cancel(){canceled++;}};}};
  node.parentElement.children=[node];
  globalThis.document={hidden:false,querySelector:()=>null,querySelectorAll:selector=>selector.includes('.project-feature')?[node]:[],addEventListener(type,fn){listeners[type]=fn;},removeEventListener(){}};
  globalThis.window={innerHeight:900,addEventListener(type,fn){listeners[type]=fn;},removeEventListener(){}};
  let callback;
  globalThis.IntersectionObserver=observer?class{constructor(fn){if(observer==='throw')throw new Error('Observer unavailable');callback=fn;}observe(){}unobserve(){}disconnect(){}}:undefined;
  globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=()=>{};
  return {node,calls,media,listeners,cleanup:fn=>{cleanup=fn;},enter:()=>callback?.([{target:node,isIntersecting:true,intersectionRatio:1}]),canceled:()=>canceled};
}

test('motion uses measured easing/timing under either OS preference and skips unsupported animation',t=>{
  const f=fixture(t);
  playMotion(f.node);
  assert.equal(f.calls[0].options.duration,1150);
  assert.equal(f.calls[0].options.easing,'cubic-bezier(.16,1,.3,1)');
  assert.equal(f.calls[0].options.fill,'backwards');
  f.media.matches=true;assert.ok(playMotion(f.node));assert.equal(f.calls.length,2);
  assert.equal(playMotion({}),null);
});

test('viewport reveals run once regardless of OS preference',t=>{
  const f=fixture(t);
  const cleanup=initMotion();f.cleanup(cleanup);
  assert.equal(f.calls.length,0,'Offscreen content waits for its viewport entry');
  f.enter();f.enter();assert.equal(f.calls.length,1);
  f.media.matches=true;f.listeners.media?.();assert.equal(f.canceled(),0);
  assert.equal(f.node.hidden,false,'Canceling motion restores the visible document default');
});

test('missing observers and late initialization leave content readable',async t=>{
  for(const options of [{observer:false},{observer:'throw'},{top:100}]) await t.test(JSON.stringify(options),t=>{
    const f=fixture(t,options);const cleanup=initMotion();f.cleanup(cleanup);
    if(options.observer!==false)f.enter();
    assert.equal(f.calls.length,0);assert.equal(f.node.hidden,false);
  });
});

test('viewport entrances remain active when reduced motion is requested by the OS',t=>{
  const f=fixture(t,{reduced:true});f.cleanup(initMotion());f.enter();
  assert.equal(f.calls.length,1);assert.equal(f.node.hidden,false);
});

test('hidden pages cancel active entrance effects',t=>{
  const f=fixture(t);const cleanup=initMotion();f.cleanup(cleanup);f.enter();
  document.hidden=true;f.listeners.visibilitychange();assert.equal(f.canceled(),1);
});
