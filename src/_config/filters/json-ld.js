// JSON inside a script is raw text, not HTML. Escape script delimiters too.
export function jsonLd(value) {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, character =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`
  );
}
