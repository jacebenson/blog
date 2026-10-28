import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import nunjucks from 'nunjucks';
import {jsonLd} from '../../../src/_config/filters/json-ld.js';
const routes = ['/', '/blog/a-history-of-ai-from-my-point-of-view/', '/blog/ai-agent-patterns-as-mermaid-diagrams/'];
const results = [];
for (const route of routes) {
  const html = readFileSync(`dist${route}index.html`, 'utf8');
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  assert(schemas.length);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
  assert.equal(new URL(canonical).protocol, 'https:');
  const article = schemas.find(s => s['@type'] === 'BlogPosting');
  if (route !== '/') {
    assert(article);
    assert.equal(article['@id'], canonical);
    assert.equal(article.mainEntityOfPage['@id'], canonical);
    assert(!article.description.includes('&#39;'));
  }
  const description = html.match(/<meta name="description" content="([^"]*)"/)[1];
  assert(!description.includes('&amp;#39;'));
  if (route.includes('history-of-ai')) {
    assert(article.description.startsWith("I've"));
    assert(description.startsWith('I&#39;ve') || description.startsWith("I've"));
  }
  results.push({route, canonical, jsonBlocks: schemas.length, articleId: article?.['@id'], description: article?.description});
}
// Render the real template with hostile values. No synthetic article is published.
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), {autoescape: true});
env.addFilter('jsonLd', jsonLd);
env.addFilter('toIsoString', d => d.toISOString());
const hostile = `It's "quoted" & <tag> </script><script>alert(1)</script>\n\u2028\u2029`;
const context = {meta: {url:'https://example.test',siteName:hostile,siteDescription:hostile,opengraph_default:'/image.jpg',locale:hostile,siteType:hostile,author:{name:hostile}},page:{url:'/fixture/'},title:hostile,description:hostile,date:new Date('2026-01-01')};
const rendered = env.render('schemas/BlogPosting.njk', context);
assert.equal((rendered.match(/<script/g) || []).length, 1);
const payload = rendered.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1];
const parsed = JSON.parse(payload);
assert.equal(parsed.headline, hostile);
assert.equal(parsed.description, hostile);
assert.equal(parsed.author.name, hostile);
assert(!payload.includes('<'));
const robots = readFileSync('dist/robots.txt','utf8');
for (const bot of ['GPTBot','OAI-SearchBot','ChatGPT-User','Claude-SearchBot','ClaudeBot','PerplexityBot']) {
  const group = robots.split(/\n\s*\n/).find(block => block.split('\n').includes(`User-agent: ${bot}`));
  assert(group, bot);
  assert(group.split('\n').includes('Allow: /'), bot);
  assert(!group.includes('Disallow:'), bot);
}
assert(readFileSync('dist/llms.txt','utf8').length > 100);
assert(readFileSync('dist/sitemap.xml','utf8').includes('<urlset'));
writeFileSync('docs/evidence/ai-search/metadata-assertions.json', JSON.stringify({results, syntheticScriptInjection:'passed', robotsAndDiscovery:'passed'}, null, 2)+'\n');
console.log('PASS homepage + two articles; canonical IDs, descriptions, JSON, hostile template, robots, llms, sitemap');
