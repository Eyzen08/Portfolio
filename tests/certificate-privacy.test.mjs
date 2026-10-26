import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { renderPages, shell } from '../scripts/templates.mjs';
import { buildSite } from '../scripts/build.mjs';
const [profile,projects,technologies]=await Promise.all(['profile','projects','technologies'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url)))));
const pages=renderPages({profile,projects,technologies});

test('public signature-redacted PNGs retain the verified image pixels and dimensions',async()=>{
  const hashes={
    'cyber-threat-management-redacted.png':'b040d280bc33580bea19b178884b0bdb93db8ef873237e4584c2246a5c87b2ba',
    'cybersecurity-quality-assurance-redacted.png':'8301bd370a8fba68de50354696b2a9649d372d58098cccc4390157e52ae1653b',
    'code-to-success-redacted.png':'986e243747952c7f1017b28535500b7ac20bcfff9aa924ba74f67c6e91a874ce',
    'lego-robotics-training-redacted.png':'9955657f436019d245b9950241d242a5be2328ddb3ca8f16880f37b0cf496707'
  };
  for(const [name,hash] of Object.entries(hashes)){
    const bytes=await readFile(new URL(`../assets/certifications/${name}`,import.meta.url));
    const item=profile.certifications.find(item=>basename(item.preview.src)===name);
    assert.ok(item,name);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);
    assert.equal(bytes.subarray(1,4).toString(),'PNG');
    assert.equal(bytes.readUInt32BE(16),item.preview.width);
    assert.equal(bytes.readUInt32BE(20),item.preview.height);
  }
});

test('all seven certificates are static previews without original-document destinations',()=>{
  for(const route of ['/','/training/']){
    const html=pages.find(page=>page.route===route).content;
    assert.equal((html.match(/<figure class="certificate-preview">/g)||[]).length,7);
    assert.doesNotMatch(html,/data-certificate-(?:open|viewer|original)|href="\/assets\/certifications\//);
    for(const item of profile.certifications){
      assert.equal(item.documentUrl,undefined);
      assert.ok(html.includes(`src="${item.preview.src}"`));
    }
  }
});

test('Certificates navigation reuses Home section tracking and the existing detailed route',()=>{
  for(const page of pages){
    const header=shell(page,{profile}).match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0];
    assert.match(header,page.route==='/'?/href="#training"[^>]*>Certificates<\//:/href="\/training\/"[^>]*>Certificates<\//);
    if(page.route==='/training/')assert.match(header,/href="\/training\/"[^>]*aria-current="page"/);
  }
});

test('clean and repeated builds publish exactly the approved certificate previews',async t=>{
  const outDir=await mkdtemp(join(tmpdir(),'portfolio-certificate-privacy-'));
  t.after(()=>rm(outDir,{recursive:true,force:true}));
  const certificateDir=join(outDir,'assets','certifications');
  const expected=profile.certifications.map(item=>basename(item.preview.src)).sort();
  await buildSite({outDir});
  assert.deepEqual((await readdir(certificateDir)).sort(),expected);
  for(const name of ['cyber-threat-management.pdf','code-to-success.jpg','lego-robotics-training.webp'])await writeFile(join(certificateDir,name),'stale unredacted original');
  await buildSite({outDir});
  assert.deepEqual((await readdir(certificateDir)).sort(),expected);
  for(const item of profile.certifications){
    const actual=await readFile(join(certificateDir,basename(item.preview.src)));
    assert.deepEqual(actual,await readFile(new URL(`..${item.preview.src}`,import.meta.url)));
  }
});
