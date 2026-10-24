const LOGIN = 'Eyzen08';
const HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2026-03-10',
  'User-Agent': 'Eyzen08-Portfolio',
};
const LEVELS = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
const EVENT_TYPES = new Set([
  'PushEvent', 'PullRequestEvent', 'PullRequestReviewEvent', 'PullRequestReviewCommentEvent',
  'IssuesEvent', 'IssueCommentEvent', 'CreateEvent', 'DeleteEvent', 'ForkEvent',
  'ReleaseEvent', 'WatchEvent', 'PublicEvent', 'MemberEvent', 'GollumEvent',
  'CommitCommentEvent', 'DiscussionEvent',
]);
const CALENDAR_QUERY = `query {
  user(login: "Eyzen08") {
    contributionsCollection {
      startedAt endedAt
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

function count(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function date(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

function timestamp(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)
    && date(value.slice(0, 10)) && Number.isFinite(Date.parse(value));
}

function githubUrl(value, host, path) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === host && !url.port && !url.username
      && !url.password && !url.search && !url.hash && url.pathname.toLowerCase() === path.toLowerCase();
  } catch {
    return false;
  }
}

function retryAfter(headers) {
  const retry = headers.get('retry-after');
  if (retry && /^\d+$/.test(retry)) return String(Math.max(1, Math.min(86400, Number(retry))));
  const reset = headers.get('x-ratelimit-reset');
  if (reset && /^\d+$/.test(reset)) {
    return String(Math.max(1, Math.min(86400, Number(reset) - Math.floor(Date.now() / 1000))));
  }
  return '60';
}

async function github(url, options = {}) {
  const response = await fetch(url, {
    ...options, redirect: 'error', signal: AbortSignal.timeout(8000),
    headers: { ...HEADERS, ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}), ...options.headers },
  });
  if (response.status === 429 || (response.status === 403
      && (response.headers.get('x-ratelimit-remaining') === '0' || response.headers.has('retry-after')))) {
    throw Object.assign(new Error('GitHub rate limit'), { status: 429, retryAfter: retryAfter(response.headers) });
  }
  if (!response.ok) throw new Error('GitHub request failed');
  const data = await response.json();
  if (Array.isArray(data?.errors) && data.errors.some((error) => error?.type === 'RATE_LIMITED')) {
    throw Object.assign(new Error('GitHub rate limit'), { status: 429, retryAfter: retryAfter(response.headers) });
  }
  return data;
}

function publicProfile(user) {
  if (!user || typeof user.login !== 'string' || user.login.toLowerCase() !== LOGIN.toLowerCase()
      || !githubUrl(user.html_url, 'github.com', `/${LOGIN}`)
      || !count(user.public_repos) || !count(user.followers)
      || (user.name !== null && (typeof user.name !== 'string' || user.name.length > 100
        || /[\u0000-\u001f\u007f]/.test(user.name)))) {
    throw new Error('Invalid GitHub profile');
  }
  return {
    login: user.login, name: user.name || user.login, url: `https://github.com/${LOGIN}`,
    publicRepos: user.public_repos, followers: user.followers,
  };
}

function publicEvents(events) {
  if (!Array.isArray(events) || events.length > 100) throw new Error('Invalid GitHub events');
  return events.filter((event) => event && event.public === true
      && typeof event.id === 'string' && /^\d{1,30}$/.test(event.id) && EVENT_TYPES.has(event.type)
      && typeof event.actor?.login === 'string' && event.actor.login.toLowerCase() === LOGIN.toLowerCase()
      && typeof event.repo?.name === 'string'
      && /^[a-z\d][a-z\d-]{0,38}\/[a-z\d._-]{1,100}$/i.test(event.repo.name)
      && !['.', '..'].includes(event.repo.name.split('/')[1])
      && githubUrl(event.repo.url, 'api.github.com', `/repos/${event.repo.name}`)
      && timestamp(event.created_at))
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, 6)
    .map((event) => ({
      id: event.id, type: event.type, repo: event.repo.name,
      url: `https://github.com/${event.repo.name}`, date: event.created_at,
    }));
}

function contributionCalendar(data) {
  if (data?.errors?.length) throw new Error('GitHub calendar unavailable');
  const collection = data?.data?.user?.contributionsCollection;
  const calendar = collection?.contributionCalendar;
  if (!timestamp(collection?.startedAt) || !timestamp(collection?.endedAt) || !count(calendar?.totalContributions)
      || !Array.isArray(calendar.weeks) || !calendar.weeks.length || calendar.weeks.length > 54) {
    throw new Error('Invalid GitHub calendar');
  }
  const from = collection.startedAt.slice(0, 10);
  const to = collection.endedAt.slice(0, 10);
  // GitHub aligns the collection to weeks, so its window can exceed 366 days.
  if (from > to || Date.parse(to) - Date.parse(from) > 54 * 7 * 86400000) throw new Error('Invalid calendar range');
  let previous = '';
  const weeks = calendar.weeks.map((week) => {
    if (!Array.isArray(week.contributionDays) || !week.contributionDays.length || week.contributionDays.length > 7) {
      throw new Error('Invalid calendar week');
    }
    return { days: week.contributionDays.map((day) => {
      const level = LEVELS.indexOf(day.contributionLevel);
      if (!date(day.date) || day.date < from || day.date > to || day.date <= previous
          || !count(day.contributionCount) || level < 0) throw new Error('Invalid calendar day');
      previous = day.date;
      return { date: day.date, count: day.contributionCount, level };
    }) };
  });
  return { from, to, total: calendar.totalContributions, weeks };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Use GET for GitHub activity.' });
  }
  if (req.url?.includes('?') || Object.keys(req.query || {}).length) {
    return res.status(400).json({ error: 'This endpoint accepts no query parameters.' });
  }
  try {
    const [user, events] = await Promise.all([
      github(`https://api.github.com/users/${LOGIN}`),
      github(`https://api.github.com/users/${LOGIN}/events/public?per_page=30`),
    ]);
    const profile = publicProfile(user);
    const recentEvents = publicEvents(events);
    let calendar = null;
    if (process.env.GITHUB_TOKEN) {
      try {
        calendar = contributionCalendar(await github('https://api.github.com/graphql', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: CALENDAR_QUERY }),
        }));
      } catch (error) {
        if (error?.status === 429) throw error;
      }
    }
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=300, stale-if-error=86400');
    return res.status(200).json({
      profile, fetchedAt: new Date().toISOString(), calendar, recentEvents, status: 'fresh',
      ...(calendar ? {} : { calendarUnavailable: 'Contribution calendar is unavailable.' }),
    });
  } catch (error) {
    if (error?.status === 429) {
      res.setHeader('Retry-After', error.retryAfter);
      return res.status(429).json({ error: 'GitHub is rate limited. Please try again later.' });
    }
    return res.status(502).json({ error: 'GitHub activity is temporarily unavailable.' });
  }
}
