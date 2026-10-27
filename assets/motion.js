const ease = 'cubic-bezier(.16,1,.3,1)';
const rise = y => [{opacity:0,transform:`translateY(${y}px)`},{opacity:1,transform:'none'}];
const presets = {
  reveal:{frames:rise(20),duration:650},
  header:{frames:rise(-20),duration:650},
  greeting:{frames:rise(12),duration:500},
  portrait:{frames:[{opacity:0,transform:'translateY(48px) scale(.96)'},{opacity:1,transform:'none'}],duration:950},
  copy:{frames:rise(20),duration:650},
  social:{frames:rise(16),duration:500},
  letter:{frames:[{transform:'translateY(112%) rotate(3deg)'},{transform:'none'}],duration:800},
  word:{frames:[{transform:'translateY(110%)'},{transform:'none'}],duration:650},
  feedback:{frames:rise(8),duration:350}
};
const effects = new Set();
const seen = new WeakSet();
let previousCleanup;

export function playMotion(element, preset='reveal', {delay=0,duration=presets[preset].duration}={}) {
  if (!element?.animate || (typeof document!=='undefined'&&document.documentElement?.dataset.motion==='reduced')) return null;
  try {
    const options={duration,delay,easing:ease,fill:'backwards'};
    const track=animation=>{
      effects.add(animation);
      animation.finished.then(()=>effects.delete(animation),()=>effects.delete(animation));
      return animation;
    };
    // Only transforms are additive; adding opacity would erase the fade.
    const frames=presets[preset].frames;
    const animation=track(element.animate(frames.map(({transform})=>({transform})),{...options,composite:'add'}));
    if(frames[0].opacity!==undefined)track(element.animate(frames.map(({opacity})=>({opacity})),options));
    return animation;
  } catch { return null; }
}

function cancelEffects() {
  for(const animation of effects) animation.cancel();
  effects.clear();
}

function split(element, pieces) {
  if(element.dataset.motionSplit) return [...element.querySelectorAll('[data-motion-piece]')];
  const fragments=pieces.map(text=>{
    const mask=document.createElement('span');mask.className='motion-mask';mask.setAttribute('aria-hidden','true');
    const piece=document.createElement('span');piece.dataset.motionPiece='';piece.textContent=text===' '?'\u00a0':text;
    mask.append(piece);return mask;
  });
  element.replaceChildren(...fragments);element.dataset.motionSplit='true';
  return fragments.map(mask=>mask.firstElementChild);
}

