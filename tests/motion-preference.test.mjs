import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const source=await readFile(new URL('../assets/theme-init.js',import.meta.url),'utf8');

test('motion starts full under either OS preference and restores only an explicit reduced choice',()=>{
  for(const saved of [null,'full','reduced','invalid','blocked']){
    const root={dataset:{}};
    runInNewContext(source,{
      document:{documentElement:root,querySelector:()=>null},
      matchMedia:()=>({matches:true}),
      localStorage:{getItem(key){if(saved==='blocked')throw Error('Storage unavailable');return key==='ej-motion'?saved:null;}}
    });
    assert.equal(root.dataset.motion,saved==='reduced'?'reduced':'full');
  }
});
