import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderPages} from '../scripts/templates.mjs';
const [profile,projects,technologies]=await Promise.all(['profile','projects','technologies'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url)))));
const pages=renderPages({profile,projects,technologies});
test('Home and Projects share static composed covers, one Featured project and complete independent viewers',()=>{
  for(const route of ['/','/projects/']){
    const html=pages.find(page=>page.route===route).content;
    const rows=[...html.matchAll(/<article class="(?:project-feature|project-card)[\s\S]*?<\/article>/g)].map(m=>m[0]);
    assert.equal(rows.length,2);
    assert.equal((html.match(/class="featured-badge"/g)||[]).length,1);
    rows.forEach((row,i)=>{
      assert.match(row,/class="showcase-cover[ "]/);
      assert.doesNotMatch(row,/data-deck-compact|data-deck-card/);
      assert.ok(row.includes(`href="${projects[i].previewScreens[0].src}"`));
      assert.ok(row.includes(`href="/projects/${projects[i].id}/"`));
      assert.ok(row.includes(`href="${projects[i].sourceUrl}"`));
      assert.match(row,/class="brand-icon/);
      const gallery=i===0 ? html.match(/<dialog[^>]*data-project-viewer[\s\S]*?<\/dialog>/)[0] : row;
      assert.equal((gallery.match(/data-preview-slide/g)||[]).length,1);
      assert.doesNotMatch(gallery,/data-preview-prev|data-preview-next|data-preview-count|data-preview-select/);
      assert.match(gallery,/Owner-Supplied Mockup/);
    });
  }
});
test('each project selects one original PNG with a matching optimized thumbnail',async()=>{
  assert.deepEqual(projects.map(p=>p.previewScreens.length),[1,1]);
  for(const project of projects)for(const screen of project.previewScreens){
    assert.equal(screen.width,project.id==='sti-vio-log'?3840:1536);assert.equal(screen.height,project.id==='sti-vio-log'?2160:1024);
    if(project.id==='sti-vio-log'){
      assert.equal(screen.src,'/assets/projects/sti-vio-log-overview-v8-4k.png');
      assert.equal(screen.srcSmall,'/assets/projects/sti-vio-log-mockup-overview-v8-small.webp');
    }else{
      assert.equal(screen.src,'/assets/projects/kwiztorya-history-showcase.png');
      assert.equal(screen.srcSmall,'/assets/projects/kwiztorya-history-showcase-small.webp');
    }
    assert.equal(screen.deviceFrame,true);assert.equal(screen.kind,'desktop');
    assert.equal(screen.presentationLabel,'Owner-Supplied Mockup');
    assert.ok(!screen.originalSrc,'Private source captures must not become public original links');
    const png=await readFile(new URL(`..${screen.src}`,import.meta.url));
    assert.equal(png.subarray(1,4).toString(),'PNG');
    assert.equal(png.readUInt32BE(16),screen.width);assert.equal(png.readUInt32BE(20),screen.height);
    assert.equal((await readFile(new URL(`..${screen.srcSmall}`,import.meta.url))).subarray(8,12).toString(),'WEBP');
  }
});

test('selected STI PNG masters use the requested export dimensions',async()=>{
  for(const subject of ['overview','signin','dashboard','workflows']){
    const version=subject==='overview'?'v8':'v3';
    const png=await readFile(new URL(`../design/project-showcase/sti-${subject}-${version}.png`,import.meta.url));
    assert.equal(png.subarray(1,4).toString(),'PNG');
    assert.equal(png.readUInt32BE(16),1920);assert.equal(png.readUInt32BE(20),1080);
  }
});

test('STI overview also provides a 4K PNG master',async()=>{
  const png=await readFile(new URL('../design/project-showcase/sti-overview-v8-4k.png',import.meta.url));
  assert.equal(png.subarray(1,4).toString(),'PNG');
  assert.equal(png.readUInt32BE(16),3840);assert.equal(png.readUInt32BE(20),2160);
  const published=await readFile(new URL(`..${projects[0].previewScreens[0].src}`,import.meta.url));
  assert.ok(png.equals(published),'The published STI image must be the unchanged 4K PNG');
});

test('case studies are static and old project images are absent from rendered views',()=>{
  for(const project of projects){
    const html=pages.find(page=>page.route===`/projects/${project.id}/`).content;
    assert.doesNotMatch(html,/data-picture-deck|data-deck-kind="project"|data-deck-controls|data-deck-select/);
    assert.ok(html.includes(`src="${project.previewScreens[0].src}"`));
  }
  for(const page of pages)assert.doesNotMatch(page.content,/sti-vio-log-mockup-(?:signin|dashboard|workflows)-v3|kwiztorya-mockup-(?:home|quiz|story|settings)/);
});
