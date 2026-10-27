# GitHub activity endpoint

`GET /api/github` is a Vercel Node function for the fixed account `Eyzen08`. It accepts no query parameters. Public profile and recent events work without configuration.

Set `GITHUB_TOKEN` in the deployment's server environment to authenticate both REST and GraphQL requests. For local development, `npm run dev` reuses the existing GitHub CLI keyring sign-in when that variable is absent. It captures the credential directly into server-process memory without printing it or writing it to a file. If no local sign-in is available, public requests still run without authentication. Never place the token in browser code, a `VITE_` variable, or a committed environment file. Use a dedicated token for Eyzen08 with the `read:user` scope to include private and internal contribution counts. Return only calendar dates, counts and levels; never private repository names or details. GitHub's [contribution collection documentation](https://docs.github.com/en/graphql/reference/users#contributionscollection) explains how private contribution access depends on token scope.

Successful responses contain:

```json
{
  "profile": { "login": "Eyzen08", "name": "EJ", "url": "https://github.com/Eyzen08", "publicRepos": 9, "followers": 3 },
  "fetchedAt": "2026-10-13T00:00:00.000Z",
  "calendar": null,
  "calendarUnavailable": "Contribution calendar is unavailable.",
  "recentEvents": [],
  "status": "fresh"
}
```

The numbers above illustrate the contract, not current account data. When available, `calendar` is `{ from, to, total, weeks: [{ days: [{ date, count, level }] }] }`. Dates use `YYYY-MM-DD`; levels are integers 0–4 mapped from GitHub's contribution levels. Missing credentials or an unavailable/malformed calendar produce `calendar: null` with the note above. The browser should display that state without filling in contribution counts.

Home and Activity render one contribution graph card with the actual last-year total, five intensity levels, a Less–More legend and a GitHub link. Cells align by UTC weekday, including partial weeks. The scroll region supports keyboard access on narrow screens; a screen-reader-only daily-count table provides a text alternative. Missing data shows a concise unavailable message and the direct GitHub link; zero contributions remains a valid populated calendar. Repository/follower statistics, the event list, update timestamp, manual refresh and nested card are not rendered. There is no year selector or third-party calendar embed.

The endpoint returns at most six newest validated public events from the first 30 GitHub entries. It strips payloads, commit messages, private entries, and unrelated URLs. GitHub documents that [public events can be delayed and cover only the latest 30 days](https://docs.github.com/en/rest/activity/events#list-public-events-for-a-user).

Successes use five minutes of CDN caching and stale revalidation, with a stale-if-error directive. Home and Activity refresh every five minutes while the panel and browser tab are visible. The browser respects `Retry-After` before manual or automatic retries. Errors use `no-store`: unsupported methods return `405` with `Allow: GET`, query parameters return `400`, upstream quota limits return `429` with a safe `Retry-After`, and other profile/events failures return `502`. Error responses contain a fixed `{ error }` message and never upstream details. Each upstream request has an eight-second timeout. There is no application cache or database.

GitHub's default contribution collection can span slightly more than 366 days because it aligns to weeks and the account's time zone. Validation allows up to 54 weeks while retaining date, order, level and nonnegative-count checks. The live authenticated check on 20 October 2026 returned Eyzen08, seven public repositories, one follower, 37 contributions, 53 calendar weeks and six public events; these are observed values, not hard-coded UI content.

Run `node --test` for the endpoint and site checks. The endpoint tests replace only the external fetch boundary and restore the server environment afterward. A static file server cannot execute this route; use a Vercel deployment or local serverless development environment for live activity.

## Deployment verification — 27 October 2026

Production was missing `GITHUB_TOKEN`, so `/api/github` returned `calendar: null` while public profile/events still loaded. The authenticated local check returned a populated calendar with 49 contributions; this is an observation, not a fixed expected count. The owner subsequently saved a dedicated token as a Secret in both Production and Preview. Rebuilt Preview and staged Production functions both returned 49 contributions, 53 weeks and 367 day cells; Home and Activity rendered those counts without repository/follower statistics or an event feed. All 116 tests and the release build passed. The owner approved pushing this change to main and publishing it to ejmedilo.vercel.app on 27 October 2026. Private contributions are limited to what GitHub includes for the configured credential; no private repository details are queried by the calendar or published. Keep credentials out of files, client assets and logs.

A separate GitHub-side discrepancy remains: STI-Vio-Log has 459 commits attributed to Eyzen08 on its default main branch within the calendar period, while GitHub’s contribution API counts only three commit contributions from that repository. Both author emails were verified in the account settings. The portfolio displays GitHub’s returned counts; it does not manufacture a replacement total. No commit history or email settings were changed.
