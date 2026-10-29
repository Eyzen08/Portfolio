import { deckOffset, galleryIndex } from './home.js';

export function initDecks() {
  const groups = [...document.querySelectorAll('[data-deck]')];
  if (!groups.length) return;
  const states = new Map();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) { const state = states.get(entry.target); state.visible = entry.isIntersecting; state.sync(); }
  }, { threshold: .1 });
  groups.forEach(group => {
    const cards = [...group.querySelectorAll('[data-deck-card]')];
    if (!cards.length) return;
    const buttons = [...group.querySelectorAll('[data-deck-select]')];
    const captions = cards.map(card => card.querySelector('[data-deck-caption]'));
    const counter = group.querySelector('[data-deck-counter]');
    const background = group.dataset.deckKind === 'background';
    const compact = group.hasAttribute('data-deck-compact');
    let active = 0, hovered = false, focused = false, timer;
    const state = { visible: false, sync() {
      clearTimeout(timer);
      if (state.visible && !document.hidden && document.documentElement.dataset.motion!=='reduced' && !hovered && !focused && group.dataset.previewOpen !== 'true' && cards.length > 1) timer = setTimeout(() => { select(active + 1); state.sync(); }, 4000);
    } };
    const select = (index, manual = false) => {
      active = galleryIndex(0,index,cards.length);
      cards.forEach((card,i) => {
        const offset = deckOffset(i,active,cards.length);
        card.dataset.selected = String(i === active);
        card.dataset.side = offset === 0 ? 'center' : offset < 0 ? 'left' : 'right';
        card.style.setProperty('--offset',offset);
        card.style.setProperty('--scale',offset === 0 ? 1 : .82);
        card.style.setProperty('--opacity',Math.abs(offset) > 1 ? 0 : offset === 0 ? 1 : .65);
        card.style.setProperty('--depth',cards.length - Math.abs(offset));
        card.querySelector('[data-deck-media]')?.setAttribute('aria-hidden',String(i !== active));
        if(captions[i]) captions[i].hidden = i !== active;
        if(compact) card.setAttribute('aria-hidden',String(i !== active));
      });
      buttons.forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.deckIndex) === active)));
      if(counter){ counter.setAttribute('aria-live',manual ? 'polite' : 'off'); counter.textContent = `${active + 1} / ${cards.length}`; }
      if(manual)state.sync();
    };
    group.dataset.enhanced = 'true';
    const controls=group.querySelector('[data-deck-controls]');
    if(controls) controls.hidden = false;
    buttons.forEach(button => { button.hidden = false; button.addEventListener('click',()=>select(Number(button.dataset.deckIndex),true)); });
    group.querySelector('[data-deck-prev]')?.addEventListener('click',()=>select(active-1,true));
    group.querySelector('[data-deck-next]')?.addEventListener('click',()=>select(active+1,true));
    if(background) {
      buttons.forEach(button=>{
        button.addEventListener('focus',()=>select(Number(button.dataset.deckIndex),true));
        button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')select(Number(button.dataset.deckIndex),true);});
      });
      cards.forEach((card,i)=>card.addEventListener('pointermove',event=>{if(event.pointerType==='mouse' && i!==active)select(i,true);}));
    }
    group.addEventListener('pointerenter',()=>{hovered=true;state.sync();});
    group.addEventListener('pointerleave',()=>{hovered=false;state.sync();});
    group.addEventListener('focusin',()=>{focused=true;state.sync();});
    group.addEventListener('focusout',event=>{if(!group.contains(event.relatedTarget)){focused=false;state.sync();}});
    group.addEventListener('previewchange',()=>state.sync());
    select(0);
    const size = () => {
      const stage = group.querySelector('[data-deck-stage]');
      if (!background) stage.style.setProperty('--caption-height','0px');
      const heights = cards.map((card,i)=>{
        const previous=card.dataset.selected, hidden=captions[i].hidden;
        card.dataset.selected='true';captions[i].hidden=false;
        const height=background ? card.scrollHeight : captions[i].scrollHeight;
        card.dataset.selected=previous;captions[i].hidden=hidden;
        return height;
      });
      if(background) stage.style.minHeight = `${Math.max(...heights)+24}px`;
      else stage.style.setProperty('--caption-height',`${Math.max(...heights)}px`);
    };
    if(!compact) {
      new ResizeObserver(size).observe(group);size();
      document.fonts?.ready.then(size);
    }
    states.set(group,state);observer.observe(group);
  });
  document.addEventListener('visibilitychange',()=>{for(const state of states.values())state.sync();});
  document.addEventListener('motionchange',()=>{for(const state of states.values())state.sync();});
}

