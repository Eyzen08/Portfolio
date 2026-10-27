import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import handler from '../api/github.js';

const originalFetch = globalThis.fetch;
const originalToken = process.env.GITHUB_TOKEN;
const profile = {
  login: 'Eyzen08', name: 'EJ', html_url: 'https://github.com/Eyzen08',
  public_repos: 9, followers: 3, email: 'private@example.com', total_private_repos: 5,
};
const event = {
  id: '123', type: 'PushEvent', actor: { login: 'Eyzen08' },
  repo: { name: 'Eyzen08/Portfolio', url: 'https://api.github.com/repos/Eyzen08/Portfolio' },
  public: true, created_at: '2026-10-12T10:00:00Z',
  payload: { commits: [{ message: 'Do not expose commit messages' }] },
};

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalToken === undefined) delete process.env.GITHUB_TOKEN;
  else process.env.GITHUB_TOKEN = originalToken;
});

function publicResponses(events = [event], user = profile) {
  delete process.env.GITHUB_TOKEN;
  globalThis.fetch = async (url, options) => {
    assert.equal(options.headers.Authorization, process.env.GITHUB_TOKEN ? `Bearer ${process.env.GITHUB_TOKEN}` : undefined);
    assert.ok(options.signal instanceof AbortSignal);
    assert.equal(options.redirect, 'error');
    if (url === 'https://api.github.com/users/Eyzen08') return Response.json(user);
    if (url === 'https://api.github.com/users/Eyzen08/events/public?per_page=30') return Response.json(events);
    throw new Error('Unexpected network target');
  };
}

async function request(method = 'GET', url = '/api/github') {
  const response = {
    headers: {}, code: 200,
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
  await handler({ method, url, query: {} }, response);
  return response;
}

test('rejects non-GET requests before contacting GitHub', async () => {
  globalThis.fetch = () => { throw new Error('Network must not run'); };
  const response = await request('POST');
  assert.equal(response.code, 405);
  assert.equal(response.headers.allow, 'GET');
});

test('rejects custom usernames and upstream URLs before contacting GitHub', async () => {
  globalThis.fetch = () => { throw new Error('Network must not run'); };
  const response = await request('GET', '/api/github?username=another&url=https://example.com');
  assert.equal(response.code, 400);
});

test('returns public profile and events without inventing a calendar when no token exists', async () => {
  publicResponses();
  const response = await request();
  assert.equal(response.code, 200);
  assert.deepEqual(response.body.profile, {
    login: 'Eyzen08', name: 'EJ', url: 'https://github.com/Eyzen08', publicRepos: 9, followers: 3,
  });
  assert.deepEqual(response.body.recentEvents, [{
    id: '123', type: 'PushEvent', repo: 'Eyzen08/Portfolio',
    url: 'https://github.com/Eyzen08/Portfolio', date: '2026-10-12T10:00:00Z',
  }]);
  assert.equal(response.body.calendar, null);
  assert.ok(response.body.calendarUnavailable);
  assert.equal(response.body.status, 'fresh');
  assert.ok(Number.isFinite(Date.parse(response.body.fetchedAt)));
  assert.match(response.headers['cache-control'], /s-maxage=300,/);
  assert.match(response.headers['cache-control'], /stale-while-revalidate=/);
  assert.match(response.headers['cache-control'], /stale-if-error=/);
  assert.doesNotMatch(JSON.stringify(response.body), /private@example|total_private|commit messages/);
});

test('removes private, malformed, and unsafe event entries', async () => {
  publicResponses([
    event,
    { ...event, id: '124', public: false, repo: { name: 'Eyzen08/Secret', url: 'https://api.github.com/repos/Eyzen08/Secret' } },
    { ...event, id: '125', repo: { name: 'Eyzen08/Portfolio', url: 'https://github.com.evil.example/Portfolio' } },
    { ...event, id: '126', repo: { name: '../private', url: 'https://api.github.com/repos/../private' } },
    { ...event, id: '127', created_at: 'not-a-date' },
    { ...event, id: '128', type: '<script>unsafe</script>' },
  ]);
  const response = await request();
  assert.equal(response.code, 200);
  assert.equal(response.body.recentEvents.length, 1);
  assert.equal(response.body.recentEvents[0].id, '123');
});

test('discards a malformed actor without losing the other public events', async () => {
  publicResponses([event, { ...event, id: '129', actor: { login: 42 } }]);
  const response = await request();
  assert.equal(response.code, 200);
  assert.equal(response.body.recentEvents.length, 1);
});

test('rejects a profile URL outside the fixed GitHub account', async () => {
  publicResponses([], { ...profile, html_url: 'https://github.com.evil.example/Eyzen08' });
  const response = await request();
  assert.equal(response.code, 502);
  assert.match(response.headers['cache-control'], /no-store/);
});

test('reports upstream rate limits with a safe Retry-After value', async () => {
  delete process.env.GITHUB_TOKEN;
  globalThis.fetch = async () => Response.json({ message: 'sensitive upstream details' }, {
    status: 429, headers: { 'Retry-After': '120' },
  });
  const response = await request();
  assert.equal(response.code, 429);
  assert.equal(response.headers['retry-after'], '120');
  assert.match(response.headers['cache-control'], /no-store/);
  assert.doesNotMatch(JSON.stringify(response.body), /sensitive/);
});

test('treats a GitHub 403 with no remaining quota as a rate limit', async () => {
  delete process.env.GITHUB_TOKEN;
  globalThis.fetch = async () => Response.json({}, {
    status: 403, headers: { 'X-RateLimit-Remaining': '0' },
  });
  const response = await request();
  assert.equal(response.code, 429);
  assert.equal(response.headers['retry-after'], '60');
});

test('does not return exception text or server secrets', async () => {
  process.env.GITHUB_TOKEN = 'github-super-secret';
  globalThis.fetch = async () => { throw new Error('failed with github-super-secret'); };
  const response = await request();
  assert.equal(response.code, 502);
  assert.doesNotMatch(JSON.stringify(response.body), /github-super-secret|failed with/);
});

test('passes through public and private calendar counts without exposing private details or the token', async () => {
  publicResponses();
  const restFetch = globalThis.fetch;
  process.env.GITHUB_TOKEN = 'github-super-secret';
  globalThis.fetch = async (url, options) => {
    if (url !== 'https://api.github.com/graphql') return restFetch(url, options);
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Authorization, 'Bearer github-super-secret');
    assert.match(JSON.parse(options.body).query, /user\(login: "Eyzen08"\)/);
    return Response.json({ data: { user: { contributionsCollection: {
      startedAt: '2025-10-13T00:00:00Z', endedAt: '2026-10-13T00:00:00Z',
      restrictedContributionsCount: 2,
      privateRepository: { name: 'Secret-Project', payload: 'private-work-details' },
      contributionCalendar: { totalContributions: 3, weeks: [{ contributionDays: [
        { date: '2026-10-12', contributionCount: 0, contributionLevel: 'NONE' },
        { date: '2026-10-13', contributionCount: 3, contributionLevel: 'FOURTH_QUARTILE' },
      ] }] },
    } } } });
  };
  const response = await request();
  assert.equal(response.code, 200);
  assert.deepEqual(response.body.calendar, {
    from: '2025-10-13', to: '2026-10-13', total: 3, weeks: [{ days: [
      { date: '2026-10-12', count: 0, level: 0 },
      { date: '2026-10-13', count: 3, level: 4 },
    ] }],
  });
  assert.equal(response.body.calendarUnavailable, undefined);
  assert.doesNotMatch(JSON.stringify(response.body), /github-super-secret|Secret-Project|private-work-details|restrictedContributionsCount/);
});

