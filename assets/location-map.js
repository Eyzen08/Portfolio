const styles={light:'https://tiles.openfreemap.org/styles/positron',dark:'https://tiles.openfreemap.org/styles/dark'};

function unavailable(root){
  root.querySelector('[data-map-canvas]').hidden=true;
  root.querySelector('[data-map-toggle]').hidden=true;
  root.querySelector('[data-map-controls]').hidden=true;
  const status=root.querySelector('[data-map-status]');
  status.hidden=false;status.textContent='Map unavailable. Use Open Full Map to explore Taguig City.';
}

export function mountLocationMap(root,library){
  const container=root.querySelector('[data-map-canvas]');
  const status=root.querySelector('[data-map-status]');
  const toggle=root.querySelector('[data-map-toggle]');
  const controls=root.querySelector('[data-map-controls]');
  try{
    library.setWorkerUrl(new URL('./vendor/maplibre/maplibre-gl-worker.mjs',import.meta.url).href);
    container.hidden=false;
    let theme=document.documentElement.dataset.theme==='dark'?'dark':'light';
    const map=new library.Map({container,style:styles[theme],center:[121.05,14.52],zoom:11.5,cooperativeGestures:true,attributionControl:{compact:false}});
    map.scrollZoom.disable();
    map.addControl(new library.NavigationControl({showCompass:false}),'top-right');
    controls.append(container.querySelector('.maplibregl-ctrl-top-right'));
    toggle.addEventListener('click',()=>{
      const exploring=controls.hidden;
      if(!exploring&&controls.contains(document.activeElement))toggle.focus();
      controls.hidden=!exploring;
      toggle.setAttribute('aria-expanded',String(exploring));
      toggle.textContent=exploring?'Done exploring':'Explore map';
    });
    const ready=()=>{status.hidden=true;toggle.hidden=false;};
    map.on('load',ready);
    map.on('idle',ready);
    map.on('error',()=>{status.hidden=false;status.textContent='Some map details could not load. Use Open Full Map to explore Taguig City.';});
    new MutationObserver(()=>{
      const next=document.documentElement.dataset.theme==='dark'?'dark':'light';
      if(next!==theme){theme=next;map.setStyle(styles[theme]);}
    }).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    new ResizeObserver(()=>map.resize()).observe(container);
    return map;
  }catch{unavailable(root);return null;}
}

export function initLocationMap(){
  const root=document.querySelector('[data-location-map]');
  if(!root)return;
  const observer=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;
    observer.disconnect();
    import('./vendor/maplibre/maplibre-gl.mjs').then(library=>mountLocationMap(root,library)).catch(()=>unavailable(root));
  },{rootMargin:'200px'});
  observer.observe(root);
}
