import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve, dirname, sep, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildSite } from './build.mjs';
import github from '../api/github.js';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'public');
const securityHeaders=JSON.parse(await readFile(join(root,'vercel.json'),'utf8')).headers[0].headers;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };

export function createDevServer() {
  return createServer(async (req, res) => {
    for(const {key,value} of securityHeaders)res.setHeader(key,value);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    if (req.url?.split('?')[0] === '/api/github') {
      res.status = code => { res.statusCode = code; return res; };
      res.json = value => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(value)); };
      return github(req, res);
    }
    if (!['GET', 'HEAD'].includes(req.method)) { res.setHeader('Allow', 'GET, HEAD'); res.writeHead(405); return res.end('Method not allowed'); }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400); return res.end('Invalid path'); }
    if (pathname.includes('..') || pathname.includes('\\') || pathname.includes('\0')) { res.writeHead(400); return res.end('Invalid path'); }
    let file = resolve(output, `.${pathname}`);
    if (file !== output && !file.startsWith(output + sep)) { res.writeHead(400); return res.end('Invalid path'); }
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      const body = await readFile(file);
      res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
      res.writeHead(200); res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.writeHead(404);
      const body = await readFile(join(output, '404.html')).catch(() => 'Not found');
      res.end(req.method === 'HEAD' ? undefined : body);
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.env.GITHUB_TOKEN) {
    try {
      process.env.GITHUB_TOKEN = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore','pipe','ignore'], timeout: 5000 }).trim();
    } catch { /* Public profile requests still work when no local sign-in is available. */ }
  }
  await buildSite();
  const port = Number(process.env.PORT || 4173);
  createDevServer().listen(port, '127.0.0.1', () => console.log(`Portfolio preview: http://127.0.0.1:${port} (draft, not published)`));
}
