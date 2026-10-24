import test from 'node:test';
import assert from 'node:assert/strict';

test('a refresh cannot leave old activity presented as current data', async t => {
  const names = ['document', 'matchMedia', 'localStorage', 'fetch','IntersectionObserver','setInterval'];
  const original = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  t.after(() => names.forEach(name => { const descriptor = original.get(name); if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; }));
  function element() {
    return { hidden: true, children: [], textContent: '', className: '', listeners: {}, style: {},
      setAttribute() {}, append(...children) { this.children.push(...children); }, replaceChildren() { this.children = []; },
      addEventListener(type, callback) { this.listeners[type] = callback; } };
  }
  const selectors = ['[data-github-status]', '[data-github-stats]', '[data-repos]', '[data-followers]', '[data-calendar-label]', '[data-calendar]', '[data-calendar-days]', '[data-calendar-section]', '[data-events]', '[data-github-retry]'];
  const nodes = new Map(selectors.map(selector => [selector, element()]));
  nodes.get('[data-github-stats]').querySelector = selector => nodes.get(selector);
  const github = element(); github.querySelector = selector => nodes.get(selector);
  const docListeners={};
  globalThis.document = { hidden:false, documentElement: { dataset: {} }, querySelector: selector => selector === '[data-github]' ? github : null, querySelectorAll: () => [], createElement: element, addEventListener(type,fn) {docListeners[type]=fn;} };
  let interval,intersect;
  globalThis.setInterval=(fn,ms)=>{assert.equal(ms,300000);interval=fn;};
  globalThis.IntersectionObserver=class{constructor(fn){intersect=fn;}observe(){}};
  globalThis.matchMedia = () => ({ matches: false, addEventListener() {} });
  globalThis.localStorage = { getItem: () => null };
  const response = { profile: { login: 'Eyzen08', publicRepos: 7, followers: 1 }, fetchedAt: new Date().toISOString(), recentEvents: [], calendar: { total: 10, from: '2026-10-11', to: '2026-10-15', weeks: [{ days: [
    {date:'2026-10-11',count:0,level:0},{date:'2026-10-12',count:1,level:1},
    {date:'2026-10-13',count:2,level:2},{date:'2026-10-14',count:3,level:3},{date:'2026-10-15',count:4,level:4}
  ] }] } };
  const calendar = response.calendar;
  globalThis.fetch = async () => ({ ok: true, json: async () => response });
  await import('../assets/app.js?calendar-regression');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(nodes.get('[data-calendar-section]').hidden, false);
  assert.equal(typeof interval,'function');
  assert.equal(nodes.get('[data-calendar-label]').textContent, '10 contributions in the last year');
  const cells=nodes.get('[data-calendar]').children[0].children;
  assert.deepEqual(cells.map(cell=>cell.className),['calendar-day level-0','calendar-day level-1','calendar-day level-2','calendar-day level-3','calendar-day level-4']);
  assert.deepEqual(cells.map(cell=>cell.style.gridRow),['1','2','3','4','5']);
  assert.equal(cells[0].title,'2026-10-11: 0 contributions');
  assert.equal(nodes.get('[data-calendar-days]').children.length,5);
  response.calendar={...calendar,total:0,weeks:[{days:[{date:'2026-10-13',count:0,level:0}]}]};
  await nodes.get('[data-github-retry]').listeners.click();
  assert.equal(nodes.get('[data-calendar-label]').textContent,'0 contributions in the last year');
  assert.equal(nodes.get('[data-calendar-section]').hidden,false);
  response.calendar = null;
  await nodes.get('[data-github-retry]').listeners.click();
  assert.equal(nodes.get('[data-calendar-section]').hidden, true);
  response.calendar = calendar;
  await nodes.get('[data-github-retry]').listeners.click();
  assert.equal(nodes.get('[data-calendar-section]').hidden, false);
  globalThis.fetch = async () => ({ ok: false });
  await nodes.get('[data-github-retry]').listeners.click();
  assert.equal(nodes.get('[data-calendar-section]').hidden, true);
  assert.equal(nodes.get('[data-github-stats]').hidden, true);
  assert.equal(nodes.get('[data-events]').children.length, 0);
  let calls=0;
  globalThis.fetch=async()=>{calls++;return {ok:true,json:async()=>response};};
  globalThis.document.hidden=true;intersect([{isIntersecting:true}]);interval();
  assert.equal(calls,0);
  globalThis.document.hidden=false;interval();await new Promise(resolve=>setImmediate(resolve));
  assert.equal(calls,1);
  globalThis.fetch=async()=>({ok:false,status:429,headers:{get:()=> '600'}});
  await nodes.get('[data-github-retry]').listeners.click();
  globalThis.fetch=async()=>{calls++;return {ok:true,json:async()=>response};};
  await nodes.get('[data-github-retry]').listeners.click();interval();
  assert.equal(calls,1,'Retry-After prevents manual and automatic retry storms');
});
