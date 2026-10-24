import test from 'node:test';
import assert from 'node:assert/strict';

test('contact confirms only successful responses, retains failed messages and prevents duplicate submissions', async t=>{
  const names=['document','matchMedia','localStorage','fetch','FormData'];
  const original=new Map(names.map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));
  t.after(()=>names.forEach(name=>original.get(name)?Object.defineProperty(globalThis,name,original.get(name)):delete globalThis[name]));
  const button={disabled:false,textContent:'Send Inquiry'};
  const status={textContent:''};
  const form={dataset:{},action:'https://formspree.io/f/xnjekjdq',resets:0,
    querySelector:s=>s==='[data-form-status]'?status:button,
    addEventListener(type,fn){this[type]=fn;},reset(){this.resets++;}};
  globalThis.document={documentElement:{dataset:{}},querySelector:s=>s==='[data-contact-form]'?form:null,querySelectorAll:()=>[],addEventListener(){}};
  globalThis.matchMedia=()=>({matches:false,addEventListener(){}});
  globalThis.localStorage={getItem:()=>null};
  globalThis.FormData=class {constructor(value){assert.equal(value,form);}};
  await import('../assets/app.js?contact-regression');
  let resolveRequest,calls=0;
  globalThis.fetch=(url,options)=>{calls++;assert.equal(url,form.action);assert.equal(options.method,'POST');return new Promise(resolve=>{resolveRequest=resolve;});};
  const pending=form.submit({preventDefault(){}});
  assert.equal(button.disabled,true);assert.equal(status.textContent,'');
  await form.submit({preventDefault(){}});assert.equal(calls,1);
  resolveRequest({ok:true});await pending;
  assert.match(status.textContent,/was submitted/);assert.equal(form.resets,1);
  for(const fetchResult of [async()=>({ok:false}),async()=>{throw new Error('Network unavailable');}]){
    globalThis.fetch=fetchResult;await form.submit({preventDefault(){}});
    assert.match(status.textContent,/could not be confirmed/);assert.equal(form.resets,1,'Failed inquiry text must be retained');
    assert.equal(button.disabled,false);assert.equal(form.dataset.pending,'false');assert.equal(button.textContent,'Send Inquiry');
  }
});
