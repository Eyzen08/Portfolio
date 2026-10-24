import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
const dev = await import('../scripts/dev.mjs').catch(() => null);

test('local preview serves routes and refuses encoded traversal', async () => {
  assert.equal(typeof dev?.createDevServer, 'function', 'Local preview is not implemented yet');
  const server = dev.createDevServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    const page=await fetch(`${origin}/projects/sti-vio-log/`);
    assert.equal(page.status,200);
    const policy=page.headers.get('content-security-policy');
    assert.match(policy,/connect-src 'self' https:\/\/formspree.io https:\/\/tiles.openfreemap.org/);
    assert.match(policy,/worker-src 'self'/);
    assert.doesNotMatch(policy,/unsafe-eval|unsafe-inline/);
    assert.equal((await fetch(`${origin}/assets/site.css`)).headers.get('content-type'), 'text/css; charset=utf-8');
    const missing = await fetch(`${origin}/does-not-exist/`);
    assert.equal(missing.status, 404);
    assert.match(await missing.text(), /This Page Took/);
    assert.equal((await fetch(`${origin}/%2e%2e%2fpackage.json`)).status, 400);
    assert.equal((await fetch(`${origin}/`, { method: 'POST' })).status, 405);
    const head = await fetch(`${origin}/`, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
  } finally { await new Promise(resolve => server.close(resolve)); }
});
