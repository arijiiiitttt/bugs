const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (ch) => MAP[ch]);
}

export function commentHtml(author, text) {
  return '<p class="comment" title="' + escapeHtml(author) + '">' + escapeHtml(text) + '</p>';
}
