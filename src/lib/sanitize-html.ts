import DOMPurify from 'isomorphic-dompurify';

// Phase 19 CP19.5 — HTML sanitization for admin-authored content
// that is later rendered via dangerouslySetInnerHTML on public
// pages. Two-layer defense: every admin server action sanitizes
// before persisting (catches new writes cleanly), every public
// render also sanitizes (catches legacy content + survives any
// future write-side bug).
//
// Allowlist follows the observed admin-authoring pattern across
// 11+ phases: prose with inline formatting, links, and lists.
// Inline images and tables are intentionally excluded — admins
// use ImageUploader (separate URL column on the entity) and have
// never been observed using tables in body content.
//
// Examples (illustrative, not exploit):
//   Input:  "<p>Visit our <a href='https://su.edu.bd'>site</a></p>"
//   Output: same (allowed tags + scheme preserved)
//
//   Input:  "<h1>Big heading</h1><p>Body</p>"
//   Output: "Big heading<p>Body</p>"  — h1 stripped, text kept
//
//   Input:  "<p style='color:red' onclick='x()'>Hello</p>"
//   Output: "<p>Hello</p>"  — style attr + on* handler removed
//
//   Input:  "<a target='_blank' href='https://x'>x</a>"
//   Output: "<a target=\"_blank\" href=\"https://x\"
//                rel=\"noopener noreferrer\">x</a>"
//                — rel auto-stamped via the afterSanitizeAttributes hook below

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'b',
  'i',
  'u',
  's',
  'a',
  'h2',
  'h3',
  'h4',
  'ul',
  'ol',
  'li',
  'blockquote',
  'hr',
  'span',
  'code',
];

const ALLOWED_ATTR = ['href', 'title', 'target', 'rel'];

// Per Decision B: http, https, mailto, tel, and same-origin
// relative paths (leading `/`). Hash-only fragments (#section)
// also permitted for in-page links.
const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel):|\/|#)/i;

// One-time hook registration. isomorphic-dompurify exposes the
// same `addHook` surface as DOMPurify; the hook only ever fires
// inside our own sanitize() call so it doesn't leak into other
// DOMPurify consumers (there are none in this codebase, but the
// guard is defensive).
let hooksRegistered = false;
function ensureHooks(): void {
  if (hooksRegistered) return;
  hooksRegistered = true;
  // After per-attribute sanitization, stamp rel="noopener noreferrer"
  // onto any anchor with target="_blank" so external links can't
  // reach back via window.opener. DOMPurify passes a node that
  // supports getAttribute/setAttribute regardless of platform
  // (browser DOM Element vs jsdom Element on Node) — avoid using
  // the global `Element` constructor here since it isn't defined
  // in the Node prerender environment.
  type HookNode = {
    nodeName: string;
    getAttribute?: (n: string) => string | null;
    setAttribute?: (n: string, v: string) => void;
  };
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    const n = node as unknown as HookNode;
    if (
      n.nodeName === 'A' &&
      typeof n.getAttribute === 'function' &&
      typeof n.setAttribute === 'function' &&
      n.getAttribute('target') === '_blank'
    ) {
      n.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

// Sanitize a string of HTML against the project allowlist.
// Returns a clean string suitable for dangerouslySetInnerHTML.
// `null` / `undefined` / empty input returns "" — admin server
// actions can pass optional fields without a separate null check.
export function sanitizeHtml(input: string | null | undefined): string {
  if (input === null || input === undefined) return '';
  if (typeof input !== 'string') return '';
  if (input.length === 0) return '';
  ensureHooks();
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    // Belt-and-suspenders: explicit deny for the worst classes
    // even though they're already absent from the allowlist.
    FORBID_TAGS: [
      'script', 'iframe', 'object', 'embed', 'form', 'input',
      'style', 'link', 'meta', 'base', 'frame', 'frameset',
      'applet', 'audio', 'video', 'source', 'track',
      'math', 'svg', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    FORBID_ATTR: ['style'],
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false,
  }) as string;
}

// Convenience for the many `string[]` paragraph fields.
export function sanitizeHtmlArray(
  input: readonly (string | null | undefined)[] | null | undefined,
): string[] {
  if (!Array.isArray(input)) return [];
  return input.map((p) => sanitizeHtml(p));
}
