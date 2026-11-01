from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
from html.parser import HTMLParser
import xml.etree.ElementTree as ET

class Canonical(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.urls.append(attrs.get('href'))

root = Path('dist')
ns = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
sitemap = ET.parse(root / 'sitemap.xml').getroot()
assert sitemap.tag == ns + 'urlset'
urls = [node.text for node in sitemap.findall(ns + 'url/' + ns + 'loc')]
assert urls and len(urls) == len(set(urls)), 'Duplicate sitemap URLs'
# Paginated archives must advertise all generated pages, not only the first.
for page in list((root / 'blog').glob('page-*/index.html')) + list((root / 'tags').glob('*/index.html')):
    url = 'https://jace.pro/' + page.parent.relative_to(root).as_posix() + '/'
    assert url in urls, f'Archive missing from sitemap: {url}'
for url in urls:
    parsed = urlsplit(url)
    assert url.startswith('https://jace.pro/') and not parsed.query and not parsed.fragment, url
    path = root / unquote(parsed.path).lstrip('/')
    if parsed.path.endswith('/'):
        path /= 'index.html'
    assert path.is_file(), f'Sitemap target not generated: {url}'
    assert '/drafts/' not in parsed.path
    canonical = Canonical()
    canonical.feed(path.read_text())
    assert canonical.urls == [url], f'Incorrect canonical: {url}: {canonical.urls}'
redirects = Path('nginx-redirects.map').read_text()
for source, target in re.findall(r'^"([^"\\]*)" "([^"\\]*)";$', redirects, re.M):
    path = root / unquote(target).lstrip('/')
    if target.endswith('/'):
        path /= 'index.html'
    assert path.is_file(), f'Redirect points to missing content: {source} -> {target}'
assert '"/post/2018-08-14-avoid-these-things/" "/blog/servicenow-features-i-avoid-and-you-should-too/";' in redirects
assert '"/post/2019-11-25-comparing-code-searches/" "/blog/comparing-code-searchers/";' in redirects
print(f'Verified {len(urls)} unique production sitemap URLs and generated redirect targets')
