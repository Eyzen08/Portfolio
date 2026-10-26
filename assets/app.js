import { initDecks, initProjectPreviews } from './decks.js';
import { initHome } from './home.js';
import { initLocationMap } from './location-map.js';
import { initMotion, playMotion } from './motion.js';
export function matchesFilter(item, query, category) {
  return (category === 'all' || item.category.toLowerCase() === category.toLowerCase()) &&
    query.trim().toLowerCase().split(/\s+/).every(word => item.search.toLowerCase().includes(word));
}

export function resolveTheme(saved, prefersDark) {
  return saved === 'dark' || saved === 'light' ? saved : prefersDark ? 'dark' : 'light';
}

if (typeof document !== 'undefined') {
  const root = document.documentElement;
  initDecks();
  initProjectPreviews();
  initLocationMap();
  if (document.querySelector('[data-home]')) initHome();
  const portraitSwap = document.querySelector('[data-portrait-swap]');
  if (portraitSwap) {
    const formal = portraitSwap.querySelector('[data-formal-portrait]');
    let available = false, wantsFormal = false;
    const showPortrait = show => {
      wantsFormal = show;
      portraitSwap.setAttribute('aria-pressed', String(available && show));
    };
    const ready = () => {
      available = formal.naturalWidth > 0;
      portraitSwap.disabled = !available;
      showPortrait(wantsFormal);
    };
    formal.addEventListener('load', ready);
    formal.addEventListener('error', () => {
      available = false;
      portraitSwap.disabled = true;
      showPortrait(false);
    });
    portraitSwap.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') showPortrait(true); });
    portraitSwap.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') showPortrait(false); });
    portraitSwap.addEventListener('click', () => showPortrait(portraitSwap.getAttribute('aria-pressed') !== 'true'));
    ready();
  }
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem('ej-theme'); } catch { /* Storage can be unavailable in private browsing. */ }
  function updateTheme() {
    root.dataset.theme = resolveTheme(preference, systemTheme.matches);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', root.dataset.theme === 'dark' ? '#0f0f0f' : '#fdfdfc');
    document.querySelector('[data-theme-toggle]')?.setAttribute('aria-label', `Switch to ${root.dataset.theme === 'dark' ? 'Light' : 'Dark'} Mode`);
  }
  updateTheme();
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('ej-theme', preference); } catch { /* Keep the current page preference when storage is unavailable. */ }
    updateTheme();
  });
  systemTheme.addEventListener('change', updateTheme);

  const menu = document.querySelector('[data-menu]');
  const menuButton = document.querySelector('[data-menu-button]');
  if (menu && menuButton) {
    menuButton.hidden = false;
    const setMenu = open => {
      menu.dataset.open = String(open);
      menu.inert = !open && matchMedia('(max-width: 1023px)').matches;
      menuButton.setAttribute('aria-expanded', String(open));
    };
    setMenu(false);
    menuButton.addEventListener('click', () => setMenu(menu.dataset.open !== 'true'));
    document.addEventListener('pointerdown', event => {
      if (menu.dataset.open === 'true' && !menu.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.dataset.open === 'true') { setMenu(false); menuButton.focus(); }
    });
    menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
    matchMedia('(min-width: 1024px)').addEventListener('change', () => setMenu(false));
  }

  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const controls = group.querySelector('[data-filter-controls]');
    if (!controls) return;
    controls.hidden = false;
    const input = group.querySelector('input[type="search"]');
    const items = [...group.querySelectorAll('[data-filter-item]')];
    const buttons = [...group.querySelectorAll('[data-category]')];
    let category = 'all';
    const apply = () => {
      let count = 0;
      for (const item of items) {
        const visible = matchesFilter({ search: item.dataset.search, category: item.dataset.itemCategory }, input?.value || '', category);
        const appeared = item.hidden && visible;
        item.hidden = !visible;
        if (visible) count++;
        if (appeared) playMotion(item,'feedback',{duration:180});
      }
      group.querySelector('[data-result-count]').textContent = `${count} ${group.dataset.filterGroup === 'projects' ? 'project' : 'technology'}${count === 1 ? '' : group.dataset.filterGroup === 'projects' ? 's' : ' entries'}`;
      group.querySelector('[data-empty]').hidden = count !== 0;
      const grid = group.querySelector('[data-project-grid]');
      if (grid) { grid.dataset.count = String(count); grid.hidden = count === 0; }
      group.dispatchEvent(new Event('filterchange'));
    };
    input?.addEventListener('input', apply);
    buttons.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.category;
      buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      apply();
    }));
    group.querySelector('[data-reset]')?.addEventListener('click', () => { input.value = ''; buttons[0].click(); input.focus(); });
    apply();
  });

  document.querySelector('[data-copy-email]')?.addEventListener('click', async event => {
    const status = document.querySelector('[data-copy-status]');
    try { await navigator.clipboard.writeText(event.currentTarget.dataset.copyEmail); status.textContent = 'Email address copied.'; }
    catch { status.textContent = 'Select and copy the email address, or open the email link.'; }
  });

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (form.dataset.pending === 'true') return;
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[data-form-status]');
    form.dataset.pending = 'true';
    button.disabled = true;
    button.textContent = 'Submitting…';
    status.textContent = '';
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error('Submission failed');
      status.textContent = 'Your inquiry was submitted. You can also contact me directly by email.';
      form.reset();
    } catch {
      status.textContent = 'The submission could not be confirmed. Your message is still here; retry or use the email link.';
    } finally {
      form.dataset.pending = 'false';
      button.disabled = false;
      button.textContent = 'Send Inquiry';
      playMotion(status,'feedback');
    }
  });

  const github = document.querySelector('[data-github]');
  if (github) {
    const status = github.querySelector('[data-github-status]');
    let pending=false,retryAt=0,lastFetch=0,visible=false;
    const populate = async () => {
      if(pending||Date.now()<retryAt)return;
      pending=true;lastFetch=Date.now();
      github.setAttribute('aria-busy', 'true');
      status.textContent = 'Loading public GitHub activity…';
      try {
        const response = await fetch('/api/github', { signal: AbortSignal.timeout(16000) });
        if(response.status===429){
          const seconds=Number(response.headers.get('Retry-After'));
          retryAt=Date.now()+(Number.isFinite(seconds)&&seconds>0?Math.min(seconds,86400):60)*1000;
        }
        if (!response.ok) throw new Error('Activity unavailable');
        const data = await response.json();
        if (data.profile?.login !== 'Eyzen08' || !Number.isFinite(Date.parse(data.fetchedAt))) throw new Error('Invalid activity');
        const age = Date.now() - Date.parse(data.fetchedAt);
        status.textContent = `Public data updated ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(data.fetchedAt))}${age > 300000 ? ' · cached data' : ''}.`;
        const stats = github.querySelector('[data-github-stats]');
        stats.hidden = false;
        stats.querySelector('[data-repos]').textContent = data.profile.publicRepos;
        stats.querySelector('[data-followers]').textContent = data.profile.followers;
        if (data.calendar) {
          github.querySelector('[data-calendar-label]').textContent = `${data.calendar.total} contribution${data.calendar.total===1?'':'s'} in the last year`;
          const heatmap = github.querySelector('[data-calendar]');
          const daily = github.querySelector('[data-calendar-days]');
          heatmap.replaceChildren(); daily.replaceChildren();
          for (const week of data.calendar.weeks) {
            const column = document.createElement('div'); column.className = 'calendar-week';
            for (const day of week.days) {
              const cell = document.createElement('span'); cell.className = `calendar-day level-${day.level}`; cell.title = `${day.date}: ${day.count} contributions`; cell.style.gridRow = String(new Date(`${day.date}T00:00:00Z`).getUTCDay()+1); column.append(cell);
              const row = document.createElement('tr');
              for (const value of [day.date, day.count]) { const td = document.createElement('td'); td.textContent = value; row.append(td); }
              daily.append(row);
            }
            heatmap.append(column);
          }
          github.querySelector('[data-calendar-section]').hidden = false;
        } else {
          github.querySelector('[data-calendar-section]').hidden = true;
          github.querySelector('[data-calendar-label]').textContent = 'Explore the contribution calendar on GitHub.';
        }
        const feed = github.querySelector('[data-events]');
        feed.replaceChildren();
        for (const item of data.recentEvents || []) {
          const url = new URL(item.url);
          if (url.protocol !== 'https:' || url.hostname !== 'github.com') continue;
          const li = document.createElement('li');
          const link = document.createElement('a'); link.href = url.href; link.textContent = `${item.type.replace(/Event$/, '')} · ${item.repo}`;
          const date = document.createElement('time'); date.dateTime = item.date; date.textContent = new Date(item.date).toLocaleDateString();
          li.append(link, date); feed.append(li);
        }
        if (!feed.children.length) { const li = document.createElement('li'); li.textContent = 'No recent events returned by the public feed. Explore the repositories below.'; feed.append(li); }
      } catch {
        github.querySelector('[data-github-stats]').hidden = true;
        github.querySelector('[data-calendar-section]').hidden = true;
        github.querySelector('[data-events]').replaceChildren();
        github.querySelector('[data-calendar-label]').textContent = 'Contribution calendar available on GitHub.';
        status.textContent = 'Live activity is unavailable right now. My public profile and project repositories are available below.';
      }
      finally { pending=false;github.setAttribute('aria-busy', 'false'); }
    };
    github.querySelector('[data-github-retry]')?.addEventListener('click', populate);
    populate();
    new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting);if(visible&&!document.hidden&&Date.now()-lastFetch>=300000)populate();}).observe(github);
    setInterval(()=>{if(visible&&!document.hidden)populate();},300000);
    document.addEventListener('visibilitychange',()=>{if(visible&&!document.hidden&&Date.now()-lastFetch>=300000)populate();});
  }

  document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
  initMotion();
}
