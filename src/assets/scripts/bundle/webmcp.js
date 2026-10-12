const annotations = {
  readOnlyHint: true,
  untrustedContentHint: true,
  consequentialHint: false
};

const schema = properties => ({
  type: 'object',
  properties,
  additionalProperties: false
});

const postProperties = {
  title: {type: 'string'},
  url: {type: 'string'},
  date: {type: 'string'},
  description: {type: 'string'},
  tags: {type: 'array', items: {type: 'string'}},
  content: {type: 'string'}
};

const loadPosts = async signal => {
  const response = await fetch('/search.json', {signal});
  if (!response.ok) throw new Error(`Blog search index returned HTTP ${response.status}`);
  const data = await response.json();
  return Array.isArray(data.posts) ? data.posts : [];
};

const normalize = value => String(value || '').toLowerCase();

const matches = (post, query) => {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return 0;

  const fields = [
    [post.title, 5],
    [post.description, 3],
    [post.tags?.join(' '), 3],
    [post.content, 1]
  ];

  return terms.reduce((score, term) => score + fields.reduce((fieldScore, [value, weight]) => {
    return normalize(value).includes(term) ? fieldScore + weight : fieldScore;
  }, 0), 0);
};

const searchPosts = async ({query, tag, limit = 8}, {signal} = {}) => {
  const posts = await loadPosts(signal);
  const filtered = tag
    ? posts.filter(post => post.tags?.some(postTag => normalize(postTag) === normalize(tag)))
    : posts;
  const results = query
    ? filtered.map(post => ({post, score: matches(post, query)})).filter(result => result.score > 0)
    : filtered.map(post => ({post, score: 0}));

  results.sort((left, right) => right.score - left.score || String(right.post.date).localeCompare(String(left.post.date)));
  return {
    query: query || null,
    tag: tag || null,
    count: results.length,
    results: results.slice(0, Math.min(Math.max(Number(limit) || 8, 1), 20)).map(({post, score}) => ({
      ...post,
      score
    }))
  };
};

const tools = [
  {
    name: 'search_blog_posts',
    title: 'Search jace.pro posts',
    description: 'Search Jace Benson\'s public blog by title, description, tags, and indexed content. Returns matching post metadata and snippets.',
    inputSchema: schema({
      query: {type: 'string', minLength: 1, description: 'Words or phrases to search for.'},
      tag: {type: 'string', description: 'Optional exact tag filter.'},
      limit: {type: 'integer', minimum: 1, maximum: 20, description: 'Maximum number of results, from 1 to 20.'}
    }),
    execute: searchPosts,
    annotations
  },
  {
    name: 'list_blog_posts',
    title: 'List jace.pro posts',
    description: 'List recent public jace.pro posts, optionally filtered by an exact tag.',
    inputSchema: schema({
      tag: {type: 'string', description: 'Optional exact tag filter.'},
      limit: {type: 'integer', minimum: 1, maximum: 20, description: 'Maximum number of posts, from 1 to 20.'}
    }),
    execute: async (input, options) => searchPosts({...input, query: ''}, options),
    annotations
  },
  {
    name: 'open_blog_post',
    title: 'Open a jace.pro post',
    description: 'Open a public jace.pro blog post in the current browser tab by its site-relative URL.',
    inputSchema: schema({
      url: {type: 'string', minLength: 1, description: 'Site-relative post URL, such as /blog/example/.'}
    }),
    execute: async ({url}) => {
      const destination = new URL(url, window.location.origin);
      if (destination.origin !== window.location.origin || !destination.pathname.startsWith('/')) {
        throw new Error('Only same-site jace.pro URLs can be opened.');
      }
      window.location.assign(destination.toString());
      return {url: destination.toString()};
    },
    annotations
  },
  {
    name: 'read_current_blog_page',
    title: 'Read the current jace.pro page',
    description: 'Return the title, URL, description, and visible text from the current jace.pro page.',
    inputSchema: schema({}),
    execute: async () => ({
      title: document.title,
      url: window.location.href,
      description: document.querySelector('meta[name="description"]')?.content || '',
      content: document.querySelector('main')?.innerText.slice(0, 5000) || document.body.innerText.slice(0, 5000)
    }),
    annotations
  }
];

const registerTools = async () => {
  if (!window.isSecureContext || typeof document.modelContext?.registerTool !== 'function') return;

  for (const tool of tools) {
    try {
      await document.modelContext.registerTool(tool);
    } catch (error) {
      console.warn(`WebMCP could not register ${tool.name}`, error);
    }
  }
};

registerTools();
