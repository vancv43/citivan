"""Định dạng tài liệu tham khảo theo IEEE từ siêu dữ liệu Crossref (crossref.json) + vài sách không có DOI."""
import json, re, html

d = json.load(open('crossref.json'))
OKWU = '10.1007/978-3-030-61111-8'
FIX_AUTH = {'10.1109/MCS.2002.1004010': [('K. M.', 'Passino')]}

def initials(given, family):
    if not given and ' ' in family.strip():
        parts = family.split(); given, family = ' '.join(parts[:-1]), parts[-1]
    out = []
    for g in re.split(r'\s+', given.strip()):
        if not g: continue
        out.append('-'.join(p[0] + '.' for p in g.split('-') if p))
    return (' '.join(out) + ' ' if out else '') + family

def authors(lst):
    names = [n if isinstance(n, str) else initials(*n) for n in lst]
    if len(names) > 6:
        return names[0] + ' et al.'
    if len(names) <= 2:
        return ' and '.join(names)
    return ', '.join(names[:-1]) + ', and ' + names[-1]

def fmt(doi, v):
    au = authors(FIX_AUTH.get(doi) or [a for a in v['authors']])
    t = html.unescape(re.sub(r'<[^>]+>', '', v['title'])).strip()
    t = t.replace('&#x00E9;', 'é')
    if doi == '10.1016/S0167-739X(00)00043-1':
        t = 'MAX–MIN Ant System'
    cont = html.unescape(v['short'] or v['container'])
    pages = v['page'] and 'pp. ' + v['page'].replace('-', '–')
    if v['type'] in ('book', 'monograph', 'edited-book'):
        return f'{au}, <em>{t}</em>. {v["publisher"]}, {v["year"]}, doi: {doi}.'
    if v['type'] in ('proceedings-article',):
        bits = [f'{au}, “{t},” in <em>{cont}</em>', str(v['year'])]
        if pages: bits.append(pages)
        return ', '.join(bits) + f', doi: {doi}.'
    if v['type'] == 'book-chapter':
        bits = [f'{au}, “{t},” in <em>{cont}</em>', v['publisher'], str(v['year'])]
        if pages: bits.append(pages)
        return ', '.join(bits) + f', doi: {doi}.'
    bits = [f'{au}, “{t},” <em>{cont}</em>']
    if v['volume']: bits.append(f'vol. {v["volume"]}')
    if v['issue']: bits.append(f'no. {v["issue"]}')
    if pages: bits.append(pages)
    elif v['article']: bits.append(f'Art. no. {v["article"]}')
    bits.append(str(v['year']))
    return ', '.join(bits) + f', doi: {doi}.'

BOOKS = {
 1: ['E. Bonabeau, M. Dorigo, and G. Theraulaz, <em>Swarm Intelligence: From Natural to Artificial Systems</em>. New York, NY, USA: Oxford Univ. Press, 1999.',
     'I. Rechenberg, <em>Evolutionsstrategie: Optimierung technischer Systeme nach Prinzipien der biologischen Evolution</em>. Stuttgart, Germany: Frommann-Holzboog, 1973.'],
 3: ['J. Kennedy, R. C. Eberhart, and Y. Shi, <em>Swarm Intelligence</em>. San Francisco, CA, USA: Morgan Kaufmann, 2001.'],
 4: ['M. Dorigo and T. Stützle, <em>Ant Colony Optimization</em>. Cambridge, MA, USA: MIT Press, 2004.'],
 5: ['D. Karaboga, “An idea based on honey bee swarm for numerical optimization,” Erciyes Univ., Kayseri, Turkey, Tech. Rep. TR06, 2005.',
     'X.-S. Yang, <em>Nature-Inspired Metaheuristic Algorithms</em>. Frome, U.K.: Luniver Press, 2008.'],
 16: ['J. H. Holland, <em>Adaptation in Natural and Artificial Systems</em>. Ann Arbor, MI, USA: Univ. Michigan Press, 1975.',
      'K. Deb and R. B. Agrawal, “Simulated binary crossover for continuous search space,” <em>Complex Syst.</em>, vol. 9, no. 2, pp. 115–148, 1995.'],
 17: ['D. P. Kingma and J. Ba, “Adam: A method for stochastic optimization,” in <em>Proc. Int. Conf. Learn. Represent. (ICLR)</em>, 2015, arXiv:1412.6980.',
      'J. Bergstra and Y. Bengio, “Random search for hyper-parameter optimization,” <em>J. Mach. Learn. Res.</em>, vol. 13, pp. 281–305, 2012.',
      'F. Pedregosa et al., “Scikit-learn: Machine learning in Python,” <em>J. Mach. Learn. Res.</em>, vol. 12, pp. 2825–2830, 2011.'],
}
EXTRA_OKWU = [3, 4, 5, 6, 7, 9, 10, 16, 17]

refs = {ch: [] for ch in range(1, 19)}
for doi, v in d.items():
    refs[v['ch']].append({'text': fmt(doi, v), 'doi': doi, 'year': v['year']})
for ch in EXTRA_OKWU:
    refs[ch].append({'text': fmt(OKWU, d[OKWU]), 'doi': OKWU, 'year': 2021})
for ch, lst in BOOKS.items():
    for t in lst:
        refs[ch].append({'text': t, 'doi': None, 'year': int(re.findall(r'(19|20)\d\d', t)[-1] if False else re.findall(r'\b(?:19|20)\d\d\b', t)[-1])})
for ch in refs:
    refs[ch].sort(key=lambda r: (r['year'] or 0))
json.dump(refs, open('references.json', 'w'), ensure_ascii=False, indent=1)
for ch in (3, 13, 18):
    print('--- ch', ch)
    for r in refs[ch]: print(r['text'])
