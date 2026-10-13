// Sync src/data/publications.json with the public ORCID record.
// Existing entries (matched by DOI or normalized title) are kept as-is so
// hand-curated fields (author profile links, SJR rank, indexing) survive;
// only new or changed works are rebuilt from ORCID + Crossref metadata.
// Usage: node scripts/sync-orcid.mjs
import fs from 'node:fs';

const ORCID_ID = '0009-0008-0325-6809';
const ORCID_URL = `https://orcid.org/${ORCID_ID}`;
const SELF_NAMES = ['Chau Van Van', 'Van Van Chau'];
const DATA_FILE = new URL('../src/data/publications.json', import.meta.url);
const UA = { 'User-Agent': 'citivan-site-orcid-sync (https://vancv43.github.io/citivan/)' };
const KEEP_TYPES = new Set([
  'journal-article',
  'conference-paper',
  'book-chapter',
  'conference-abstract',
  'conference-poster',
  'conference-output',
]);
const PUBLISHERS = {
  '10.1109': 'IEEE',
  '10.1007': 'Springer',
  '10.1145': 'ACM',
  '10.37394': 'WSEAS',
  '10.36922': 'AccScience',
  '10.1016': 'Elsevier',
  '10.1002': 'Wiley',
  '10.3390': 'MDPI',
  '10.1371': 'PLOS',
};