test('preserves public data when GraphQL returns an error', async () => {
  publicResponses();
  const restFetch = globalThis.fetch;
  process.env.GITHUB_TOKEN = 'github-super-secret';
  globalThis.fetch = async (url, options) => url === 'https://api.github.com/graphql'
    ? Response.json({ errors: [{ message: 'token github-super-secret lacks access' }] })
    : restFetch(url, options);
  const response = await request();
  assert.equal(response.code, 200);
  assert.equal(response.body.calendar, null);
  assert.ok(response.body.calendarUnavailable);
  assert.equal(response.body.profile.login, 'Eyzen08');
  assert.doesNotMatch(JSON.stringify(response.body), /github-super-secret|lacks access/);
});

test('surfaces a GraphQL rate limit even when GitHub sends HTTP 200', async () => {
  publicResponses();
  const restFetch = globalThis.fetch;
  process.env.GITHUB_TOKEN = 'github-super-secret';
  globalThis.fetch = async (url, options) => url === 'https://api.github.com/graphql'
    ? Response.json({ errors: [{ type: 'RATE_LIMITED', message: 'github-super-secret' }] }, {
      headers: { 'Retry-After': '90' },
    })
    : restFetch(url, options);
  const response = await request();
  assert.equal(response.code, 429);
  assert.equal(response.headers['retry-after'], '90');
  assert.doesNotMatch(JSON.stringify(response.body), /github-super-secret/);
});

test('rejects malformed contribution counts instead of drawing fabricated activity', async () => {
  publicResponses();
  const restFetch = globalThis.fetch;
  process.env.GITHUB_TOKEN = 'github-super-secret';
  globalThis.fetch = async (url, options) => url === 'https://api.github.com/graphql'
    ? Response.json({ data: { user: { contributionsCollection: {
      startedAt: '2025-10-13T00:00:00Z', endedAt: '2026-10-13T00:00:00Z',
      contributionCalendar: { totalContributions: 1, weeks: [{ contributionDays: [
        { date: '2026-10-13', contributionCount: -1, contributionLevel: 'FIRST_QUARTILE' },
      ] }] },
    } } } })
    : restFetch(url, options);
  const response = await request();
  assert.equal(response.code, 200);
  assert.equal(response.body.calendar, null);
});

test('accepts GitHub week-aligned calendar windows slightly longer than a year',async()=>{
  publicResponses();const restFetch=globalThis.fetch;process.env.GITHUB_TOKEN='github-super-secret';
  globalThis.fetch=async(url,options)=>url==='https://api.github.com/graphql'?Response.json({data:{user:{contributionsCollection:{
    startedAt:'2025-10-18T16:00:00Z',endedAt:'2026-10-20T15:59:59Z',
    contributionCalendar:{totalContributions:1,weeks:[{contributionDays:[{date:'2025-10-19',contributionCount:0,contributionLevel:'NONE'}]},{contributionDays:[{date:'2026-10-20',contributionCount:1,contributionLevel:'FIRST_QUARTILE'}]}]}
  }}}}):restFetch(url,options);
  const response=await request();assert.equal(response.code,200);assert.equal(response.body.calendar?.total,1);
});
