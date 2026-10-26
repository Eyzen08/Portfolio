import { readFile, writeFile, mkdir, cp, access, rm } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderPages, shell } from './templates.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export async function buildSite({ outDir = join(root, 'public'), release = false, origin = process.env.SITE_URL } = {}) {
  let canonicalOrigin = null;
  if (origin) {
    try {
      const url = new URL(origin);
      if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error();
      canonicalOrigin = url.origin;
    } catch { throw new Error('SITE_URL must be an HTTPS origin without credentials, path, query, or fragment.'); }
  }
  const readData = async name => JSON.parse(await readFile(join(root, 'data', `${name}.json`), 'utf8'));
  const [profile, projects, technologies] = await Promise.all(['profile', 'projects', 'technologies'].map(readData));
  if (release) {
    const missing = [];
    if (!profile.portrait) missing.push('updated portrait');
    if (!profile.resumePdf) missing.push('updated résumé PDF');
    if (!profile.contentApproved) missing.push('owner-approved content and project imagery');
    if (!profile.contactVerified) missing.push('confirmed contact inbox delivery');
    if (!canonicalOrigin) missing.push('SITE_URL HTTPS origin');
    if (missing.length) throw new Error(`Launch blocked: ${missing.join(', ')}.`);
  }
  for (const path of [profile.portrait, profile.resumePdf].filter(Boolean)) {
    if (!path.startsWith('/assets/') || path.includes('..') || path.includes('\\')) throw new Error('Public personal assets must be inside /assets/.');
    await access(join(root, path.slice(1)));
  }
  for (const item of [...profile.hobbyCards, ...profile.gallery, ...(profile.heroPortrait ? [profile.heroPortrait] : []), ...profile.education.flatMap(item=>item.preview?[item.preview]:[])]) {
    if (!item.src.startsWith('/assets/') || item.src.includes('..') || item.src.includes('\\') || !Number.isInteger(item.width) || !Number.isInteger(item.height) || item.width <= 0 || item.height <= 0 || !item.alt || !item.description || !item.credit) throw new Error('Invalid profile media.');
    await access(join(root,item.src.slice(1)));
  }
  for (const item of profile.certifications) {
    if (!item.preview) continue;
    const preview = item.preview;
    if (!preview || !Number.isInteger(preview.width) || !Number.isInteger(preview.height) || preview.width <= 0 || preview.height <= 0 || !preview.alt) throw new Error('Invalid certificate preview.');
    for (const path of [preview.src]) {
      if (typeof path !== 'string' || !path.startsWith('/assets/certifications/') || path.includes('..') || path.includes('\\') || path.includes('?') || path.includes('#')) throw new Error('Invalid certificate asset path.');
      await access(join(root, path.slice(1)));
    }
  }
  const ids = new Set(projects.map(project => project.id));
  if (ids.size !== projects.length) throw new Error('Duplicate project IDs.');
  for (const tech of technologies) {
    if (tech.projects.some(id => !ids.has(id))) throw new Error(`Unknown project reference: ${tech.name}`);
    await access(join(root, 'assets', 'icons', `${tech.iconId || tech.id}.svg`));
  }
  const technologyIds = new Set(technologies.map(tech => tech.id));
  for (const project of projects) {
    if ([...project.technologies, ...project.cardTechnologies].some(id => !technologyIds.has(id))) throw new Error(`Unknown technology in ${project.title}.`);
    for (const screen of project.previewScreens || []) {
      if (screen.presentationLabel !== undefined && (typeof screen.presentationLabel !== 'string' || screen.presentationLabel.length > 64)) throw new Error('Invalid preview presentation label.');
      if (!screen.src.startsWith('/assets/') || screen.src.includes('..') || screen.src.includes('\\') || !Number.isInteger(screen.width) || !Number.isInteger(screen.height) || screen.width <= 0 || screen.height <= 0) throw new Error('Invalid project preview asset.');
      for (const path of [screen.src, screen.srcSmall, screen.originalSrc].filter(Boolean)) {
        if (!path.startsWith('/assets/') || path.includes('..') || path.includes('\\')) throw new Error('Invalid project preview asset.');
        await access(join(root, path.slice(1)));
      }
      if (screen.srcSmall && (!Number.isInteger(screen.smallWidth) || screen.smallWidth <= 0 || screen.smallWidth > screen.width)) throw new Error('Invalid project preview size.');
    }
  }
  const context = { profile, projects, technologies, release, origin: canonicalOrigin };
  const pages = renderPages(context);
  await mkdir(outDir, { recursive: true });
  await cp(join(root, 'assets'), join(outDir, 'assets'), { recursive: true, filter: source => source !== join(root, 'assets', 'certifications') });
  const certificateDir = join(outDir, 'assets', 'certifications');
  await rm(certificateDir, { recursive: true, force: true });
  await mkdir(certificateDir, { recursive: true });
  for (const item of profile.certifications.filter(item => item.preview)) {
    await cp(join(root, item.preview.src.slice(1)), join(outDir, item.preview.src.slice(1)));
  }
  const mapVendor=join(outDir,'assets','vendor','maplibre');
  await mkdir(mapVendor,{recursive:true});
  for(const name of ['maplibre-gl.mjs','maplibre-gl-worker.mjs','maplibre-gl.css'])await cp(join(root,'node_modules','maplibre-gl','dist',name),join(mapVendor,name));
  await cp(join(root,'node_modules','maplibre-gl','LICENSE.txt'),join(mapVendor,'LICENSE.txt'));
  for (const page of pages) {
    const target = join(outDir, page.route === '/404.html' ? '404.html' : `${page.route}index.html`);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, shell(page, context));
  }
  const robots = release ? `User-agent: *\nAllow: /\nSitemap: ${context.origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n';
  await writeFile(join(outDir, 'robots.txt'), robots);
  const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
  const urls = context.origin ? pages.filter(page => page.route !== '/404.html').map(page => `<url><loc>${escapeXml(context.origin + page.route)}</loc></url>`).join('') : '';
  await writeFile(join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  return pages.map(page => page.route);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const routes = await buildSite({ release: process.argv.includes('--release') });
  console.log(`Built ${routes.length - 1} pages and a 404 page in public/. ${process.argv.includes('--release') ? 'Release' : 'Draft: noindex, launch assets pending'}.`);
}