function initCardHover() {
  const cards=[...document.querySelectorAll('.card,.tool-window,.contribution-card,.project-screenshot-link,.more-project,.next-step-grid>article,[data-tilt]')]
    .filter(card=>!card.matches('.hero-portrait,.project-feature,.case-role,.contact-info,.resume-document .card,.case-content>.card'));
  const magnets=[...document.querySelectorAll('.hero-copy .button.primary,.header-contact,.footer-identity>.button')];
  if(!cards.length&&!magnets.length)return ()=>{};
  for(const card of cards){
    card.dataset.cardHover='';
    if(card.matches('.project-screenshot-link,.more-project,.next-step-grid>article,.stack-card,[data-tilt]'))card.dataset.cardDepth='full';
    else if(card.matches('.certification-card,.about-portrait'))card.dataset.cardDepth='soft';
  }
  for(const button of magnets)button.dataset.magnetic='';
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const reduced=()=>document.documentElement?.dataset.motion==='reduced';
  let active,focused,point,bounds,magnet,magnetBounds,frame=0;
  const reset=()=>{
    cancelAnimationFrame(frame);frame=0;
    if(active){delete active.dataset.cardActive;active.style.removeProperty('--card-rx');active.style.removeProperty('--card-ry');}
    if(magnet){magnet.style.removeProperty('--magnet-x');magnet.style.removeProperty('--magnet-y');}
    active=null;magnet=null;
  };
  const draw=()=>{
    frame=0;if(reduced())return;
    if(active){
      const x=Math.max(0,Math.min(1,(point.x-bounds.left)/bounds.width));
      const y=Math.max(0,Math.min(1,(point.y-bounds.top)/bounds.height));
      active.style.setProperty('--card-x',`${+(x*bounds.width).toFixed(2)}px`);
      active.style.setProperty('--card-y',`${+(y*bounds.height).toFixed(2)}px`);
      if(active.dataset.cardDepth){
        const strength=active.dataset.cardDepth==='soft'?.5:1;
        active.style.setProperty('--card-rx',`${(-(y-.5)*8*strength).toFixed(2)}deg`);
        active.style.setProperty('--card-ry',`${((x-.5)*10*strength).toFixed(2)}deg`);
      }
    }
    if(magnet){
      magnet.style.setProperty('--magnet-x',`${(Math.max(-.5,Math.min(.5,(point.x-magnetBounds.left)/magnetBounds.width-.5))*6).toFixed(2)}px`);
      magnet.style.setProperty('--magnet-y',`${(Math.max(-.5,Math.min(.5,(point.y-magnetBounds.top)/magnetBounds.height-.5))*6).toFixed(2)}px`);
    }
  };
  const move=event=>{
    if(event.pointerType==='touch'||!fine.matches||document.hidden){reset();return;}
    const card=event.target.closest?.('[data-card-hover]');
    const button=event.target.closest?.('[data-magnetic]');
    if(card!==active||button!==magnet){
      reset();active=card;magnet=button;
      if(active){bounds=active.getBoundingClientRect();active.dataset.cardActive='true';}
      if(magnet)magnetBounds=magnet.getBoundingClientRect();
    }
    if((!active&&!magnet)||reduced())return;
    point={x:event.clientX,y:event.clientY};
    if(!frame)frame=requestAnimationFrame(draw);
  };
  const leave=event=>{if((active&&!active.contains(event.relatedTarget))||(magnet&&!magnet.contains(event.relatedTarget)))reset();};
  const focus=event=>{
    if(focused)delete focused.dataset.cardFocus;
    const target=event.type==='focusout'?event.relatedTarget:event.target;
    focused=target?.matches(':focus-visible')?target.closest('[data-card-hover]'):null;
    if(focused)focused.dataset.cardFocus='true';
  };
  const listeners={pointerover:move,pointermove:move,pointerout:leave,pointercancel:reset,visibilitychange:reset,motionchange:reset,focusin:focus,focusout:focus};
  for(const [type,listener] of Object.entries(listeners))document.addEventListener(type,listener,{passive:true});
  window.addEventListener('blur',reset);window.addEventListener('pagehide',reset);
  window.addEventListener('scroll',reset,{passive:true});window.addEventListener('resize',reset);
  fine.addEventListener('change',reset);
  return ()=>{
    reset();
    for(const card of cards){delete card.dataset.cardHover;delete card.dataset.cardDepth;delete card.dataset.cardFocus;card.style.removeProperty('--card-x');card.style.removeProperty('--card-y');}
    for(const button of magnets)delete button.dataset.magnetic;
    for(const [type,listener] of Object.entries(listeners))document.removeEventListener(type,listener);
    window.removeEventListener('blur',reset);window.removeEventListener('pagehide',reset);
    window.removeEventListener('scroll',reset);window.removeEventListener('resize',reset);
    fine.removeEventListener('change',reset);
  };
}

