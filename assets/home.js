export const galleryIndex = (current, delta, count, reset = false) => reset || count < 2 ? 0 : ((current + delta) % count + count) % count;
export const deckOffset = (index, active, count) => ((index - active + count + Math.floor(count / 2)) % count) - Math.floor(count / 2);
export const motionAllowed = ({ hidden, visible, interacting }) => !hidden && visible && !interacting;
export function spherePoints(count) {
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - 2 * (i + .5) / count;
    const radius = Math.sqrt(1 - y * y), angle = i * Math.PI * (3 - Math.sqrt(5));
    return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
  });
}
export function projectPoint(point, angle) {
  const x = point.x * Math.cos(angle) + point.z * Math.sin(angle);
  const z = point.z * Math.cos(angle) - point.x * Math.sin(angle);
  const scale = 2.5 / (2.5 - z * .5);
  return { x: x * scale, y: point.y * scale, z, scale };
}

export function sphereMesh() {
  const point=(latitude,longitude)=>{
    const phi=-Math.PI/2+latitude*Math.PI/12,theta=longitude*Math.PI*2/24;
    return {x:Math.cos(phi)*Math.cos(theta),y:Math.sin(phi),z:Math.cos(phi)*Math.sin(theta)};
  };
  const lines=[];
  for(let lat=0;lat<12;lat++)for(let lon=0;lon<24;lon++){
    lines.push([point(lat,lon),point(lat+1,lon)]);
    lines.push([point(lat,lon),point(lat+1,lon+1)]);
    if(lat>0)lines.push([point(lat,lon),point(lat,lon+1)]);
  }
  return lines;
}

