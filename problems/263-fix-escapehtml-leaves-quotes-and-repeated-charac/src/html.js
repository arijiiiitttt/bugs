export function escapeHtml(value) {
  return String(value)
    .replace('&', '&amp;')
    .replace('<', '&lt;')
    .replace('>', '&gt;');
}

export function commentHtml(author, text) {
  return '<p class="comment" title="' + author + '">' + escapeHtml(text) + '</p>';
}
