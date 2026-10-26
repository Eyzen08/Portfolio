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
      if (state.visible && !document.hidden && !hovered && !focused && group.dataset.previewOpen !== 'true' && cards.length > 1) timer = setTimeout(() => { select(active + 1); state.sync(); }, 4000);
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
}

export function initProjectPreviews() {
  document.querySelectorAll('[data-project-preview]').forEach(card => {
    const dialog = card.querySelector('dialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const slides = [...dialog.querySelectorAll('[data-preview-slide]')];
    const buttons = [...dialog.querySelectorAll('[data-preview-select]')];
    const counter = dialog.querySelector('[data-preview-count]');
    let active = 0, opener;
    const select = index => {
      active = galleryIndex(0, index, slides.length);
      slides.forEach((slide,index) => { slide.hidden = index !== active; });
      buttons.forEach((button,index) => button.setAttribute('aria-pressed', String(index === active)));
      counter.textContent = `${active + 1} / ${slides.length}`;
    };
    card.querySelectorAll('[data-preview-open]').forEach(link => link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (dialog.open) return;
      opener = event.currentTarget;
      const frames = [...card.querySelectorAll('[data-deck-card]')];
      select(Math.max(0, frames.findIndex(frame => frame.dataset.selected === 'true')));
      card.dataset.previewOpen = 'true';
      card.dispatchEvent(new Event('previewchange'));
      document.documentElement.classList.add('preview-open');
      dialog.showModal();
    }));
    buttons.forEach(button => button.addEventListener('click', () => select(Number(button.dataset.previewIndex))));
    dialog.querySelector('[data-preview-prev]').addEventListener('click', () => select(active - 1));
    dialog.querySelector('[data-preview-next]').addEventListener('click', () => select(active + 1));
    dialog.querySelector('[data-preview-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      select(active + (event.key === 'ArrowLeft' ? -1 : 1));
    });
    dialog.addEventListener('close', () => {
      delete card.dataset.previewOpen;
      document.documentElement.classList.remove('preview-open');
      opener?.focus({ preventScroll: true });
      card.dispatchEvent(new Event('previewchange'));
    });
  });
}

export function initCertificatePreviews() {
  const dialog=document.querySelector('[data-certificate-viewer]');
  if(!dialog || typeof dialog.showModal!=='function')return;
  const image=dialog.querySelector('[data-certificate-image]');
  const title=dialog.querySelector('[data-certificate-title]');
  const original=dialog.querySelector('[data-certificate-document]');
  const error=dialog.querySelector('[data-certificate-error]');
  const close=dialog.querySelector('[data-certificate-close]');
  let opener;
  document.querySelectorAll('[data-certificate-open]').forEach(link=>{
    const fallback=link.closest('.home-certificate,.certification-card').querySelector('[data-certificate-original]');
    fallback.hidden=true;
    link.setAttribute('aria-haspopup','dialog');
    link.setAttribute('aria-controls','certificate-viewer');
    link.setAttribute('aria-label',`Preview ${link.dataset.certificateTitle} certificate`);
    link.addEventListener('click',event=>{
      if(event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
      if(dialog.open){event.preventDefault();return;}
      const thumbnail=link.querySelector('img');
      image.hidden=false;error.hidden=true;
      image.alt=thumbnail.alt;image.width=thumbnail.width;image.height=thumbnail.height;
      image.src=thumbnail.getAttribute('src');
      title.textContent=link.dataset.certificateTitle;
      original.href=fallback.href;
      original.textContent=`Open Original ${fallback.dataset.documentKind}`;
      original.setAttribute('aria-label',`${original.textContent} (opens in a new tab)`);
      try{dialog.showModal();}catch{fallback.hidden=false;return;}
      event.preventDefault();opener=link;
      document.documentElement.classList.add('preview-open');
    });
  });
  image.addEventListener('error',()=>{image.hidden=true;error.hidden=false;});
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    if((event.shiftKey&&document.activeElement===close)||(!event.shiftKey&&document.activeElement===original)){
      event.preventDefault();(event.shiftKey?original:close).focus();
    }
  });
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const bounds=dialog.getBoundingClientRect();
    if(event.clientX<bounds.left || event.clientX>bounds.right || event.clientY<bounds.top || event.clientY>bounds.bottom)dialog.close();
  });
  dialog.addEventListener('close',()=>{
    document.documentElement.classList.remove('preview-open');
    opener?.focus({preventScroll:true});
  });
}