export function currentSection(sections, viewportHeight) {
  let active = sections[0]?.id;
  for (const section of sections) if (section.top <= viewportHeight * .4) active = section.id;
  return active;
}
export function initHome() {
  const sphere = document.querySelector('[data-sphere]');
  const presentation = sphere?.querySelector('[data-sphere-presentation]');
  const strip = document.querySelector('[data-moving-strip]');
  let frame = 0, last = 0, angle = 0;
  const visible = new Map([presentation,strip].filter(Boolean).map(element=>[element,false]));
  const running = element => motionAllowed({ hidden: document.hidden, visible: visible.get(element), interacting: false }) && document.documentElement.dataset.motion!=='reduced';

  const gallery = document.querySelector('[data-gallery]');
  const photos = [...(gallery?.querySelectorAll('[data-gallery-frame]') || [])];
  if (photos.length > 1) {
    let current = 0;
    gallery.dataset.enhanced = 'true';
    gallery.querySelector('[data-gallery-controls]').hidden = false;
    const selectPhoto = (delta, reset = false) => {
      current = galleryIndex(current,delta,photos.length,reset);
      photos.forEach((photo,i)=>{photo.hidden = i !== current;});
      const img = photos[current].querySelector('img');
      gallery.querySelector('[data-gallery-caption]').textContent = img.alt;
      img.animate?.([{opacity:.4},{opacity:1}],{duration:220});
    };
    gallery.querySelector('[data-gallery-prev]').addEventListener('click',()=>selectPhoto(-1));
    gallery.querySelector('[data-gallery-next]').addEventListener('click',()=>selectPhoto(1));
    gallery.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')selectPhoto(1);});
    gallery.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse')selectPhoto(0,true);});
    gallery.addEventListener('focusout',event=>{if(!gallery.contains(event.relatedTarget))selectPhoto(0,true);});
    selectPhoto(0,true);
  }

  const canvas = sphere?.querySelector('canvas');
  const context = canvas?.getContext('2d');
  const sphereItems = [...(sphere?.querySelectorAll('[data-sphere-item]') || [])];
  const points = spherePoints(sphereItems.length);
  const mesh = sphereMesh();
  const images = sphereItems.map(item=>{const image=new Image();image.src=item.querySelector('img').src;image.onload=()=>draw();return image;});
  const name = sphere?.querySelector('[data-sphere-name]');
  let pointer = null, projected = [];
  function draw() {
    if(!context)return;
    const width = canvas.clientWidth || 640, height = width * 520/640;
    const dpr = Math.min(window.devicePixelRatio || 1,2);
    if(canvas.width !== Math.round(width*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
    context.setTransform(dpr,0,0,dpr,0,0);context.clearRect(0,0,width,height);
    const radius = width*.34;
    const dark=document.documentElement.dataset.theme==='dark';
    context.strokeStyle=dark?'#c4adfa':'#9176c1';context.lineWidth=.65;
    for(const line of mesh){
      const a=projectPoint(line[0],angle),b=projectPoint(line[1],angle);
      context.globalAlpha=(dark?.04:.025)+((a.z+b.z)/2+1)*(dark?.065:.05);
      context.beginPath();context.moveTo(width/2+a.x*radius,height/2+a.y*radius);
      context.lineTo(width/2+b.x*radius,height/2+b.y*radius);context.stroke();
    }
    context.globalAlpha=dark?.22:.17;context.beginPath();context.arc(width/2,height/2,radius*1.021,0,Math.PI*2);context.stroke();
    projected = points.map((p,i)=>({ ...projectPoint(p,angle), index:i }));
    projected.sort((a,b)=>a.z-b.z);
    let closest = null, distance = 32;
    for(const p of projected){
      p.screenX = width/2+p.x*radius;p.screenY = height/2+p.y*radius;
      const size = Math.max(20,width*.055)*p.scale;
      if(pointer){const d=Math.hypot(pointer.x-p.screenX,pointer.y-p.screenY);if(d<distance){distance=d;closest=p;}}
      context.globalAlpha = .45+(p.z+1)*.275;
      context.fillStyle = '#fafafd';context.beginPath();context.arc(p.screenX,p.screenY,size*.82,0,Math.PI*2);context.fill();
      const img=images[p.index];if(img?.complete && img.naturalWidth)context.drawImage(img,p.screenX-size/2,p.screenY-size/2,size,size);
    }
    context.globalAlpha=1;
    name.textContent=closest?sphereItems[closest.index].dataset.name:'Explore the Technologies';
  }
  if(context){
    presentation.hidden=false;
    new ResizeObserver(draw).observe(canvas);
    new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    canvas.addEventListener('pointermove',event=>{const rect=canvas.getBoundingClientRect();pointer={x:event.clientX-rect.left,y:event.clientY-rect.top};draw();});
    canvas.addEventListener('pointerleave',()=>{pointer=null;draw();});
    draw();
  }

  function tick(time) {
    frame = 0;
    const delta = last ? Math.min(time-last,64) : 0; last = time;
    if(context && running(presentation)){angle+=delta*Math.PI*2/52000;draw();}
    if(context && running(presentation)) frame=requestAnimationFrame(tick);
  }
  function sync() {
    if(strip)strip.dataset.running=String(running(strip));
    if(frame)cancelAnimationFrame(frame);frame=0;last=0;
    if(context && running(presentation))frame=requestAnimationFrame(tick);
  }
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)visible.set(entry.target,entry.isIntersecting);sync();},{threshold:.1});
  for(const element of visible.keys())observer.observe(element);
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('motionchange',sync);
  sync();

  const links=[...document.querySelectorAll('[data-section-link]')];
  const sections=links.map(link=>document.getElementById(link.dataset.sectionLink)).filter(Boolean);
  const updateSection = () => {
    const active=sections[0]?.getBoundingClientRect().top > window.innerHeight*.4 ? null : currentSection(sections.map(section=>({id:section.id,top:section.getBoundingClientRect().top})),window.innerHeight);
    for(const link of links){if(link.dataset.sectionLink===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
  };
  window.addEventListener('scroll',updateSection,{passive:true});
  window.addEventListener('resize',updateSection);
  updateSection();

}
