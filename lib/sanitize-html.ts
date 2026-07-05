import sanitizeHtml from 'sanitize-html';

const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'br'],
  allowedAttributes: {},
  allowedSchemes: [],
};

export function sanitizeRichTextHtml(html: string) {
  return sanitizeHtml(html, RICH_TEXT_OPTIONS);
}
