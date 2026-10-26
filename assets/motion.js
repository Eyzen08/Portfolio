const ease = 'cubic-bezier(.16,1,.3,1)';
const rise = y => [{opacity:0,transform:`translateY(${y}px)`},{opacity:1,transform:'none'}];
const presets = {
  reveal:{frames:rise(28),duration:1150},
  header:{frames:rise(-40),duration:1000},
  greeting:{frames:rise(14),duration:1000},
  portrait:{frames:rise(80),duration:1500},
  copy:{frames:rise(32),duration:1100},
  social:{frames:rise(24),duration:700},
  letter:{frames:[{transform:'translateY(112%) rotate(3deg)'},{transform:'none'}],duration:1200},
  word:{frames:[{transform:'translateY(110%)'},{transform:'none'}],duration:900},
  feedback:{frames:rise(8),duration:350}
};
const effects = new Set();
const seen = new WeakSet();
let previousCleanup;

export function playMotion(element, preset='reveal', {delay=0,duration=presets[preset].duration}={}) {
  if (!element?.animate) return null;
  try {
    const animation=element.animate(presets[preset].frames,{duration,delay,easing:ease,fill:'backwards'});
    effects.add(animation);
    animation.finished.then(()=>effects.delete(animation),()=>effects.delete(animation));
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
  let heroVisible=false, frame=0, pagePaused=false;
  const allowed=()=>!document.hidden&&!pagePaused;
  const clamp=value=>Math.max(0,Math.min(1,value));

  function resetScroll() {
    name?.style.removeProperty('--hero-name-shift');
    portrait?.style.removeProperty('--hero-photo-shift');
    copy?.style.removeProperty('--hero-copy-opacity');
    for(const inner of ghosts.values()) inner.style.removeProperty('--ghost-shift');
  }
  function drawScroll() {
    frame=0;if(!allowed())return;
    if(heroVisible && stage){
      const bounds=stage.getBoundingClientRect(),progress=clamp(-bounds.top/bounds.height);
      name?.style.setProperty('--hero-name-shift',`${progress*name.offsetHeight*.3}px`);
      portrait?.style.setProperty('--hero-photo-shift',`${progress*portrait.offsetHeight*.12}px`);
      copy?.style.setProperty('--hero-copy-opacity',String(clamp(1-progress/.6)));
    }
    for(const ghost of visibleGhosts){
      const bounds=ghost.getBoundingClientRect();
      const progress=clamp((window.innerHeight-bounds.top)/(window.innerHeight+bounds.height));
      ghosts.get(ghost).style.setProperty('--ghost-shift',`${3-10*progress}%`);
    }
  }
  function schedule(){if(!frame&&allowed()&&(heroVisible||visibleGhosts.size))frame=requestAnimationFrame(drawScroll);}
  function sync(){
    if(hero)hero.dataset.motionRunning=String(allowed()&&heroVisible);
    if(!allowed()){
      cancelEffects();cancelAnimationFrame(frame);frame=0;resetScroll();
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
    register(heading,()=>pieces.forEach((piece,i)=>playMotion(piece,'word',{delay:40+i*55})));
  }
  for(const ghost of document.querySelectorAll('.reference-heading .heading-ghost')){
    let inner=ghost.querySelector('.motion-ghost-text');
    if(!inner){inner=document.createElement('span');inner.className='motion-ghost-text';inner.textContent=ghost.textContent;ghost.replaceChildren(inner);}
    ghosts.set(ghost,inner);observer.observe(ghost);
  }
  const selectors=[
    '.hero-facts>div','.summary-about>h3','.summary-about>p','.expertise-list','.summary-about>.text-link',
    '.about-education>.eyebrow','.timeline article','.about-education>img','.about-extras',
    '.tool-window','.skill-group','.project-section-bar','.project-feature','.experience-row',
    '.certificate-group-heading','.home-certificates','.earlier-training','.workflow-grid>article',
    '.github-panel','.next-step-grid>article','.contact-info','.contact-form','.footer-inner>div',
    '.page-intro','.project-card','.stack-card','.certification-card','.case-content>section'
  ];
  for(const node of document.querySelectorAll(selectors.join(','))){
    const index=Math.max(0,[...(node.parentElement?.children||[])].indexOf(node));
    register(node,()=>playMotion(node,'reveal',{delay:Math.min(index*80,240)}));
  }

  const header=document.querySelector('.site-header');
  if(header&&!seen.has(header)){seen.add(header);playMotion(header,'header',{delay:200});}
  if(stage){
    const bounds=stage.getBoundingClientRect();heroVisible=bounds.bottom>0&&bounds.top<window.innerHeight;
    observer.observe(stage);
    if(!seen.has(stage)){
      seen.add(stage);
      if(heroVisible){
        playMotion(document.querySelector('.hero-heading>p'),'greeting',{delay:450});
        for(const [lineIndex,line] of [...document.querySelectorAll('.hero-heading h1>span')].entries()){
          line.setAttribute('aria-hidden','true');
          split(line,Array.from(line.textContent)).forEach((piece,i)=>playMotion(piece,'letter',{delay:550+lineIndex*300+i*40}));
        }
        playMotion(document.querySelector('.hero-formal-portrait'),'portrait',{delay:1150});
        playMotion(copy,'copy',{delay:1350});
        for(const [i,link] of [...document.querySelectorAll('.hero-socials>a')].entries()){
          link.style.setProperty('--social-index',i);playMotion(link,'social',{delay:1550+i*100});
        }
      }
    }
  }
  for(const [i,link] of [...document.querySelectorAll('.main-nav>a')].entries())link.style.setProperty('--menu-index',i);
  const hide=event=>{pagePaused=true;sync();if(!event.persisted)cleanup();};
  const show=()=>{pagePaused=false;sync();};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);
  function cleanup(){
    observer.disconnect();cancelEffects();cancelAnimationFrame(frame);resetScroll();
    if(hero)hero.dataset.motionRunning='false';
    window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);
    document.removeEventListener('visibilitychange',sync);
    window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);
  }
  previousCleanup=cleanup;sync();return cleanup;
}
