const styles={light:'https://tiles.openfreemap.org/styles/positron',dark:'https://tiles.openfreemap.org/styles/dark'};

function unavailable(root){
  root.querySelector('[data-map-canvas]').hidden=true;
  const status=root.querySelector('[data-map-status]');
  status.hidden=false;status.textContent='Taguig City, Philippines. Map unavailable right now.';
}

export function mountLocationMap(root,library){
  const container=root.querySelector('[data-map-canvas]');
  const status=root.querySelector('[data-map-status]');
  try{
    library.setWorkerUrl(new URL('./vendor/maplibre/maplibre-gl-worker.mjs',import.meta.url).href);
    container.hidden=false;
    let theme=document.documentElement.dataset.theme==='dark'?'dark':'light';
    const map=new library.Map({container,style:styles[theme],center:[121.05,14.52],zoom:11.5,cooperativeGestures:true,attributionControl:{compact:true}});
    map.scrollZoom.disable();
    const ready=()=>{status.hidden=true;};
    map.on('load',()=>{
      ready();
      // MapLibre initially expands compact credits; visitors can reopen them with its info button.
      const attribution=container.querySelector('.maplibregl-ctrl-attrib');
      attribution?.classList.remove('maplibregl-compact-show');
      attribution?.removeAttribute('open');
    });
    map.on('idle',ready);
    map.on('error',()=>{status.hidden=false;status.textContent='Some Taguig City map details could not load. Please try again later.';});
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
