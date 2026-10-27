import test from 'node:test';
import assert from 'node:assert/strict';
import { initHome } from '../assets/home.js';

function element(textContent = '') {
  return { dataset:{},hidden:false,textContent,scrollHeight:150,attributes:{},listeners:{},
    style:{setProperty(){},removeProperty(){}},
    setAttribute(key,value){this.attributes[key]=value;},
    addEventListener(type,callback){this.listeners[type]=callback;},
    contains(node){return node===this;},querySelector(){return null;},querySelectorAll(){return [];} };
}

test('Home without a hobby carousel starts the sphere and suspends offscreen/hidden', async t=>{
  const keys=['document','window','matchMedia','Image','MutationObserver','ResizeObserver','IntersectionObserver','requestAnimationFrame','cancelAnimationFrame'];
  const saved=new Map(keys.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  t.after(()=>{for(const key of keys){if(saved.get(key))Object.defineProperty(globalThis,key,saved.get(key));else delete globalThis[key];}});
  for(const [hasCanvas,hasOptional] of [[true,true],[false,true],[true,false]]){
    const sphere=element(),strip=element(),gallery=element();
    let duration;strip.querySelector=()=>({offsetWidth:4500});strip.style.setProperty=(key,value)=>{if(key==='--tool-duration')duration=value;};
    const presentation=element();presentation.hidden=true;
    gallery.querySelectorAll=()=>[element()];
    let draws=0;const circles=[];
    const context={stroke(){},moveTo(){},lineTo(){},setTransform(){},clearRect(){draws++;},beginPath(){},arc(x,y){circles.push([x,y]);},fill(){},drawImage(){}};
    const canvas={width:640,height:520,clientWidth:640,dataset:{},getContext:()=>hasCanvas?context:null,listeners:{},getBoundingClientRect:()=>({left:0,top:0,width:640,height:520}),addEventListener(type,fn){this.listeners[type]=fn;},setPointerCapture(id){this.captured=id;},hasPointerCapture(id){return this.captured===id;},releasePointerCapture(){this.captured=null;}};
    const sphereNodes={'canvas':canvas,'[data-sphere-name]':element(),'[data-sphere-presentation]':presentation};
    sphere.querySelector=selector=>sphereNodes[selector];sphere.querySelectorAll=()=>['React','Java'].map(name=>{const item=element();item.dataset.name=name;item.querySelector=()=>({src:'/icon.svg'});return item;});
    const nodes={'[data-sphere]':sphere,'[data-moving-strip]':hasOptional?strip:null,'[data-gallery]':hasOptional?gallery:null};
    const doc=element();doc.documentElement={dataset:{theme:'light'}};doc.hidden=false;doc.querySelector=selector=>nodes[selector] ?? null;globalThis.document=doc;
    globalThis.window={devicePixelRatio:1,innerHeight:900,addEventListener(){}};
    const media={matches:false,listeners:{},addEventListener(type,fn){this.listeners[type]=fn;}};globalThis.matchMedia=()=>media;
    let themeChanged;globalThis.MutationObserver=class{constructor(fn){themeChanged=fn;}observe(){}};
    globalThis.Image=class {complete=true;naturalWidth=26;};
    globalThis.ResizeObserver=class {observe(){}};
    const observers=[];globalThis.IntersectionObserver=class {constructor(callback){observers.push(callback);}observe(){}};
    let frameId=0;const frames=new Map();
    globalThis.requestAnimationFrame=callback=>{frames.set(++frameId,callback);return frameId;};
    globalThis.cancelAnimationFrame=id=>frames.delete(id);
    let now=0;
    const advance=milliseconds=>{for(let end=now+milliseconds;now<end;){now+=16;const callbacks=[...frames.values()];frames.clear();callbacks.forEach(callback=>callback(now));}};
    initHome();
    if(hasOptional)assert.equal(duration,'100s','Strip covers its measured group width at 45px per second');
    assert.equal(presentation.hidden,!hasCanvas,'Sphere is shown automatically only when canvas works');
    assert.equal(frames.size,0,'No offscreen animation loop');
    observers[0]([{target:sphere,isIntersecting:true}]);
    assert.equal(frames.size,0,'Visible skill text alone must not animate an offscreen globe');
    observers[0]([presentation,strip].map(target=>({target,isIntersecting:true})));
    if(hasOptional)assert.equal(strip.dataset.running,'true');
    advance(4200);
    if(hasCanvas){assert.ok(draws>100);assert.notDeepEqual(circles.slice(0,2),circles.slice(-2),'Sphere projection moves over time');}
    if(hasCanvas){
      const positions=()=>circles.slice(-2);
      const event=(x,y,extra={})=>({clientX:x,clientY:y,pointerId:1,pointerType:'mouse',button:0,timeStamp:now,...extra});
      const beforeHover=positions();canvas.listeners.pointermove(event(600,450));advance(150);
      assert.notEqual(beforeHover[1][1],positions()[1][1],'Hover tilts the globe vertically');
      canvas.listeners.pointerdown(event(300,250));assert.equal(canvas.captured,1);
      assert.equal(frames.size,0,'Dragging uses direct painting rather than autoplay');
      const beforeDrag=positions();canvas.listeners.pointermove(event(390,300,{timeStamp:now+30}));
      assert.notDeepEqual(positions(),beforeDrag,'Dragging changes the projection immediately');
      canvas.listeners.pointerup(event(390,300,{timeStamp:now+31}));assert.equal(canvas.captured,null);
      const released=positions();advance(100);assert.notDeepEqual(positions(),released,'Released globe spins');
      canvas.listeners.pointerdown(event(300,250));canvas.listeners.pointercancel(event(300,250));
      assert.equal(canvas.dataset.dragging,'false');assert.equal(canvas.captured,null);
      canvas.listeners.keydown({key:'ArrowRight',preventDefault(){}});
      assert.equal(frames.size,0,'Keyboard input pauses autoplay after the canvas received pointer focus');
      canvas.listeners.focus();assert.equal(frames.size,0,'Keyboard focus suspends automatic rotation');
      const beforeKey=positions();let prevented=false;
      canvas.listeners.keydown({key:'ArrowUp',preventDefault(){prevented=true;}});
      assert.equal(prevented,true);assert.notDeepEqual(positions(),beforeKey);
      canvas.listeners.blur();assert.equal(frames.size,1);
    }
    doc.hidden=true;doc.listeners.visibilitychange();assert.equal(frames.size,0);if(hasOptional)assert.equal(strip.dataset.running,'false');
    const hiddenDraws=draws;advance(60000);assert.equal(draws,hiddenDraws,'No sphere draws while hidden');
    doc.hidden=false;doc.listeners.visibilitychange();advance(100);
    if(hasOptional)assert.equal(strip.dataset.running,'true');
    if(hasCanvas)assert.ok(draws>hiddenDraws,'Sphere resumes when the tab is visible');
    observers[0]([presentation,strip].map(target=>({target,isIntersecting:false})));
    assert.equal(frames.size,0);if(hasOptional)assert.equal(strip.dataset.running,'false');
    observers[0]([presentation,strip].map(target=>({target,isIntersecting:true})));
    media.matches=true;media.listeners.change?.();assert.equal(frames.size>0,hasCanvas);
    if(hasOptional)assert.equal(strip.dataset.running,'true');
    const preferenceDraws=draws;advance(1000);
    if(hasCanvas)assert.ok(draws>preferenceDraws,'Globe keeps rotating under the OS reduced-motion preference');
    observers[0]([presentation,strip].map(target=>({target,isIntersecting:false})));
    const staticDraws=draws;
    if(hasCanvas){
      doc.documentElement.dataset.theme='dark';themeChanged();
      assert.ok(draws>staticDraws,'Theme changes repaint even while the globe is offscreen');
      assert.equal(context.strokeStyle,'#c4adfa');assert.equal(frames.size,0);
      const [x,y]=circles.at(-1);canvas.listeners.pointermove({clientX:x,clientY:y});
      assert.ok(['React','Java'].includes(sphereNodes['[data-sphere-name]'].textContent),'Hover identifies a projected logo');
      canvas.listeners.pointerleave();assert.equal(sphereNodes['[data-sphere-name]'].textContent,'Explore the Technologies');
    }
    media.matches=false;media.listeners.change?.();
    observers[0]([presentation,strip].map(target=>({target,isIntersecting:true})));
    assert.equal(frames.size>0,hasCanvas,'Animation resumes only when canvas is available');
    doc.documentElement.dataset.motion='reduced';doc.listeners.motionchange();assert.equal(frames.size,0);
    if(hasOptional)assert.equal(strip.dataset.running,'false');
    const pausedDraws=draws;advance(1000);assert.equal(draws,pausedDraws);
    if(hasCanvas){
      const before=circles.slice(-2);
      canvas.listeners.pointerdown({clientX:300,clientY:250,pointerId:2,pointerType:'touch',button:0,timeStamp:now});
      canvas.listeners.pointermove({clientX:380,clientY:310,pointerId:2,pointerType:'touch',timeStamp:now+20});
      assert.notDeepEqual(circles.slice(-2),before,'Direct touch rotation still works in reduced motion');
      canvas.listeners.pointerup({pointerId:2,timeStamp:now+21});
      const touched=draws;advance(1000);assert.equal(draws,touched,'Reduced motion does not leave inertia running');
      assert.equal(frames.size,0);
    }
    doc.documentElement.dataset.motion='full';doc.listeners.motionchange();assert.equal(frames.size>0,hasCanvas);
  }
});
