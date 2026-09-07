const sanitizeHtml = require('sanitize-html');

// Hardened config: discard every tag/attribute, keep only plain text.
// Any markup in user content is stripped (never passed through to output).
const PLAIN_TEXT_OPTIONS = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: 'discard',
  allowedSchemes: [],
  allowProtocolRelative: false,
  nonTextTags: ['style', 'script', 'iframe', 'object', 'embed', 'link', 'meta', 'base']
};

// Sanitize a free-text field (comments, names, descriptions, bios...).
// - Strips all HTML tags/attributes (discards the tag, keeps safe inner text)
// - Removes control characters and document elements
// - Caps length
const sanitizeText = (input, maxLength = 2000) => {
  if (input == null) return input;
  let value = String(input);

  value = sanitizeHtml(value, PLAIN_TEXT_OPTIONS);

  // Belt-and-suspenders: drop any residual element constructors.
  value = value
    .replace(/<\s*\/?\s*(script|iframe|object|embed|style|meta|base|link|form|svg|math)\b[^>]*>/gi, '')
    .replace(/<\s*\/?\s*[a-zA-Z][^>]{0,256}>/gi, '');

  // Kill control characters commonly smuggled through encoders.
  value = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

  value = value.trim();

  if (maxLength > 0 && value.length > maxLength) {
    value = value.slice(0, maxLength);
  }

  return value;
};

// Sanitize a URL field (event/match images, avatars). Only http(s) absolute
// URLs or same-site relative paths survive; everything else is blanked so a
// javascript:/data: scheme can never reach an img/video/src attribute.
const sanitizeUrl = (url, maxLength = 1000) => {
  if (url == null || url === '') return url;

  let value = String(url).trim();
  if (!value) return value;

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return value.slice(0, maxLength);
      }
    } catch {
      // fall through to reject below
    }
    return '';
  }

  // Allow same-site relative paths only (e.g. /uploads/...), no protocol-relative.
  if (/^\/[^/][^\s'"<>]*$/.test(value)) {
    return value.slice(0, maxLength);
  }

  return '';
};

// Apply sanitizeText to a set of text fields on an object (read-side hardening).
const sanitizeFields = (obj, fields, maxLength = 2000) => {
  if (!obj || typeof obj !== 'object') return obj;
  for (const field of fields) {
    if (obj[field] != null) obj[field] = sanitizeText(obj[field], maxLength);
  }
  return obj;
};

module.exports = { sanitizeText, sanitizeUrl, sanitizeFields };