export function initProjectPreviews() {
  const dialog=document.querySelector('[data-project-viewer]');
  if(!dialog || typeof dialog.showModal!=='function')return;
  const panels=[...dialog.querySelectorAll('[data-project-panel]')];
  const close=dialog.querySelector('[data-preview-close]');
  const title=dialog.querySelector('[data-project-title]');
  const thumbnail=dialog.querySelector('[data-project-thumbnail]');
  const featured=dialog.querySelector('[data-project-featured]');
  const updateMoreWork=new Map();
  let panel,active=0,opener;
  const select=index=>{
    const slides=[...panel.querySelectorAll('[data-preview-slide]')];
    active=galleryIndex(0,index,slides.length);
    slides.forEach((slide,i)=>{slide.hidden=i!==active;});
    panel.querySelectorAll('[data-preview-select]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===active)));
    const counter=panel.querySelector('[data-preview-count]');
    if(counter) counter.textContent=(active+1)+' / '+slides.length;
  };
  const showProject=id=>{
    const target=panels.find(item=>item.dataset.projectPanel===id);
    if(!target)return false;
    panel=target;panels.forEach(item=>{item.hidden=item!==panel;});
    title.textContent=panel.dataset.projectTitle;
    thumbnail.src=panel.querySelector('.preview-image').src;
    featured.hidden=panel.dataset.projectFeatured!=='true';
    select(0);return true;
  };
  document.querySelectorAll('[data-details-open]').forEach(link=>link.addEventListener('click',event=>{
    if(event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
    if(!showProject(link.dataset.projectId))return;
    if(!dialog.open){
      try{dialog.showModal();}catch{return;}
      opener=link;
    }
    event.preventDefault();
    document.documentElement.classList.add('preview-open');close.focus();dialog.scrollTop=0;
    const track=panel.querySelector('[data-more-work-track]');
    if(track)track.scrollLeft=0;
    updateMoreWork.get(panel)?.();
  }));
  panels.forEach(item=>{
    const track=item.querySelector('[data-more-work-track]');
    const previous=item.querySelector('[data-more-work-prev]');
    const next=item.querySelector('[data-more-work-next]');
    if(track && previous && next){
      const sync=()=>{
        const maximum=track.scrollWidth-track.clientWidth;
        const overflow=maximum>1;
        previous.hidden=next.hidden=!overflow;
        previous.setAttribute('aria-disabled',String(!overflow || track.scrollLeft<=1));
        next.setAttribute('aria-disabled',String(!overflow || maximum-track.scrollLeft<=1));
        if(!overflow && (document.activeElement===previous || document.activeElement===next))track.focus({preventScroll:true});
      };
      for(const [control,direction] of [[previous,-1],[next,1]])control.addEventListener('click',()=>{
        if(control.getAttribute('aria-disabled')==='true')return;
        const step=track.children.length>1?track.children[1].offsetLeft-track.children[0].offsetLeft:track.clientWidth;
        track.scrollBy({left:direction*step,behavior:document.documentElement.dataset.motion==='reduced'?'instant':'smooth'});
      });
      track.addEventListener('scroll',sync,{passive:true});
      new ResizeObserver(sync).observe(track);
      updateMoreWork.set(item,sync);sync();
    }
    track?.addEventListener('wheel',event=>{
      if(!event.cancelable || event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX)>=Math.abs(event.deltaY))return;
      const maximum=track.scrollWidth-track.clientWidth;
      if(maximum<=0)return;
      // Browser zoom can leave a fractional gap against integer scroll dimensions.
      if((event.deltaY>0 && maximum-track.scrollLeft<=1) || (event.deltaY<0 && track.scrollLeft<=1))return;
      const unit=event.deltaMode===1?16:event.deltaMode===2?track.clientWidth:1;
      const next=Math.max(0,Math.min(maximum,track.scrollLeft+event.deltaY*unit));
      if(next===track.scrollLeft)return;
      event.preventDefault();
      track.scrollLeft=next;
    },{passive:false});
    item.querySelectorAll('[data-preview-select]').forEach(button=>button.addEventListener('click',()=>select(Number(button.dataset.previewIndex))));
    item.querySelector('[data-preview-prev]')?.addEventListener('click',()=>select(active-1));
    item.querySelector('[data-preview-next]')?.addEventListener('click',()=>select(active+1));
  });
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const bounds=dialog.getBoundingClientRect();
    if(event.clientX<bounds.left || event.clientX>bounds.right || event.clientY<bounds.top || event.clientY>bounds.bottom)dialog.close();
  });
  dialog.addEventListener('keydown',event=>{
    if(!event.target?.closest('[data-more-work-track]') && panel?.querySelectorAll('[data-preview-slide]').length>1 && (event.key==='ArrowLeft'||event.key==='ArrowRight')){event.preventDefault();select(active+(event.key==='ArrowLeft'?-1:1));}
    if(event.key!=='Tab')return;
    const controls=[...dialog.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]')].filter(node=>!node.closest('[hidden]'));
    const first=controls[0],last=controls.at(-1);
    if((event.shiftKey&&document.activeElement===first)||(!event.shiftKey&&document.activeElement===last)){
      event.preventDefault();(event.shiftKey?last:first).focus();
    }
  });
  dialog.addEventListener('close',()=>{
    document.documentElement.classList.remove('preview-open');opener?.focus({preventScroll:true});
  });
}
