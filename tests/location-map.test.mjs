import test from 'node:test';
import assert from 'node:assert/strict';

test('location map switches theme on the same instance and preserves camera and controls',async t=>{
 const keys=['document','MutationObserver','ResizeObserver'];
 const saved=new Map(keys.map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
 t.after(()=>keys.forEach(k=>saved.get(k)?Object.defineProperty(globalThis,k,saved.get(k)):delete globalThis[k]));
 const target={hidden:true},status={hidden:false,textContent:''};
 const root={querySelector:s=>s==='[data-map-canvas]'?target:status};
 globalThis.document={documentElement:{dataset:{theme:'dark'}}};
 let themeChanged,resize;
 globalThis.MutationObserver=class{constructor(fn){themeChanged=fn;}observe(){}};
 globalThis.ResizeObserver=class{constructor(fn){resize=fn;}observe(){}};
 const instances=[],styles=[];
 class FakeMap{
  constructor(options){this.options=options;this.listeners={};this.scrollZoom={disable:()=>this.wheelDisabled=true};instances.push(this);}
  addControl(control,position){this.control=position;}
  on(name,fn){this.listeners[name]=fn;}
  setStyle(style){styles.push(style);}
  resize(){this.resized=true;}
 }
 const library={Map:FakeMap,NavigationControl:class{},setWorkerUrl(url){assert.match(url,/maplibre-gl-worker.mjs$/);}};
 const {mountLocationMap}=await import('../assets/location-map.js');
 const map=mountLocationMap(root,library);
 assert.equal(target.hidden,false);
 assert.deepEqual(map.options.center,[121.05,14.52]);assert.equal(map.options.zoom,11.5);
 assert.equal(map.options.style,'https://tiles.openfreemap.org/styles/dark');
 assert.equal(map.wheelDisabled,true);assert.equal(map.control,'top-right');
 map.listeners.load();assert.equal(status.hidden,true);
 map.listeners.error();assert.equal(status.hidden,false);
 map.listeners.idle();assert.equal(status.hidden,true,'Recovered maps must not stay covered by an old error');
 globalThis.document.documentElement.dataset.theme='light';themeChanged();
 assert.deepEqual(styles,['https://tiles.openfreemap.org/styles/positron']);
 assert.equal(instances.length,1);assert.deepEqual(map.options.center,[121.05,14.52]);
 resize();assert.equal(map.resized,true);
 assert.equal(mountLocationMap(root,{...library,Map:class{constructor(){throw new Error('WebGL unavailable');}}}),null);
 assert.equal(target.hidden,true);assert.equal(status.hidden,false);assert.match(status.textContent,/unavailable/i);
});

test('location map stays unloaded until its viewport observer sees it',async t=>{
 const keys=['document','IntersectionObserver'];const saved=new Map(keys.map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
 t.after(()=>keys.forEach(k=>saved.get(k)?Object.defineProperty(globalThis,k,saved.get(k)):delete globalThis[k]));
 const root={};let observed;
 globalThis.document={querySelector:()=>root};
 globalThis.IntersectionObserver=class{constructor(fn,options){assert.equal(options.rootMargin,'200px');}observe(el){observed=el;}};
 const {initLocationMap}=await import('../assets/location-map.js');initLocationMap();assert.equal(observed,root);
});
