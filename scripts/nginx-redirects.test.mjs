import test from 'node:test';
import assert from 'node:assert/strict';
import {redirectMap} from './nginx-redirects.mjs';

test('legacy directory aliases use direct permanent destinations with and without slash', () => {
  const result = redirectMap('/post/old/ /blog/current/ 301\n/post/old/ /blog/current/ 301\n');
  assert.equal(result.trim().split('\n').length, 2);
  assert.match(result, /"\/post\/old\/" "\/blog\/current\/";/);
  assert.match(result, /"\/post\/old" "\/blog\/current\/";/);
});

test('invalid, conflicting, or external redirect rules fail the build', () => {
  for (const input of ['/old/ https://example.com/ 301', '/old/ //example.com/ 301', '/old/* /new/ 301',
    '/old/ /first/ 301\n/old/ /second/ 301']) {
    assert.throws(() => redirectMap(input));
  }
});
