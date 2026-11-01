import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, stat, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
import {copyImageCache} from '../src/_config/image-cache.js';

test('generated images survive a clean output directory', async () => {
  const root = await mkdtemp(join(tmpdir(), 'blog-cache-'));
  try {
    const output = join(root, 'dist');
    const cache = join(root, 'cache');
    await mkdir(join(output, 'img'), {recursive: true});
    await writeFile(join(output, 'img', 'image.webp'), 'optimized image');
    await writeFile(join(output, 'old.html'), 'removed page');
    const before = await stat(join(output, 'img', 'image.webp'));
    await copyImageCache(join(output, 'img'), cache);
    await rm(output, {recursive: true});
    await copyImageCache(cache, join(output, 'img'));
    assert.equal(await readFile(join(output, 'img', 'image.webp'), 'utf8'), 'optimized image');
    assert.ok(Math.abs((await stat(join(output, 'img', 'image.webp'))).mtimeMs - before.mtimeMs) < 2);
    await assert.rejects(readFile(join(output, 'old.html')), {code: 'ENOENT'});
    await copyImageCache(join(root, 'missing'), join(root, 'unused'));
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

test('separate builds reuse unchanged images and invalidate edited images', async () => {
  const root = await mkdtemp(join(tmpdir(), 'blog-images-'));
  const source = join(root, 'source.png');
  const output = join(root, 'img');
  const build = () => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `
    import Image from '@11ty/eleventy-img';
    const result = await Image(${JSON.stringify(source)}, {formats:['webp'], widths:[16], outputDir:${JSON.stringify(output)}, urlPath:'/img/'});
    console.log(JSON.stringify(result.webp[0]));
  `], {encoding: 'utf8'}));
  try {
    await sharp({create: {width:32, height:32, channels:3, background:'#f00'}}).png().toFile(source);
    const first = build();
    const before = await stat(first.outputPath);
    const second = build();
    assert.equal(second.url, first.url);
    assert.equal((await stat(second.outputPath)).mtimeMs, before.mtimeMs);
    await sharp({create: {width:48, height:48, channels:3, background:'#00f'}}).png().toFile(source);
    const edited = build();
    assert.notEqual(edited.url, first.url);
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});
