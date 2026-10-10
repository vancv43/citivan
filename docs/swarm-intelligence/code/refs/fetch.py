import json, sys, time, urllib.request, urllib.parse
out = {}
for line in open('dois.txt'):
    ch, doi = line.split()
    url = 'https://api.crossref.org/works/' + urllib.parse.quote(doi)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'SI-Textbook/1.0 (mailto:vvchauit@gmail.com)'})
        m = json.load(urllib.request.urlopen(req, timeout=30))['message']
        out[doi] = {'ch': int(ch), 'ok': True, 'title': (m.get('title') or [''])[0], 'container': (m.get('container-title') or [''])[0],
                    'short': (m.get('short-container-title') or [''])[0], 'type': m.get('type'),
                    'authors': [(a.get('given', ''), a.get('family', a.get('name', ''))) for a in m.get('author', [])],
                    'year': (m.get('issued', {}).get('date-parts') or [[None]])[0][0], 'volume': m.get('volume'), 'issue': m.get('issue'),
                    'page': m.get('page'), 'article': m.get('article-number'), 'publisher': m.get('publisher')}
    except Exception as e:
        out[doi] = {'ch': int(ch), 'ok': False, 'err': str(e)}
    time.sleep(0.15)
json.dump(out, open('crossref.json', 'w'), ensure_ascii=False, indent=1)
bad = [d for d, v in out.items() if not v['ok']]
print('fetched', len(out), 'failed', bad)
