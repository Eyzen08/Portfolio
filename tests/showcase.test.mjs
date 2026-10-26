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
      assert.equal((gallery.match(/data-preview-slide/g)||[]).length,4);
      assert.match(gallery,/Owner-Supplied Mockup/);
    });
  }
});
test('both projects use four landscape presentation assets without additional device frames',async()=>{
  assert.deepEqual(projects[0].previewScreens.map(s=>s.id),['landing','signin','dashboard','workflows']);
  assert.deepEqual(projects[1].previewScreens.map(s=>s.id),['home','quiz','story','settings']);
  for(const project of projects)for(const screen of project.previewScreens){
    assert.equal(screen.width,project.id==='sti-vio-log'?1920:1536);assert.equal(screen.height,project.id==='sti-vio-log'?1080:1024);
    assert.match(screen.src,project.id==='sti-vio-log'?/-v3\.webp$/:/kwiztorya-mockup-(home|quiz|story|settings)\.webp$/);
    assert.equal(screen.deviceFrame,true);assert.equal(screen.kind,'desktop');
    assert.equal(screen.presentationLabel,'Owner-Supplied Mockup');
    assert.ok(!screen.originalSrc,'Private source captures must not become public original links');
    for(const name of ['src','srcSmall'])assert.equal((await readFile(new URL(`..${screen[name]}`,import.meta.url))).subarray(8,12).toString(),'WEBP');
  }
});

test('STI v3 PNG masters use the requested export dimensions',async()=>{
  for(const subject of ['overview','signin','dashboard','workflows']){
    const png=await readFile(new URL(`../design/project-showcase/sti-${subject}-v3.png`,import.meta.url));
    assert.equal(png.subarray(1,4).toString(),'PNG');
    assert.equal(png.readUInt32BE(16),1920);assert.equal(png.readUInt32BE(20),1080);
  }
});