export function initMotion() {
  if(typeof document==='undefined' || typeof window==='undefined') return ()=>{};
  previousCleanup?.();
  if(typeof IntersectionObserver!=='function') return ()=>{};
  const reveals=new Map(), ghosts=new Map(), visibleGhosts=new Set();
  const stage=document.querySelector('.hero-stage');
  const hero=stage?.closest('.portfolio-hero');
  const name=document.querySelector('.hero-heading');
  const portrait=document.querySelector('.hero-portrait');
  const copy=document.querySelector('.hero-copy');
  let heroVisible=false, frame=0, pagePaused=false, pointer;
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const progress=document.querySelector('[data-scroll-progress]');
  const allowed=()=>!document.hidden&&!pagePaused&&document.documentElement?.dataset.motion!=='reduced';
  const clamp=value=>Math.max(0,Math.min(1,value));

  function resetScroll() {
    name?.style.removeProperty('--hero-name-shift');
    portrait?.style.removeProperty('--hero-photo-shift');
    for(const element of [name,portrait]){element?.style.removeProperty('--hero-pointer-x');element?.style.removeProperty('--hero-pointer-y');}
    copy?.style.removeProperty('--hero-copy-opacity');
    for(const inner of ghosts.values()) inner.style.removeProperty('--ghost-shift');
  }
  function drawScroll() {
    frame=0;if(!allowed())return;
    if(progress){
      const total=document.documentElement.scrollHeight-window.innerHeight;
      progress.style.setProperty('--page-progress',String(total>0?clamp(window.scrollY/total):0));
    }
    if(heroVisible && stage){
      const bounds=stage.getBoundingClientRect(),progress=clamp(-bounds.top/bounds.height);
      name?.style.setProperty('--hero-name-shift',`${progress*name.offsetHeight*.3}px`);
      portrait?.style.setProperty('--hero-photo-shift',`${progress*portrait.offsetHeight*.12}px`);
      copy?.style.setProperty('--hero-copy-opacity',String(clamp(1-progress/.6)));
      for(const [element,amount] of [[name,6],[portrait,10]]){
        element?.style.setProperty('--hero-pointer-x',`${pointer?(clamp((pointer.x-bounds.left)/bounds.width)-.5)*amount*2:0}px`);
        element?.style.setProperty('--hero-pointer-y',`${pointer?(clamp((pointer.y-bounds.top)/bounds.height)-.5)*amount*2:0}px`);
      }
    }
    for(const ghost of visibleGhosts){
      const bounds=ghost.getBoundingClientRect();
      const progress=clamp((window.innerHeight-bounds.top)/(window.innerHeight+bounds.height));
      ghosts.get(ghost).style.setProperty('--ghost-shift',`${3-10*progress}%`);
    }
  }
  function schedule(){if(!frame&&allowed()&&(heroVisible||visibleGhosts.size||progress))frame=requestAnimationFrame(drawScroll);}
  const moveHero=event=>{if(event.pointerType==='touch'||!fine.matches)return;pointer={x:event.clientX,y:event.clientY};schedule();};
  const resetPointer=()=>{pointer=null;schedule();};
  function sync(){
    if(hero)hero.dataset.motionRunning=String(allowed()&&heroVisible);
    if(!allowed()){
      pointer=null;cancelEffects();cancelAnimationFrame(frame);frame=0;resetScroll();
    }else schedule();
  }
  let observer;
  try {
    observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        const node=entry.target;
        if(reveals.has(node)&&entry.isIntersecting&&!seen.has(node)){
          seen.add(node);reveals.get(node)();observer.unobserve(node);
        }
        if(node===stage)heroVisible=entry.isIntersecting;
        if(ghosts.has(node)){if(entry.isIntersecting)visibleGhosts.add(node);else visibleGhosts.delete(node);}
      }
      sync();
    },{rootMargin:'0px 0px 8% 0px',threshold:.01});
  } catch { return ()=>{}; }

  const cleanupCards=initCardHover();
  const register=(node,run)=>{
    const bounds=node.getBoundingClientRect();
    // Late initialization must not make already-readable content disappear.
    if(bounds.top<window.innerHeight*.8&&bounds.bottom>0)seen.add(node);
    if(!seen.has(node)){reveals.set(node,run);observer.observe(node);}
  };
  for(const heading of document.querySelectorAll('.reference-heading h2')){
    const text=heading.getAttribute('aria-label')||heading.textContent.trim();
    heading.setAttribute('aria-label',text);heading.dataset.motionWords='true';
    const pieces=split(heading,text.split(/\s+/).map((word,i)=>`${i===0?'/':''}${word}${i<text.split(/\s+/).length-1?'\u00a0':''}`));
    register(heading,()=>pieces.forEach((piece,i)=>playMotion(piece,'word',{delay:Math.min(i*60,240)})));
  }
  for(const ghost of document.querySelectorAll('.reference-heading .heading-ghost')){
    let inner=ghost.querySelector('.motion-ghost-text');
    if(!inner){inner=document.createElement('span');inner.className='motion-ghost-text';inner.textContent=ghost.textContent;ghost.replaceChildren(inner);}
    ghosts.set(ghost,inner);observer.observe(ghost);
  }
  const selectors=[
    '.hero-facts>div','.summary-about>h3','.summary-about>p','.expertise-list','.summary-about>.text-link',
    '.about-education>.eyebrow','.timeline article','.about-education>img',
    '.tool-window','.skill-group','.project-section-bar','.project-feature','.experience-row',
    '.certificate-group-heading','.home-certificates','.earlier-training','.workflow-grid>article',
    '.github-panel','.next-step-grid>article','.contact-info','.contact-form','.footer-inner>div',
    '.page-intro','.project-card','.stack-card','.certification-card','.case-content>section'
  ];
  for(const node of document.querySelectorAll(selectors.join(','))){
    const index=Math.max(0,[...(node.parentElement?.children||[])].indexOf(node));
    register(node,()=>playMotion(node,'reveal',{delay:Math.min(index*70,210)}));
  }

  const header=document.querySelector('.site-header');
  if(header&&!seen.has(header)){seen.add(header);playMotion(header,'header');}
  if(stage){
    const bounds=stage.getBoundingClientRect();heroVisible=bounds.bottom>0&&bounds.top<window.innerHeight;
    observer.observe(stage);
    if(!seen.has(stage)){
      seen.add(stage);
      if(heroVisible){
        playMotion(document.querySelector('.hero-heading>p'),'greeting',{delay:80});
        for(const [lineIndex,line] of [...document.querySelectorAll('.hero-heading h1>span')].entries()){
          line.setAttribute('aria-hidden','true');
          split(line,Array.from(line.textContent)).forEach((piece,i)=>playMotion(piece,'letter',{delay:180+lineIndex*180+i*22}));
        }
        playMotion(document.querySelector('.hero-formal-portrait'),'portrait',{delay:400});
        playMotion(copy,'copy',{delay:680});
        for(const [i,link] of [...document.querySelectorAll('.hero-socials>a')].entries()){
          link.style.setProperty('--social-index',i);playMotion(link,'social',{delay:800+i*70});
        }
        playMotion(document.querySelector('.hero-scroll'),'social',{delay:1000});
      }
    }
  }
  for(const [i,link] of [...document.querySelectorAll('.main-nav>a')].entries())link.style.setProperty('--menu-index',i);
  const hide=event=>{pagePaused=true;sync();if(!event.persisted)cleanup();};
  const show=()=>{pagePaused=false;sync();};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('motionchange',sync);
  stage?.addEventListener('pointermove',moveHero,{passive:true});stage?.addEventListener('pointerleave',resetPointer);
  window.addEventListener('blur',resetPointer);fine.addEventListener('change',resetPointer);
  window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);
  function cleanup(){
    cleanupCards();
    observer.disconnect();cancelEffects();cancelAnimationFrame(frame);resetScroll();
    if(hero)hero.dataset.motionRunning='false';
    window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);
    document.removeEventListener('visibilitychange',sync);
    document.removeEventListener('motionchange',sync);
    stage?.removeEventListener('pointermove',moveHero);stage?.removeEventListener('pointerleave',resetPointer);
    window.removeEventListener('blur',resetPointer);fine.removeEventListener('change',resetPointer);
    window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);
  }
  previousCleanup=cleanup;sync();return cleanup;
}
