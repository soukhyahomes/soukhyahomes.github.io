// Simple site index builder
// Usage: node scripts/build_search_index.js
// Reads HTML files from _site, extracts title and text, and writes assets/search/site_index.json

const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..', '_site');
const OUT_DIR = path.join(__dirname, '..', 'assets', 'search');
const OUT_FILE = path.join(OUT_DIR, 'site_index.json');

function stripTags(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&amp;|&quot;|&lt;|&gt;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\\/i);
  if (m) return m[1].trim();
  const h = html.match(/<h1[^>]*>([\s\S]*?)<\\/i);
  return h ? h[1].trim() : '';
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

function build() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const files = walk(SITE_DIR);
  const entries = files.map(f => {
    const raw = fs.readFileSync(f, 'utf8');
    const title = extractTitle(raw) || path.basename(f);
    const text = stripTags(raw);
    const rel = '/' + path.relative(SITE_DIR, f).replace(/\\\\/g, '/');
    const snippet = text.slice(0, 800).trim();
    return { id: rel, url: rel, title, content: snippet };
  });
  fs.writeFileSync(OUT_FILE, JSON.stringify(entries, null, 2), 'utf8');
  console.log('Wrote', OUT_FILE, 'with', entries.length, 'entries');
}

build();