const decode = (s) =>
  (s || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
// IEEE sometimes registers this editorial note as part of the title.
const cleanTitle = (s) => decode(s).replace(/:?\s*\*Note: Sub-Titles Are Not Captured in Xplore and Should Not Be Used/i, '').trim();
const normTitle = (s) => decode(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');
const normDoi = (s) => (s ? s.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').trim().toLowerCase() : null);
const selfName = (n) => (SELF_NAMES.includes(n) ? 'Chau Van Van' : n);
const enc = encodeURIComponent;

async function getJson(url, headers = {}) {
  const r = await fetch(url, { headers: { ...UA, ...headers } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

async function getText(url, headers = {}) {
  const r = await fetch(url, { headers: { ...UA, ...headers } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}

// Follow doi.org redirects by reading Location headers only, so publisher
// pages that block bots are never requested.
async function resolveDoi(doi) {
  let url = `https://doi.org/${doi}`;
  for (let i = 0; i < 6; i += 1) {
    const r = await fetch(url, { redirect: 'manual', headers: UA });
    const loc = r.headers.get('location');
    if (!loc || r.status < 300 || r.status >= 400) return url;
    url = new URL(loc, url).toString();
    if (/ieeexplore\.ieee\.org\/document\/\d+/.test(url)) return url;
  }
  return url;
}

async function fetchOrcidWorks() {
  const summary = await getJson(`https://pub.orcid.org/v3.0/${ORCID_ID}/works`, { Accept: 'application/json' });
  const codes = (summary.group || []).map((g) => g['work-summary'][0]['put-code']);
  const works = [];
  for (let i = 0; i < codes.length; i += 50) {
    const bulk = await getJson(`https://pub.orcid.org/v3.0/${ORCID_ID}/works/${codes.slice(i, i + 50).join(',')}`, {
      Accept: 'application/json',
    });
    for (const b of bulk.bulk || []) if (b.work) works.push(b.work);
  }
  return works.map((w) => {
    const ids = (w['external-ids'] && w['external-ids']['external-id']) || [];
    const doiId = ids.find((e) => e['external-id-type'] === 'doi');
    const contributors = (w.contributors && w.contributors.contributor) || [];
    const pd = w['publication-date'] || {};
    return {
      putCode: w['put-code'],
      type: w.type,
      title: cleanTitle(w.title && w.title.title && w.title.title.value),
      year: pd.year ? Number(pd.year.value) : null,
      venue: decode(w['journal-title'] && w['journal-title'].value),
      doi: normDoi(doiId && doiId['external-id-value']),
      url: w.url && w.url.value,
      authors: contributors.map((c) => c['credit-name'] && c['credit-name'].value).filter(Boolean),
    };
  });
}

function dedupe(works) {
  const byDoi = new Map();
  const noDoi = [];
  for (const w of works) {
    if (!KEEP_TYPES.has(w.type) || !w.title) {
      console.log(`skip (${w.type}): ${w.title}`);
      continue;
    }
    if (w.doi) {
      const prev = byDoi.get(w.doi);
      // Prefer the record with more author metadata.
      if (!prev || w.authors.length > prev.authors.length) byDoi.set(w.doi, w);
    } else noDoi.push(w);
  }
  const withDoiTitles = new Set([...byDoi.values()].map((w) => normTitle(w.title)));
  const seen = new Set();
  const rest = noDoi.filter((w) => {
    const k = normTitle(w.title);
    if (withDoiTitles.has(k) || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return [...byDoi.values(), ...rest];
}

function indexLabel(venue, publisher) {
  if (/Optimization and Control: Theories/.test(venue)) return 'Scopus · ISI (WoS-ESCI)';
  if (/WSEAS/.test(venue)) return 'Scopus';
  if (/Lecture Notes|Communications in Computer and Information Science/.test(venue)) return 'Scopus (Springer)';
  if (publisher === 'ACM' && /Proceedings/.test(venue)) return 'Scopus (ACM ICPS)';
  if (publisher === 'IEEE' && /(Conference|Symposium|Seminar)/.test(venue)) return 'Scopus (IEEE Xplore)';
  if (/REV-ECIT|National/i.test(venue)) return 'National';
  return null;
}

async function ieeeAuthorLinks(arnumber, names) {
  try {
    const j = await getJson(`https://ieeexplore.ieee.org/rest/document/${arnumber}/authors`, {
      Referer: `https://ieeexplore.ieee.org/document/${arnumber}`,
    });
    if (j.authors && j.authors.length) {
      return j.authors.map((a) => ({ name: selfName(a.name), url: `https://ieeexplore.ieee.org/author/${a.id}` }));
    }
  } catch (e) {
    console.log(`  IEEE author lookup unavailable (${e.message}); using author search links`);
  }
  return names.map((n) => ({
    name: n,
    url: `https://ieeexplore.ieee.org/search/searchresult.jsp?searchWithin=${enc(`"Author":"${n}"`)}`,
  }));
}

function authorLinkFor(name, publisher) {
  if (name === 'Chau Van Van' && !publisher) return ORCID_URL;
  if (publisher === 'Springer') return `https://link.springer.com/search?dc.creator=${enc(name)}`;
  if (publisher === 'ACM') return `https://dl.acm.org/action/doSearch?ContribAuthorRaw=${enc(name)}`;
  if (name === 'Chau Van Van') return ORCID_URL;
  return `https://scholar.google.com/scholar?q=author%3A%22${enc(name)}%22`;
}

async function buildEntry(w, keep) {
  const type = w.type === 'journal-article' ? 'Journal' : 'Conference';
  let authors = w.authors.map(selfName);
  let year = w.year;
  let venue = w.venue;
  let extra = [];
  let publisher = null;
  let landing = w.url || null;
  let pdf = w.url || null;
  let bibtex = null;
  let authorLinks;

  if (w.doi) {
    publisher = PUBLISHERS[w.doi.split('/')[0]] || null;
    try {
      const m = (await getJson(`https://api.crossref.org/works/${enc(w.doi)}`)).message;
      const cr = (m.author || []).map((a) => selfName(`${a.given || ''} ${a.family || ''}`.trim()));
      if (cr.length) authors = cr;
      const ct = (m['container-title'] || []).map(decode);
      if (ct.length) venue = ct.length >= 2 ? `${ct[1]}, ${ct[0]}` : ct[0];
      year = (m.issued && m.issued['date-parts'] && m.issued['date-parts'][0][0]) || year;
      if (m.volume) extra.push(`vol. ${m.volume}`);
      if (m.issue) extra.push(`no. ${m.issue}`);
      if (m.page) extra.push(`${m.page.includes('-') ? 'pp.' : 'p.'} ${m.page}`);
      if (!publisher && m.publisher) publisher = m.publisher.split(/[ ,]/)[0];
    } catch (e) {
      console.log(`  Crossref metadata unavailable for ${w.doi}: ${e.message}`);
    }
    try {
      bibtex = cleanTitle(await getText(`https://api.crossref.org/works/${enc(w.doi)}/transform/application/x-bibtex`));
    } catch {
      bibtex = null;
    }
    landing = await resolveDoi(w.doi);
    const arn = (landing.match(/ieeexplore\.ieee\.org\/document\/(\d+)/) || [])[1];
    if (publisher === 'IEEE' && arn) {
      pdf = `https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=${arn}`;
      authorLinks = await ieeeAuthorLinks(arn, authors);
      authors = authorLinks.map((a) => a.name);
    } else if (publisher === 'Springer') pdf = `https://link.springer.com/content/pdf/${w.doi}.pdf`;
    else if (publisher === 'ACM') pdf = `https://dl.acm.org/doi/pdf/${w.doi}`;
    else pdf = landing;
  }

  if (!authors.length) authors = ['Chau Van Van'];
  authorLinks = authorLinks || authors.map((n) => ({ name: n, url: authorLinkFor(n, publisher) }));
  if (pdf && pdf.includes('orcid.org')) pdf = null;

  if (!bibtex) {
    const kind = type === 'Journal' ? 'article' : 'inproceedings';
    const field = type === 'Journal' ? 'journal' : 'booktitle';
    const key = `${authors[0].split(' ')[0]}${year || ''}${(w.title.split(' ')[0] || 'paper').replace(/[^A-Za-z]/g, '')}`;
    bibtex = `@${kind}{${key},\n  author = {${authors.join(' and ')}},\n  title = {${w.title}},\n  ${field} = {${venue}},\n  year = {${year}}\n}`;
  }

  const entry = {
    id: '',
    year,
    type,
    authors: authors.join('; '),
    authorLinks,
    title: w.title,
    venue: `${[venue, ...extra, year].filter(Boolean).join(', ')}.`,
    index: (keep && keep.index) || indexLabel(venue, publisher),
    publisher,
    doi: w.doi,
    landing,
    pdf,
    bibtex,
    link: w.doi ? `https://doi.org/${w.doi}` : landing || ORCID_URL,
  };
  if (keep && keep.rank) {
    entry.rank = keep.rank;
    entry.rankNote = keep.rankNote;
  }
  return entry;
}

function assignIds(list) {
  list.sort((a, b) => b.year - a.year || a.type.localeCompare(b.type) || a.title.localeCompare(b.title));
  const n = { Journal: 0, Conference: 0 };
  for (const p of list) n[p.type] += 1;
  for (const p of list) {
    p.id = `${p.type === 'Journal' ? 'J' : 'C'}${String(n[p.type]).padStart(2, '0')}`;
    n[p.type] -= 1;
  }
  return list;
}

async function main() {
  const current = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const works = dedupe(await fetchOrcidWorks());
  if (!works.length) throw new Error('ORCID returned no works; refusing to overwrite the publication list');

  const findExisting = (w) =>
    current.find((p) => (w.doi && p.doi === w.doi) || normTitle(p.title) === normTitle(w.title));

  const next = [];
  let added = 0;
  let updated = 0;
  for (const w of works) {
    const ex = findExisting(w);
    if (ex && (ex.doi || null) === (w.doi || null)) {
      next.push({ ...ex });
      continue;
    }
    console.log(`${ex ? 'update' : 'add'}: ${w.title}`);
    next.push(await buildEntry(w, ex));
    if (ex) updated += 1;
    else added += 1;
  }
  const removed = current.filter((p) => !next.some((q) => normTitle(q.title) === normTitle(p.title)));
  for (const p of removed) console.log(`remove: ${p.title}`);

  assignIds(next);
  const out = `${JSON.stringify(next, null, 2)}\n`;
  if (out === fs.readFileSync(DATA_FILE, 'utf8')) {
    console.log(`No changes (${next.length} publications).`);
    return;
  }
  fs.writeFileSync(DATA_FILE, out);
  console.log(`Updated: ${next.length} publications (+${added} added, ${updated} updated, -${removed.length} removed).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
