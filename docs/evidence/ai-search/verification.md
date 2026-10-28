# Metadata verification

Base: 9856981552ed042c093f58652e5481311248b86e

Only BlogPosting JSON serialization/canonical identifiers and description capture changed. No posts, routes, dates, styling, bot rules, llms.txt or sitemap sources changed.

## Commands and results

- Inspected clean source checkout, origin, readme.md, package.json, Eleventy configuration, project instructions and relevant templates before editing. Fetched origin/main and created an isolated worktree on ai-search-jace-pro-1.
- gh auth status: authenticated as jacebenson. Repository API confirms jacebenson/blog, default branch main.
- Baseline: mise exec -- npm ci, exit 0; mise exec -- npm run build, exit 0. Runtime unexpectedly resolved Node 26.8.1 despite mise reporting 24.19.0. Baseline output retained in scratch/jace-pro-baseline. Baseline uses default localhost canonical origin, which has no visible effect.
- Corrected PATH using export PATH="$(mise where node@24.19.0)/bin:$PATH". node --version: v24.19.0. No configuration files changed.
- npm ci: exit 0 under Node 24.19.0.
- npm run validate: exit 0.
- URL=https://jace.pro npm run build: exit 0. This runs validate, clean, and the production Eleventy build.
- node docs/evidence/ai-search/assert-metadata.mjs: exit 0. Parses generated homepage and two articles, asserts canonical IDs and apostrophes, renders the actual BlogPosting template with hostile synthetic values, and checks discovery files and shared AI-bot allow group.
- Initial robots assertion failed because it expected adjacent User-agent and Allow lines. Corrected the test to inspect the existing shared group. No bot rules changed.
- Browser capture: exit 0. Actual baseline and current builds served from separate HTTP roots, using Playwright Chromium at desktop 1440x1000 and mobile 390x844. All six page/viewport pairs have identical visible body text and byte-identical screenshot pixels. Twelve PNGs and browser-manifest.json are included.
- Pixel comparison: Pillow ImageChops found no differences in any paired screenshots.
- Vision inspection of current history article at desktop/mobile found the existing layered-color heading, with no new overflow or search error. The heading is unchanged pixel-for-pixel. This is metadata-only work.
- git diff --check: exit 0. Original source checkout remains clean.

## Reproduction

Run commands from the repository root. Build with the production URL supplied through the existing URL environment variable, then run the metadata assertion script. The synthetic fixture is in-memory and produces no page or asset.

capture.cjs records the browser procedure used here. It requires Playwright available to Node, baseline output served on 127.0.0.1:18763 and current output on 127.0.0.1:18762. Its evidence output path reflects this isolated worktree.

## Limits

No merge, deployment, production writes, Cloudflare configuration or measurement changes. No claim of search indexing, ranking, or that llms.txt changes ranking. This bounded task covers jace.pro metadata only, not the other three sites. CI status must be read from the draft PR; local passes are not remote CI passes.
